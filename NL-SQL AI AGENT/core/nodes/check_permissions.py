import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..','..')))
import re
from utils.db import get_db_connection
from sqlalchemy import text
from core.state import AgentState
from typing import Dict
def check_user_permissions(state: AgentState) -> AgentState:
    # print("Checking user permissions...")
    db_priv = get_db_connection("4iempdb")
    designation = state["designation"]
    tables_requested = state["tables_requested"]

    if not tables_requested:
        return {
            **state,
            "allowed_tables": [],
            "forbidden_tables": [],
            "permission_status": "full"
        }

    # Convert tables_requested to PostgreSQL array literal
    # e.g., {"inventory_levels", "products"}
    from sqlalchemy import text

# This converts Python list to a SQL-compatible list
    pg_array = tables_requested  # Just a list like ["inventory_levels"]

    permission_query = text("""
    SELECT 
        table_name,
        can_create,
        can_read,
        can_update,
        can_delete
    FROM role_privileges
    WHERE role_name = :role_name
    AND table_name = ANY(:table_list)
    """)

    try:
        # Pass `tables_requested` as a list, not a string
        with db_priv._engine.connect() as conn:
            result = conn.execute(
                permission_query,
                {"role_name": designation, "table_list": tables_requested}
            )
        
        # Build dynamic permission dictionary
        role_permissions = {}
        for row in result:
            table_name = row[0]
            can_create = row[1]
            can_read = row[2]
            can_update = row[3]
            can_delete = row[4]
            role_permissions[table_name] = {
                "read": can_read,
                "write": can_create or can_update or can_delete
            }

    except Exception as e:
        print(f"Error fetching permissions: {str(e)}")
        return {
            **state,
            "allowed_tables": [],
            "forbidden_tables": tables_requested,
            "permission_status": "denied"
        }

    allowed_tables = []
    forbidden_tables = []

    for table in tables_requested:
        if role_permissions.get(table, {}).get("read", False):
            allowed_tables.append(table)
        else:
            forbidden_tables.append(table)

    partial_access = len(allowed_tables) > 0 and len(forbidden_tables) > 0


    return {
        **state,
        "allowed_tables": allowed_tables,
        "forbidden_tables": forbidden_tables,
        "permission_status": "partial" if partial_access else ("full" if not forbidden_tables else "denied")
    }
