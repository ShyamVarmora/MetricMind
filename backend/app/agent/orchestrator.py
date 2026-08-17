import re

from app.agent.business_query import execute_question
from app.agent.governance import QueryGovernance
from app.agent.root_cause import analyze_europe_margin
from app.agent.sales_analysis import analyze_sales_increase, format_sales_analysis


class AgentOrchestrator:
    """Route natural-language requests through governed business analysis."""

    def __init__(self):
        self.governance = QueryGovernance()

    @staticmethod
    def _reject_direct_sql(question: str):
        patterns = [r"\bselect\b", r"\binsert\b", r"\bupdate\b", r"\bdelete\b", r"\bdrop\b", r"\balter\b", r"\btruncate\b", r"\bcreate\s+table\b", r"\bexecute\b", r"\bexec\b"]
        if any(re.search(pattern, question.lower()) for pattern in patterns):
            raise ValueError("Direct SQL or database commands are not supported.")

    def _root_cause(self):
        result = analyze_europe_margin()
        rows = result.get("quarters", [])
        if len(rows) < 2:
            answer = "There are not two comparable European quarters in the database, so I cannot establish a margin change."
        else:
            latest, previous, change = result["latest"], result["previous"], result["margin_change"]
            if change >= 0:
                answer = f"European margin did not drop. It changed from {previous['margin_percent']:.2f}% in Q{previous['quarter']} {previous['year']} to {latest['margin_percent']:.2f}% in Q{latest['quarter']} {latest['year']}, an improvement of {change:.2f} percentage points."
            else:
                driver = "shipping cost" if abs(result["shipping_change"]) >= abs(result["material_change"]) else "material cost"
                answer = f"European margin dropped from {previous['margin_percent']:.2f}% in Q{previous['quarter']} {previous['year']} to {latest['margin_percent']:.2f}% in Q{latest['quarter']} {latest['year']}, a decline of {abs(change):.2f} percentage points. The largest available cost movement was {driver}: shipping changed by ₹{result['shipping_change']:,.2f} and material cost changed by ₹{result['material_change']:,.2f}. Revenue changed by ₹{result['revenue_change']:,.2f}. The current MySQL dataset exposes product cost and freight, but not a separate other-cost field."
        return {
            "query": {"metric": "marginPercent", "filters": {"Europe": True}, "group_by": ["quarter"], "time_range": "latest two available quarters"},
            "answer": answer,
            "data": {"quarters": rows, "cost_breakdown": result.get("cost_breakdown", [])},
            "api_trace": [{"endpoint": "data_service.europe_margin_quarters", "metric": "marginPercent", "operation": "primary_analysis"}, {"endpoint": "data_service.europe_cost_breakdown", "metric": "cost", "operation": "secondary_breakdown"}],
            "sql": "\n\n-- Secondary cost breakdown --\n\n".join(result.get("sql", [])),
            "params": result.get("params", []),
            "reasoning_steps": ["Filter the business data to Europe.", "Compare the latest two available quarters and calculate margin movement.", "Automatically query a secondary breakdown of product and shipping costs.", "Compare cost changes and identify the largest available driver.", "Return a business explanation without inventing unavailable cost fields."],
        }

    def execute(self, question: str):
        if not question or not question.strip():
            raise ValueError("Question cannot be empty.")
        self._reject_direct_sql(question)
        lower = question.lower()

        if "margin" in lower and ("why" in lower or re.search(r"\b(drop|dropped|decrease|decreased|fall|fell)\b", lower)) and re.search(r"\beurop\w*\b", lower):
            result = self._root_cause()
        elif "why" in lower and re.search(r"\b(sales|sale|revenue)\b", lower):
            result = self._sales_why(question)
        elif re.search(r"\b(sales|sale|revenue)\b", lower) and re.search(r"\b(increase|increased|rise|rising|grew|growth|decrease|decreased|decline|declined)\b", lower):
            result = self._sales_why(question)
        else:
            try:
                result = execute_question(question)
            except ValueError as exc:
                result = {
                    "query": {"type": "out_of_scope"},
                    "answer": str(exc),
                    "data": [],
                    "api_trace": [{"endpoint": "agent.conversation", "metric": "unsupported", "operation": "no_database_query"}],
                    "sql": None,
                    "params": [],
                    "reasoning_steps": ["No supported business metric was found, so no database query was executed."],
                }

        database_steps = len([step for step in result.get("api_trace", []) if step.get("operation") != "no_database_query"])
        for _ in range(database_steps):
            self.governance.record_query()
        payload = result.get("data") or []
        row_count = len(payload) if isinstance(payload, list) else sum(len(value) for value in payload.values() if isinstance(value, list))
        self.governance.validate_row_count(row_count)
        return result

    @staticmethod
    def _sales_why(question: str):
        analysis = analyze_sales_increase(question)
        is_q3 = analysis.get("period") == "Q3"
        return {
            "query": {
                "metric": "totalRevenue",
                "filters": {"scope": analysis.get("scope")},
                "group_by": ["quarter", "country", "product"] if is_q3 else ["month", "country", "product"],
                "time_range": analysis.get("period"),
            },
            "answer": format_sales_analysis(analysis),
            "data": analysis.get("comparison", []),
            "api_trace": [
                {"endpoint": "agent.sales_period_comparison", "metric": "totalRevenue", "operation": "primary_analysis"},
                {"endpoint": "agent.sales_country_breakdown", "metric": "totalRevenue", "operation": "secondary_breakdown"},
                {"endpoint": "agent.sales_product_breakdown", "metric": "totalRevenue", "operation": "secondary_breakdown"},
            ],
            "sql": None,
            "params": [],
            "reasoning_steps": [
                "Identify the comparison period for the sales change.",
                "Measure the change in sales.",
                "Drill down by geography to find major contributors.",
                "Drill down by product to find major contributors.",
                "Return only measured drivers supported by the database.",
            ],
        }
