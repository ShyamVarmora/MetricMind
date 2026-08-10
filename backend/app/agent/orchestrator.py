import re

from app.agent.governance import QueryGovernance
from app.agent.schemas import AgentQuery

from app.semantic_layer import (
    get_metric,
    get_api,
    is_allowed_metric
)

from app.data_service import (
    execute_metric_query,
    execute_europe_margin_analysis
)


class AgentOrchestrator:

    def __init__(self):
        self.governance = QueryGovernance()

    # --------------------------------
    # Create Structured Query
    # --------------------------------

    def create_query(self, question: str) -> AgentQuery:
        """
        Convert natural language into a validated
        structured query.

        The agent does not generate or execute SQL.
        """

        if not question or not question.strip():
            raise ValueError(
                "Question cannot be empty."
            )

        # --------------------------------
        # Reject SQL / database commands
        # --------------------------------

        sql_patterns = [
            r"\bselect\b",
            r"\binsert\b",
            r"\bupdate\b",
            r"\bdelete\b",
            r"\bdrop\b",
            r"\balter\b",
            r"\btruncate\b",
            r"\bcreate\s+table\b",
            r"\bexecute\b",
            r"\bexec\b"
        ]

        for pattern in sql_patterns:
            if re.search(pattern, question.lower()):
                raise ValueError(
                    "Direct SQL or database commands are not supported."
                )

        # --------------------------------
        # Detect metric
        # --------------------------------

        metric = get_metric(question)

        if metric is None:
            raise ValueError(
                "Unable to identify a supported metric."
            )

        # --------------------------------
        # Validate metric
        # --------------------------------

        if not is_allowed_metric(metric):
            raise ValueError(
                f"Unsupported metric: {metric}"
            )

        # --------------------------------
        # Create structured query
        # --------------------------------

        return AgentQuery(
            metric=metric,
            filters=[],
            group_by=[],
            time_range=None
        )

    # --------------------------------
    # Generate Natural Language Answer
    # --------------------------------

    def generate_answer(
        self,
        metric: str,
        data: list[dict]
    ) -> str:
        """
        Generate a natural-language answer
        from trusted backend data.

        No SQL is generated here.
        """

        if not data:
            return (
                "No data was found for the requested metric."
            )

        # Total Sales / Revenue
        if metric == "totalSales":
            value = data[0].get("total_sales")

            if value is not None:
                return (
                    f"The total revenue is "
                    f"{value:,.2f}."
                )

        # Orders
        if metric == "orders":
            value = data[0].get("total_orders")

            if value is not None:
                return (
                    f"The total number of orders is "
                    f"{value:,}."
                )

        # Customers
        if metric == "customers":
            value = data[0].get("total_customers")

            if value is not None:
                return (
                    f"The total number of customers is "
                    f"{value:,}."
                )

        # Products
        if metric == "products":
            value = data[0].get("total_products")

            if value is not None:
                return (
                    f"The total number of products is "
                    f"{value:,}."
                )

        # Profit
        if metric == "profit":
            value = data[0].get("profit")

            if value is not None:
                return (
                    f"The total profit is "
                    f"{value:,.2f}."
                )

        # Monthly Sales
        if metric == "monthlySales":
            return (
                "Here is the monthly sales breakdown."
            )

        return (
            f"The requested {metric} data "
            "was retrieved successfully."
        )

    # --------------------------------
    # Europe Margin Analysis
    # --------------------------------

    def execute_europe_margin_analysis(self):
        """
        Execute the multi-step Europe margin analysis.

        Uses only data that actually exists in the
        current MySQL database.
        """

        # Query 1: Retrieve latest two European quarters
        self.governance.record_query()

        result = execute_europe_margin_analysis()

        self.governance.validate_row_count(
            2
        )

        latest = result["latest_quarter"]
        previous = result["previous_quarter"]

        change = result[
            "margin_change_percentage_points"
        ]

        # --------------------------------
        # Generate explanation
        # --------------------------------

        if change < 0:

            answer = (
                f"European margin decreased from "
                f"{previous['margin_percent']:.2f}% in "
                f"Q{previous['CalendarQuarter']} "
                f"{previous['CalendarYear']} to "
                f"{latest['margin_percent']:.2f}% in "
                f"Q{latest['CalendarQuarter']} "
                f"{latest['CalendarYear']}, "
                f"a decline of {abs(change):.2f} "
                "percentage points. "
                "The available cost data includes "
                "product cost and freight, but separate "
                "material and other cost breakdowns "
                "are not available."
            )

        else:

            answer = (
                f"European margins did not drop. "
                f"Margin increased from "
                f"{previous['margin_percent']:.2f}% in "
                f"Q{previous['CalendarQuarter']} "
                f"{previous['CalendarYear']} to "
                f"{latest['margin_percent']:.2f}% in "
                f"Q{latest['CalendarQuarter']} "
                f"{latest['CalendarYear']}, "
                f"an improvement of {change:.2f} "
                "percentage points. "
                "The available cost data includes "
                "product cost and freight; separate "
                "material and other cost breakdowns "
                "are not available."
            )

        return {
            "query": {
                "metric": "profit",
                "filters": ["Europe"],
                "group_by": ["quarter"],
                "time_range": (
                    "latest two available quarters"
                )
            },

            "answer": answer,

            "data": result,

            "api_trace": [
                {
                    "endpoint": (
                        "data_service."
                        "execute_europe_margin_analysis"
                    ),
                    "metric": "profit",
                    "operation": "database_query"
                }
            ]
        }

    # --------------------------------
    # Execute Agent Request
    # --------------------------------

    def execute(self, question: str):
        """
        Execute one governed agent request.
        """

        # --------------------------------
        # Step 1: Validate input
        # --------------------------------

        if not question or not question.strip():
            raise ValueError(
                "Question cannot be empty."
            )

        # --------------------------------
        # Step 2: Detect special
        # Europe margin question
        # --------------------------------

        question_lower = question.lower()

        if (
            "europe" in question_lower
            and "margin" in question_lower
        ):
            return self.execute_europe_margin_analysis()

        # --------------------------------
        # Step 3: Create validated query
        # --------------------------------

        query = self.create_query(
            question
        )

        # --------------------------------
        # Step 4: Enforce query limit
        # --------------------------------

        self.governance.record_query()

        # --------------------------------
        # Step 5: Execute through
        # trusted data layer
        # --------------------------------

        result = execute_metric_query(
            query.metric
        )

        # --------------------------------
        # Step 6: Enforce row limit
        # --------------------------------

        self.governance.validate_row_count(
            len(result)
        )

        # --------------------------------
        # Step 7: Determine API endpoint
        # --------------------------------

        api_endpoint = get_api(
            query.metric
        )

        # --------------------------------
        # Step 8: Generate final answer
        # --------------------------------

        answer = self.generate_answer(
            query.metric,
            result
        )

        # --------------------------------
        # Step 9: Return structured result
        # --------------------------------

        return {
            "query": query.model_dump(),

            "answer": answer,

            "data": result,

            "api_trace": [
                {
                    "endpoint": api_endpoint,
                    "metric": query.metric,
                    "operation": "database_query"
                }
            ]
        }