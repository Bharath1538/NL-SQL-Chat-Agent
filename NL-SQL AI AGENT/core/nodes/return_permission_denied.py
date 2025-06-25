import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..','..')))
from core.state import AgentState
def return_permission_denied(state: AgentState) -> AgentState:
    msg = f"You don't have permission to perform '{state['crud_operation']}' on {', '.join(state['forbidden_tables'])}"
    return {**state, "response": msg}
