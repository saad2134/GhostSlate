from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class TraceHookPort(ABC):
    """
    Hexagonal Port for distributed tracing and pipeline span instrumentation.
    Enforces W3C-compatible telemetry across async and subprocess hops.
    """

    @abstractmethod
    def start_span(self, name: str, attributes: Optional[Dict[str, Any]] = None) -> Any:
        """Starts a named trace span with optional metadata attributes."""
        pass

    @abstractmethod
    def end_span(self, span: Any, status: str = "OK", error: Optional[str] = None) -> None:
        """Completes a trace span with completion status and microsecond duration."""
        pass
