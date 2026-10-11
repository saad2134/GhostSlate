from typing import Dict, List, Optional
from collections import OrderedDict
from backend.core.ports.repository import SessionRepositoryPort
from backend.core.models import SelfHealingSession

class InMemorySessionRepository(SessionRepositoryPort):
    """
    In-memory LRU repository implementation for self-healing sessions.
    Stores up to `capacity` sessions to support instant PR/SARIF exports and audits
    without triggering redundant subprocess test re-runs.
    """

    def __init__(self, capacity: int = 50):
        self.capacity = capacity
        self._sessions: OrderedDict[str, SelfHealingSession] = OrderedDict()
        self._scenario_latest: Dict[str, str] = {}

    def save(self, session: SelfHealingSession) -> None:
        if session.session_id in self._sessions:
            del self._sessions[session.session_id]
        elif len(self._sessions) >= self.capacity:
            oldest_id, oldest_sess = self._sessions.popitem(last=False)
            if self._scenario_latest.get(oldest_sess.scenario_id) == oldest_id:
                del self._scenario_latest[oldest_sess.scenario_id]

        self._sessions[session.session_id] = session
        self._scenario_latest[session.scenario_id] = session.session_id

    def get_by_id(self, session_id: str) -> Optional[SelfHealingSession]:
        session = self._sessions.get(session_id)
        if session:
            # Move to end for LRU freshness
            self._sessions.move_to_end(session_id)
        return session

    def get_latest_by_scenario(self, scenario_id: str) -> Optional[SelfHealingSession]:
        session_id = self._scenario_latest.get(scenario_id)
        if session_id:
            return self.get_by_id(session_id)
        return None

    def list_recent(self, limit: int = 20) -> List[SelfHealingSession]:
        all_sessions = list(self._sessions.values())
        return list(reversed(all_sessions))[:limit]
