from abc import ABC, abstractmethod
from typing import Dict, Tuple, Optional

class ResourceProfilerPort(ABC):
    """
    Hexagonal Port for sandbox subprocess resource profiling.
    Monitors peak Resident Set Size (RSS) memory consumption and CPU statistics
    to prevent candidate repair patches from introducing memory leaks or unbounded state accumulation.
    """

    @abstractmethod
    def profile_process(self, pid: int) -> Dict[str, float]:
        """
        Returns peak RSS memory in megabytes (MB) and CPU statistics for the given PID.
        """
        pass

    @abstractmethod
    def evaluate_memory_delta(
        self,
        pre_rss_mb: float,
        post_rss_mb: float,
        max_growth_mb: float = 64.0
    ) -> Tuple[bool, Optional[str]]:
        """
        Evaluates memory growth between pre-patch and post-patch test runs.
        Returns (is_acceptable, rejection_reason).
        """
        pass
