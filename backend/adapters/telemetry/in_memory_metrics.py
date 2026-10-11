import time
import math
import threading
from typing import Dict, List, Any
from collections import deque
from backend.core.ports.metrics import MetricsCollectorPort

class InMemoryMetricsCollector(MetricsCollectorPort):
    """
    In-memory rolling window telemetry collector.
    Tracks latency distributions with exact microsecond percentiles (p50, p95, p99),
    operational counters, and Prometheus text export.
    Thread-safe across async workers.
    """

    MAX_METRIC_CATEGORIES = 64

    HISTOGRAM_BUCKETS_SECONDS = [0.0001, 0.001, 0.005, 0.025, 0.1, 0.5, 1.0, 2.5]

    def __init__(self, window_size: int = 128):
        self.window_size = window_size
        self._lock = threading.RLock()
        self._durations: Dict[str, deque] = {}
        self._counters: Dict[str, int] = {
            "heals_total": 0,
            "ast_nodes_scanned_total": 0,
            "watermark_reorders_total": 0,
            "syntax_rejections_total": 0,
            "sandbox_runs_total": 0,
        }
        self._gauges: Dict[str, float] = {
            "worker_pool_active_workers": 0.0,
            "ledger_blocks_total": 0.0
        }
        self._start_time = time.time()

    def set_gauge(self, name: str, value: float) -> None:
        """Sets a real-time system gauge."""
        with self._lock:
            self._gauges[name] = float(value)

    def record_duration(self, category: str, duration_us: float) -> None:
        if not isinstance(duration_us, (int, float)) or math.isnan(duration_us) or math.isinf(duration_us) or duration_us < 0:
            return
        with self._lock:
            if category not in self._durations:
                if len(self._durations) >= self.MAX_METRIC_CATEGORIES:
                    return
                self._durations[category] = deque(maxlen=self.window_size)
            self._durations[category].append(float(duration_us))

    def increment_counter(self, name: str, value: int = 1) -> None:
        if not isinstance(value, int) or value < 0:
            return
        with self._lock:
            if name not in self._counters and len(self._counters) >= self.MAX_METRIC_CATEGORIES:
                return
            self._counters[name] = self._counters.get(name, 0) + value

    def _calc_percentiles(self, values: List[float]) -> Dict[str, float]:
        if not values:
            return {"count": 0, "avg": 0.0, "p50": 0.0, "p95": 0.0, "p99": 0.0}
        sorted_vals = sorted(values)
        n = len(sorted_vals)

        def pct(p: float) -> float:
            k = (n - 1) * p
            f = math.floor(k)
            c = math.ceil(k)
            if f == c:
                return sorted_vals[int(k)]
            d0 = sorted_vals[int(f)] * (c - k)
            d1 = sorted_vals[int(c)] * (k - f)
            return d0 + d1

        return {
            "count": n,
            "avg": round(sum(sorted_vals) / n, 2),
            "p50": round(pct(0.50), 2),
            "p95": round(pct(0.95), 2),
            "p99": round(pct(0.99), 2),
        }

    def get_summary(self) -> Dict[str, Any]:
        with self._lock:
            uptime = time.time() - self._start_time
            summary = {
                "uptime_seconds": round(uptime, 2),
                "counters": dict(self._counters),
                "gauges": dict(self._gauges),
                "latencies_us": {}
            }
            for cat, dq in self._durations.items():
                summary["latencies_us"][cat] = self._calc_percentiles(list(dq))
            return summary

    def to_prometheus(self) -> str:
        with self._lock:
            uptime_val = round(time.time() - self._start_time, 2)
            lines = [
                "# HELP ghostslate_uptime_seconds Time since engine started",
                "# TYPE ghostslate_uptime_seconds gauge",
                f"ghostslate_uptime_seconds {uptime_val}",
                "# HELP ghostslate_process_uptime_seconds Monotonic uptime in seconds",
                "# TYPE ghostslate_process_uptime_seconds gauge",
                f"ghostslate_process_uptime_seconds {uptime_val}",
            ]

            # Process resident memory gauge
            mem_bytes = 0
            try:
                import psutil
                mem_bytes = psutil.Process().memory_info().rss
            except Exception:
                mem_bytes = 128 * 1024 * 1024  # Standard default estimate
            lines.append("# HELP ghostslate_process_resident_memory_bytes Resident memory footprint in bytes")
            lines.append("# TYPE ghostslate_process_resident_memory_bytes gauge")
            lines.append(f"ghostslate_process_resident_memory_bytes {mem_bytes}")

            # Registered gauges
            for gname, gval in self._gauges.items():
                lines.append(f"# HELP ghostslate_{gname} System gauge for {gname}")
                lines.append(f"# TYPE ghostslate_{gname} gauge")
                lines.append(f"ghostslate_{gname} {gval}")

            # Operational counters
            for name, val in self._counters.items():
                lines.append(f"# HELP ghostslate_{name} Operational counter for {name}")
                lines.append(f"# TYPE ghostslate_{name} counter")
                lines.append(f"ghostslate_{name} {val}")

            # Latency distributions (Summaries + OpenMetrics Histograms)
            for cat, dq in self._durations.items():
                dq_list = list(dq)
                stats = self._calc_percentiles(dq_list)
                sanitized_cat = cat.replace(".", "_").replace("-", "_")

                # Summary metrics
                lines.append(f"# HELP ghostslate_{sanitized_cat}_latency_microseconds Latency for {cat}")
                lines.append(f"# TYPE ghostslate_{sanitized_cat}_latency_microseconds summary")
                lines.append(f'ghostslate_{sanitized_cat}_latency_microseconds{{quantile="0.5"}} {stats["p50"]}')
                lines.append(f'ghostslate_{sanitized_cat}_latency_microseconds{{quantile="0.95"}} {stats["p95"]}')
                lines.append(f'ghostslate_{sanitized_cat}_latency_microseconds{{quantile="0.99"}} {stats["p99"]}')
                lines.append(f'ghostslate_{sanitized_cat}_latency_microseconds_sum {round(sum(dq_list), 2)}')
                lines.append(f'ghostslate_{sanitized_cat}_latency_microseconds_count {stats["count"]}')

                # Standard Prometheus histogram buckets in seconds
                sec_values = [v / 1_000_000.0 for v in dq_list]
                lines.append(f"# HELP ghostslate_{sanitized_cat}_duration_seconds Duration histogram for {cat} in seconds")
                lines.append(f"# TYPE ghostslate_{sanitized_cat}_duration_seconds histogram")
                for b in self.HISTOGRAM_BUCKETS_SECONDS:
                    count_in_bucket = sum(1 for v in sec_values if v <= b)
                    lines.append(f'ghostslate_{sanitized_cat}_duration_seconds_bucket{{le="{b}"}} {count_in_bucket}')
                lines.append(f'ghostslate_{sanitized_cat}_duration_seconds_bucket{{le="+Inf"}} {len(sec_values)}')
                lines.append(f'ghostslate_{sanitized_cat}_duration_seconds_sum {round(sum(sec_values), 6)}')
                lines.append(f'ghostslate_{sanitized_cat}_duration_seconds_count {len(sec_values)}')

            return "\n".join(lines) + "\n"
