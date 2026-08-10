MAX_QUERIES_PER_TURN = 5
MAX_ROWS_PER_QUERY = 1000


class GovernanceError(Exception):
    """Raised when an agent request violates governance limits."""
    pass


class QueryGovernance:
    def __init__(self):
        self.query_count = 0

    def check_query_limit(self):
        if self.query_count >= MAX_QUERIES_PER_TURN:
            raise GovernanceError(
                "Maximum query limit exceeded."
            )

    def record_query(self):
        self.check_query_limit()
        self.query_count += 1

    @staticmethod
    def validate_row_count(row_count: int):
        if row_count > MAX_ROWS_PER_QUERY:
            raise GovernanceError(
                "Maximum row limit exceeded."
            )