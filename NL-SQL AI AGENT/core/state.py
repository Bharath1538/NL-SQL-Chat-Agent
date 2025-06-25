# core/state.py
from typing import TypedDict, List, Dict, Any, Optional

class AgentState(TypedDict):
    question: str
    user_email: str
    designation: str
    tables_requested: List[str]
    crud_operation: str
    allowed_tables: List[str]
    forbidden_tables: List[str]
    permission_status: str
    sql_query: Optional[str]
    response: Optional[str]