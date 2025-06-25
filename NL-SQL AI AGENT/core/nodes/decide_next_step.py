import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..','..')))
from core.state import AgentState
def decide_next_step(state: AgentState) -> str:
    status = state["permission_status"]
    if status == "denied":
        return "return_permission_denied"
    elif status == "partial":
        return "generate_sql_for_allowed"
    else:
        return "generate_sql_for_allowed"
