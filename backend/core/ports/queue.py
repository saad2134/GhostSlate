from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

class TaskQueuePort(ABC):
    """
    Hexagonal Port for asynchronous healing task queues and concurrency management.
    Prevents thread thrashing and kernel subprocess saturation during burst traffic.
    """

    @abstractmethod
    async def submit_job(
        self,
        scenario_id: str,
        custom_code: Optional[str] = None,
        custom_test: Optional[str] = None
    ) -> str:
        """Enqueues a healing job and returns a unique job identifier."""
        pass

    @abstractmethod
    def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Returns the execution stage, progress, and completed session if finished."""
        pass

# Backward-compatible alias
WorkerPoolPort = TaskQueuePort
