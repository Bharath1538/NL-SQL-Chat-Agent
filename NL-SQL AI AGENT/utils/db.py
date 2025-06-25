import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from langchain_community.utilities import SQLDatabase
from config.settings import DB_CREDENTIALS1
def get_db_connection(db_name: str = "supplydb1") -> SQLDatabase:
    pgsql_uri1 = (
        f"postgresql+psycopg2://{DB_CREDENTIALS1['user']}:{DB_CREDENTIALS1['password']}"
        f"@{DB_CREDENTIALS1['host']}:{DB_CREDENTIALS1['port']}/{db_name}"
    )
    return SQLDatabase.from_uri(pgsql_uri1, engine_args={"connect_args": {"connect_timeout": 3600}})
