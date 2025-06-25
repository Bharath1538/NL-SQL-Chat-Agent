import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from core.state import AgentState
from langgraph.graph import StateGraph,END
from core.nodes.extract_table import extract_table_and_operation
from core.nodes.check_permissions import check_user_permissions
from core.nodes.generate_sql import generate_sql_query
from core.nodes.execute_sql import run_sql_query
from core.nodes.format_answer import format_answer
from core.nodes.return_permission_denied import return_permission_denied
from core.nodes.decide_next_step import decide_next_step


workflow = StateGraph(AgentState)
workflow.add_node("extract_table_and_operation", extract_table_and_operation)
workflow.add_node("check_user_permissions", check_user_permissions)
workflow.add_node("generate_sql_for_allowed", generate_sql_query)
workflow.add_node("run_sql_query", run_sql_query)
workflow.add_node("format_answer", format_answer)
workflow.add_node("return_permission_denied", return_permission_denied)
workflow.set_entry_point("extract_table_and_operation")
workflow.add_edge("extract_table_and_operation", "check_user_permissions")
workflow.add_conditional_edges(
    "check_user_permissions",
    decide_next_step,
    {
        "generate_sql_for_allowed": "generate_sql_for_allowed",
        "return_permission_denied": "return_permission_denied"
    }
)
workflow.add_edge("generate_sql_for_allowed", "run_sql_query")
workflow.add_edge("run_sql_query", "format_answer")
workflow.add_edge("format_answer", END)
workflow.add_edge("return_permission_denied", END)
app = workflow.compile()
