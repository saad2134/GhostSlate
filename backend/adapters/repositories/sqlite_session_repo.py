import time
import sqlite3
import threading
from typing import List, Optional
from backend.core.ports.repository import SessionRepositoryPort
from backend.core.models import SelfHealingSession

class SQLiteSessionRepository(SessionRepositoryPort):
    """
    Durable, queryable SQLite session repository adapter.
    Implements SessionRepositoryPort with WAL mode concurrency and lossless Pydantic serialization.
    Enables zero-cloud persistent audits across process reboots.
    """

    def __init__(self, db_path: str = "ghostslate_sessions.db"):
        self.db_path = db_path
        self._lock = threading.RLock()
        self._conn = sqlite3.connect(self.db_path, timeout=15.0, check_same_thread=False)
        self._init_db()

    def _init_db(self) -> None:
        with self._lock:
            cursor = self._conn.cursor()
            cursor.execute("PRAGMA journal_mode=WAL;")
            cursor.execute("PRAGMA synchronous=NORMAL;")
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS healing_sessions (
                    session_id TEXT PRIMARY KEY,
                    scenario_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    language TEXT NOT NULL,
                    stage TEXT NOT NULL,
                    is_verified INTEGER NOT NULL,
                    duration_ms REAL NOT NULL DEFAULT 0.0,
                    created_at REAL NOT NULL,
                    session_json TEXT NOT NULL
                );
            """)
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_sessions_scenario_created 
                ON healing_sessions (scenario_id, created_at DESC);
            """)
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_sessions_created 
                ON healing_sessions (created_at DESC);
            """)
            self._conn.commit()

    def save(self, session: SelfHealingSession) -> None:
        with self._lock:
            is_ver = 1 if (session.verification and session.verification.is_verified) else 0
            dur = session.verification.duration_ms if session.verification else 0.0
            json_data = session.model_dump_json()
            cursor = self._conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO healing_sessions 
                (session_id, scenario_id, title, language, stage, is_verified, duration_ms, created_at, session_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                session.session_id,
                session.scenario_id,
                session.title,
                session.language,
                session.stage,
                is_ver,
                dur,
                time.time(),
                json_data
            ))
            self._conn.commit()

    def get_by_id(self, session_id: str) -> Optional[SelfHealingSession]:
        with self._lock:
            cursor = self._conn.cursor()
            cursor.execute("SELECT session_json FROM healing_sessions WHERE session_id = ?", (session_id,))
            row = cursor.fetchone()
            if row:
                return SelfHealingSession.model_validate_json(row[0])
            return None

    def get_latest_by_scenario(self, scenario_id: str) -> Optional[SelfHealingSession]:
        with self._lock:
            cursor = self._conn.cursor()
            cursor.execute("""
                SELECT session_json FROM healing_sessions 
                WHERE scenario_id = ? 
                ORDER BY created_at DESC LIMIT 1
            """, (scenario_id,))
            row = cursor.fetchone()
            if row:
                return SelfHealingSession.model_validate_json(row[0])
            return None

    def list_recent(self, limit: int = 20) -> List[SelfHealingSession]:
        with self._lock:
            cursor = self._conn.cursor()
            cursor.execute("""
                SELECT session_json FROM healing_sessions 
                ORDER BY created_at DESC LIMIT ?
            """, (limit,))
            rows = cursor.fetchall()
            return [SelfHealingSession.model_validate_json(r[0]) for r in rows]

    def close(self) -> None:
        with self._lock:
            if self._conn:
                self._conn.close()
