import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).parent / "wastewise.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def create_table():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            waste_class TEXT NOT NULL,
            confidence REAL NOT NULL,
            waste_type TEXT NOT NULL,
            recyclable TEXT NOT NULL,
            compostable TEXT NOT NULL,
            disposal TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()