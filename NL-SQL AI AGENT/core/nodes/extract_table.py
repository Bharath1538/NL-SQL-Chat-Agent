import warnings
from langchain_core._api import LangChainDeprecationWarning

warnings.filterwarnings("ignore", category=LangChainDeprecationWarning)

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..','..')))
import os
from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq
from core.state import AgentState
from config.settings import GROQ_API_KEY
if "GROQ_API_KEY" not in os.environ:
    os.environ["GROQ_API_KEY"] =GROQ_API_KEY
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2)
from langchain_community.chat_models import ChatOpenAI

def extract_table_and_operation(state: AgentState) -> AgentState:
    # print("Extracting tables and operations...")
    prompt = f"""
You are a PostgreSQL expert. Based on the following question, identify:
1. The Actual Table(s) involved in the user question.
2. The type of operation (CREATE, READ, UPDATE, DELETE)
3. Based on the operation, return the correct SQL verb (INSERT, SELECT, UPDATE, DELETE)
4. use EXACT table names from the database like inventory_levels,production_schedules,etc. If you fumble this step I will THRASH YOU.
5. Never assume table choices on your own or I will thrash you.
Only output a JSON object with these two keys:
{{"tables": ["table1", "table2"], "operation": "SELECT"}}

Question: {state['question']}
"""

    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        parsed = eval(response.content)
        return {
            **state,
            "tables_requested": parsed.get("tables", []),
            "crud_operation": parsed.get("operation", "").upper()
        }
    except Exception as e:
        print("Parsing error:", str(e))
        return {
            **state,
            "tables_requested": [],
            "crud_operation": ""
        }