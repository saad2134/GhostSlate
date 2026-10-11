import pytest
from backend.adapters.telemetry.in_memory_metrics import InMemoryMetricsCollector

def test_telemetry_collector_percentiles_calculation():
    collector = InMemoryMetricsCollector(window_size=50)

    # Record 10 samples for ast_parsing
    for val in [10.0, 20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0, 90.0, 100.0]:
        collector.record_duration("ast_parsing", val)

    collector.increment_counter("heals_total", 5)

    summary = collector.get_summary()
    assert summary["counters"]["heals_total"] == 5
    assert "ast_parsing" in summary["latencies_us"]
    
    ast_stats = summary["latencies_us"]["ast_parsing"]
    assert ast_stats["count"] == 10
    assert ast_stats["avg"] == 55.0
    assert ast_stats["p50"] == 55.0

def test_telemetry_prometheus_format():
    collector = InMemoryMetricsCollector()
    collector.record_duration("stream_synchronization", 8.5)
    collector.increment_counter("heals_total", 3)

    prom_text = collector.to_prometheus()
    assert "ghostslate_heals_total 3" in prom_text
    assert "ghostslate_stream_synchronization_latency_microseconds" in prom_text
    assert "ghostslate_uptime_seconds" in prom_text
