from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class MetricsCollectorPort(ABC):
    """Hexagonal Port for recording runtime telemetry, percentiles, and operational counters."""

    @abstractmethod
    def record_duration(self, category: str, duration_us: float) -> None:
        """Records a latency observation in microseconds."""
        pass

    @abstractmethod
    def increment_counter(self, name: str, value: int = 1) -> None:
        """Increments an operational counter."""
        pass

    @abstractmethod
    def get_summary(self) -> Dict[str, Any]:
        """Calculates rolling statistics (p50, p95, p99, counts, throughput)."""
        pass

    @abstractmethod
    def to_prometheus(self) -> str:
        """Renders metrics in standard Prometheus exposition format."""
        pass
