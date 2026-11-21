"""
Database initialization and configuration for TinyDB.
Manages tables: suppliers, users, profiles, audit.
"""

from pathlib import Path
from tinydb import TinyDB

# Determine database path
DB_DIR = Path(__file__).parent.parent.parent / "data"
DB_DIR.mkdir(exist_ok=True)
DB_PATH = DB_DIR / "healthcore.db"

# Initialize TinyDB instance
db = TinyDB(str(DB_PATH))


def get_db() -> TinyDB:
    """Get TinyDB instance."""
    return db


def init_tables() -> None:
    """Initialize all required tables in TinyDB."""
    tables = ["suppliers", "users", "profiles", "audit"]
    for table_name in tables:
        if table_name not in db.tables():
            db.table(table_name)


def close_db() -> None:
    """Close TinyDB connection."""
    db.close()


# Initialize tables on module load
init_tables()
