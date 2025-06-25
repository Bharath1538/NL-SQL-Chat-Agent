import warnings
from langchain_core._api import LangChainDeprecationWarning

warnings.filterwarnings("ignore", category=LangChainDeprecationWarning)

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..','..')))

import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage
from langchain_core.runnables import RunnablePassthrough
from utils.helpers import extract_sql_query
# from core.nodes.embeddings1time import retriever2
# generate_sql.py
from langchain_core.documents import Document
from core.nodes.embeddings1time import get_retriever,db_supply
from core.state import AgentState
from config.settings import GROQ_API_KEY

def generate_sql_query(state: AgentState) -> AgentState:
    # print("Generating SQL query...")

    if not state["allowed_tables"]:
        print("No allowed tables. Skipping SQL generation.")
        return state


    llm = ChatGroq(
        model_name="llama-3.3-70b-versatile",
        temperature=0.7
    )
    

    from langchain_openai import ChatOpenAI
    from langchain_community.chat_models import ChatOpenAI

    # Get retriever
    retriever = get_retriever()
    question = state["question"]
    allowed_tables = state["allowed_tables"]

    def get_relevant_schema(question: str, allowed_tables: list) -> str:
        """Retrieve and combine schema information from both vector search and allowed tables"""
        # 1. Get schema for all explicitly allowed tables first
        allowed_schemas = []
        for table in allowed_tables:
            try:
                table_info = db_supply.get_table_info([table])
                allowed_schemas.append(
                    Document(page_content=table_info, metadata={"table": table})
                )
                # print(f"Added schema for allowed table: {table}")
            except Exception as e:
                print(f"Could not get schema for allowed table {table}: {e}")

        # 2. Get relevant docs from vector store
        try:
            retrieved_docs = retriever.invoke(question)
            # print(f"Retrieved {len(retrieved_docs)} relevant schemas from vector store")
        except Exception as e:
            print(f"Vector retrieval failed: {e}")
            retrieved_docs = []

        # 3. Combine with priority to allowed tables
        combined_docs = allowed_schemas + retrieved_docs
        
        # 4. Remove duplicates while preserving order
        seen_tables = set()
        unique_docs = []
        for doc in combined_docs:
            table = doc.metadata["table"]
            if table not in seen_tables:
                seen_tables.add(table)
                unique_docs.append(doc)
                # print(f"📄 Using schema for table: {table}")

        return "\n\n".join([doc.page_content for doc in unique_docs])

    # Get combined schema
    schema = get_relevant_schema(question, allowed_tables)

    # Enhanced prompt template
    template = """You are a PostgreSQL expert. Generate a SQL query following these rules:
    1. Use ONLY these tables: {allowed_tables}
    2. Never use tables not listed above
    3. Use only columns that exist in the schema
    4. Make it simple and efficient

    Schema Information:
    {schema}

    User Question: {question}

    Write ONLY the SQL query, nothing else:
    """
    prompt = ChatPromptTemplate.from_template(template)

    # SQL generation chain
    sql_chain = (
        prompt
        | llm.bind(stop=["\nSQLResult:"])
        | StrOutputParser()
    )

    try:
        # Invoke with enhanced context
        result = sql_chain.invoke({
            "question": question,
            "schema": schema,
            "allowed_tables": allowed_tables  # Explicitly show allowed tables
        })
        
        # print(f"LLM Output:\n{result}")

        # Validate SQL before returning
        sql_query = extract_sql_query(result)
        if not any(table.lower() in sql_query.lower() for table in allowed_tables):
            raise ValueError(f"Generated SQL doesn't use allowed tables: {sql_query}")

        # print(f"Valid SQL Query:\n{sql_query}")
        return {**state, "sql_query": sql_query}

    except Exception as e:
        print(f"SQL Generation Error: {e}")
        return {
            **state, 
            "sql_query": None, 
            "response": f"Error generating SQL: {str(e)}"
        }