from abc import ABC, abstractmethod
from typing import Optional, List
from backend.core.models import SelfHealingSession

class SessionRepositoryPort(ABC):
    """Hexagonal Port for persisting and retrieving self-healing sessions."""

    @abstractmethod
    def save(self, session: SelfHealingSession) -> None:
        """Stores a self-healing session."""
        pass

    @abstractmethod
    def get_by_id(self, session_id: str) -> Optional[SelfHealingSession]:
        """Retrieves a session by its unique ID."""
        pass

    @abstractmethod
    def get_latest_by_scenario(self, scenario_id: str) -> Optional[SelfHealingSession]:
        """Retrieves the most recent session for a scenario."""
        pass

    @abstractmethod
    def list_recent(self, limit: int = 20) -> List[SelfHealingSession]:
        """Lists recent healing sessions."""
        pass
