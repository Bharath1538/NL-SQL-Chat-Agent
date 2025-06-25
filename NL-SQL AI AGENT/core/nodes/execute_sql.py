import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..','..')))
from core.state import AgentState
from core.nodes.embeddings1time import db_supply

def run_sql_query(state: AgentState) -> AgentState:
    sql_query = state.get("sql_query")
    # print(sql_query)
    if not sql_query:
        print("No SQL query found. Skipping execution.")
        return {
            **state,
            "response": "No valid SQL query was generated."
        }
    try:
        result = db_supply.run(sql_query)
        return {**state, "response": result}
    except Exception as e:
        return {**state, "response": f"SQL Execution Error: {str(e)}"}