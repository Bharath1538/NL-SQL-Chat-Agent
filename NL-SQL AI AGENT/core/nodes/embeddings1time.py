import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..','..')))
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_qdrant import QdrantVectorStore
from utils.db import get_db_connection
from config.settings import QDRANT_API_KEY, QDRANT_URL

retriever = None
db_supply = get_db_connection("supplydb1")
from qdrant_client import QdrantClient

def get_retriever():
    global retriever
    if retriever is not None:
        return retriever

    ollama_emb = OllamaEmbeddings(model="mistral:7b-instruct")
    url = QDRANT_URL  
    api_key = QDRANT_API_KEY

    try:
        qdrant = QdrantVectorStore.from_existing_collection(
            embedding=ollama_emb,
            url=url,
            prefer_grpc=True,
            api_key=api_key,
            collection_name="my_documents",
        )
        # print("✅ Loaded existing Qdrant collection.")
    except Exception as e:
        # print(f"⚠️ Collection not found or error loading: {e}. Generating and uploading embeddings...")

        table_names = db_supply.get_usable_table_names()
        table_schemas = {table: db_supply.get_table_info([table]) for table in table_names}

        documents = [
            Document(page_content=schema, metadata={"table": table})
            for table, schema in table_schemas.items()
        ]

        qdrant = QdrantVectorStore.from_documents(
            documents,
            embedding=ollama_emb,
            url=url,
            prefer_grpc=True,
            api_key=api_key,
            collection_name="my_documents",
        )
        # print("✅ Embeddings created and uploaded.")

    retriever = qdrant.as_retriever()
    return retriever
#With FAISS
# import sys
# import os
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..','..')))

# # Use FAISS from langchain_community

# # Use OllamaEmbeddings from langchain_community
# from langchain_community.embeddings import OllamaEmbeddings

# from langchain_core.documents import Document

# # Import your DB utility
# from utils.db import get_db_connection

# # Global retriever cache
# retriever=None
# db_supply = get_db_connection("supplydb1")
# ollama_emb = OllamaEmbeddings(model="mistral:7b-instruct")

# def get_retriever():
#     global retriever, ollama_emb
#     if retriever is not None:
#         return retriever

#     faiss_index_path = "faiss_inventory_schema.index"
#     index_name = "inventory_schema"

#     try:
#         vectorstore = FAISS.load_local(
#             folder_path=faiss_index_path,
#             embeddings=ollama_emb,
#             index_name=index_name
#         )
#         print("✅ Loaded existing FAISS collection.")
#     except Exception as e:
#         print(f"⚠️ FAISS index not found or error loading: {e}. Generating new embeddings...")
#         table_names = db_supply.get_usable_table_names()
#         table_schemas = {table: db_supply.get_table_info([table]) for table in table_names}
#         documents = [Document(page_content=schema, metadata={"table": table}) for table, schema in table_schemas.items()]
#         vectorstore = FAISS.from_documents(documents, ollama_emb)
#         vectorstore.save_local(folder_path=faiss_index_path, index_name=index_name)
#         print("✅ FAISS index created and saved.")

#     retriever = vectorstore.as_retriever()
#     return retriever