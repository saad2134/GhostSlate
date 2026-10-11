import time
import uuid
import threading
from typing import Dict, List, Any, Optional
from backend.core.ports.tracing import TraceHookPort

class InMemorySpan:
    def __init__(self, span_id: str, name: str, attributes: Optional[Dict[str, Any]] = None):
        self.span_id = span_id
        self.name = name
        self.attributes = dict(attributes or {})
        self.start_time_us = time.perf_counter() * 1_000_000.0
        self.end_time_us: Optional[float] = None
        self.duration_us: float = 0.0
        self.status: str = "RUNNING"
        self.error: Optional[str] = None

    def finish(self, status: str = "OK", error: Optional[str] = None) -> None:
        self.end_time_us = time.perf_counter() * 1_000_000.0
        self.duration_us = round(self.end_time_us - self.start_time_us, 2)
        self.status = status
        self.error = error

    def to_dict(self) -> Dict[str, Any]:
        return {
            "span_id": self.span_id,
            "name": self.name,
            "status": self.status,
            "duration_us": self.duration_us,
            "attributes": self.attributes,
            "error": self.error
        }

class InMemoryTracer(TraceHookPort):
    """
    Zero-dependency in-memory distributed tracer adapter.
    Implements TraceHookPort with thread safety and timeline serialization.
    """

    def __init__(self, trace_id: Optional[str] = None):
        self.trace_id = trace_id or f"trace_{uuid.uuid4().hex[:12]}"
        self._lock = threading.RLock()
        self._spans: List[InMemorySpan] = []

    def start_span(self, name: str, attributes: Optional[Dict[str, Any]] = None) -> InMemorySpan:
        span = InMemorySpan(
            span_id=f"span_{uuid.uuid4().hex[:8]}",
            name=name,
            attributes=attributes
        )
        with self._lock:
            self._spans.append(span)
        return span

    def end_span(self, span: InMemorySpan, status: str = "OK", error: Optional[str] = None) -> None:
        with self._lock:
            span.finish(status=status, error=error)

    def get_spans(self) -> List[Dict[str, Any]]:
        with self._lock:
            return [s.to_dict() for s in self._spans]

    def get_summary(self) -> Dict[str, Any]:
        with self._lock:
            total_duration_us = sum(s.duration_us for s in self._spans)
            return {
                "trace_id": self.trace_id,
                "span_count": len(self._spans),
                "total_duration_us": round(total_duration_us, 2),
                "spans": [s.to_dict() for s in self._spans]
            }
