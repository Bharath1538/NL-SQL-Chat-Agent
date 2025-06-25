import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..','..')))
from core.state import AgentState
# from core.nodes.generate_sql import llm
from langchain_core.messages import HumanMessage
from config.settings import GROQ_API_KEY
import os
from langchain_groq import ChatGroq
if "GROQ_API_KEY" not in os.environ:
            os.environ["GROQ_API_KEY"] =GROQ_API_KEY
llm = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0.7)
def format_answer(state: AgentState) -> AgentState:
    if not state["response"] or not isinstance(state["response"], str):
        return state

    answer_prompt = f"""
    You are a data analyst assistant. Convert the SQL query results into a clear, human-readable answer.
    ALWAYS BE STRICTLY ACCURATE OR ELSE I'LL THRASH YOU.
    Format it neatly and clearly describe what was asked and what was found.
    Follow these rules:
    1.Always show it as a table like it is viewed in a spreadsheet.
    2. Start with a direct answer to the question
    3. Present the data in a clean, organized format
    

    Question: {state['question']}
    SQL Query: {state.get('sql_query', '')}
    SQL Results: {state['response']}

    Formatted Answer:
    """
    try:
        formatted_answer = llm.invoke([HumanMessage(content=answer_prompt)]).content.strip()
        return {**state, "response": formatted_answer}
    except Exception as e:
        return {**state, "response": f"Error formatting response: {str(e)}"}
