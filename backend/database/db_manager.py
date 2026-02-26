import sqlite3
import json
import threading
from typing import List, Dict, Any
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "simulation.db")

class DBManager:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self.lock = threading.Lock()
        self._ensure_tables()

    def _ensure_tables(self):
        with self.lock:
            c = self.conn.cursor()
            c.execute("""
            CREATE TABLE IF NOT EXISTS records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                mode TEXT,
                raw_row TEXT,
                model_output TEXT,
                risk_level INTEGER,
                alert_message TEXT
            )
            """)
            self.conn.commit()

    def insert_record(self, timestamp: str, mode: str, raw_row: dict, model_output: dict, risk_level: int, alert_message: str):
        with self.lock:
            c = self.conn.cursor()
            c.execute("""
            INSERT INTO records (timestamp, mode, raw_row, model_output, risk_level, alert_message)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (timestamp, mode, json.dumps(raw_row), json.dumps(model_output), risk_level, alert_message))
            self.conn.commit()

    def fetch_history(self, limit: int = 1000) -> List[Dict[str, Any]]:
        with self.lock:
            c = self.conn.cursor()
            c.execute("SELECT id, timestamp, mode, raw_row, model_output, risk_level, alert_message FROM records ORDER BY id ASC LIMIT ?", (limit,))
            rows = c.fetchall()
            res = []
            for r in rows:
                res.append({
                    "id": r[0],
                    "timestamp": r[1],
                    "mode": r[2],
                    "raw_row": json.loads(r[3]) if r[3] else {},
                    "model_output": json.loads(r[4]) if r[4] else {},
                    "risk_level": r[5],
                    "alert_message": r[6]
                })
            return res

    def reset(self):
        with self.lock:
            c = self.conn.cursor()
            c.execute("DELETE FROM records")
            self.conn.commit()
 