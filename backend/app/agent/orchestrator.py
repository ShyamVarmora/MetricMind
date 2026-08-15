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

            if re.search(
                pattern,
                question.lower()
            ):
                raise ValueError(
                    "Direct SQL or database commands "
                    "are not supported."
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
                "No data was found for the "
                "requested metric."
            )

        # --------------------------------
        # Total Revenue
        # --------------------------------

        if metric == "totalRevenue":

            value = data[0].get(
                "total_revenue"
            )

            if value is not None:
                return (
                    f"The total revenue is "
                    f"{value:,.2f}."
                )

        # --------------------------------
        # Total Cost
        # --------------------------------

        if metric == "totalCost":

            value = data[0].get(
                "total_cost"
            )

            if value is not None:
                return (
                    f"The total cost is "
                    f"{value:,.2f}."
                )

        # --------------------------------
        # Shipping Cost
        # --------------------------------

        if metric == "shippingCost":

            value = data[0].get(
                "shipping_cost"
            )

            if value is not None:
                return (
                    f"The total shipping cost is "
                    f"{value:,.2f}."
                )

        # --------------------------------
        # Material Cost
        # --------------------------------

        if metric == "materialCost":

            if data[0].get("available") is False:
                return (
                    "Required material cost data "
                    "is unavailable."
                )

        # --------------------------------
        # Other Cost
        # --------------------------------

        if metric == "otherCost":

            if data[0].get("available") is False:
                return (
                    "Required other cost data "
                    "is unavailable."
                )

        # --------------------------------
        # Margin Percent
        # --------------------------------

        if metric == "marginPercent":

            value = data[0].get(
                "margin_percent"
            )

            if value is not None:
                return (
                    f"The overall margin is "
                    f"{value:.2f}%."
                )

        # --------------------------------
        # Transaction Count
        # --------------------------------

        if metric == "transactionCount":

            value = data[0].get(
                "transaction_count"
            )

            if value is not None:
                return (
                    f"The total number of transactions "
                    f"is {value:,}."
                )

        # --------------------------------
        # Customers
        # --------------------------------

        if metric == "customers":

            value = data[0].get(
                "total_customers"
            )

            if value is not None:
                return (
                    f"The total number of customers "
                    f"is {value:,}."
                )

        # --------------------------------
        # Products
        # --------------------------------

        if metric == "products":

            value = data[0].get(
                "total_products"
            )

            if value is not None:
                return (
                    f"The total number of products "
                    f"is {value:,}."
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
        Execute the governed Europe margin analysis.

        Uses only data that actually exists
        in the current MySQL database.
        """

        # --------------------------------
        # Query 1
        # --------------------------------

        self.governance.record_query()

        result = execute_europe_margin_analysis()

        self.governance.validate_row_count(2)

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
            )

            if result[
                "cost_breakdown_available"
            ]["material_cost"]:

                answer += (
                    "Material cost data was available "
                    "and was included in the analysis."
                )

            else:

                answer += (
                    "Separate material cost and other "
                    "cost breakdowns are unavailable."
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
                "product cost and shipping cost. "
                "Separate material cost and other "
                "cost breakdowns are unavailable."
            )

        return {
            "query": {
                "metric": "marginPercent",
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
                    "metric": "marginPercent",
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
        # Validate input
        # --------------------------------

        if not question or not question.strip():
            raise ValueError(
                "Question cannot be empty."
            )

        # --------------------------------
        # Europe Margin Question
        # --------------------------------

        question_lower = question.lower()

        if (
            "europe" in question_lower
            and "margin" in question_lower
        ):
            return self.execute_europe_margin_analysis()

        # --------------------------------
        # Create validated query
        # --------------------------------

        query = self.create_query(question)

        # --------------------------------
        # Enforce query limit
        # --------------------------------

        self.governance.record_query()

        # --------------------------------
        # Execute through trusted
        # data layer
        # --------------------------------

        result = execute_metric_query(
            query.metric
        )

        # --------------------------------
        # Enforce row limit
        # --------------------------------

        self.governance.validate_row_count(
            len(result)
        )

        # --------------------------------
        # Determine API endpoint
        # --------------------------------

        api_endpoint = get_api(
            query.metric
        )

        # --------------------------------
        # Generate final answer
        # --------------------------------

        answer = self.generate_answer(
            query.metric,
            result
        )

        # --------------------------------
        # Return structured result
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