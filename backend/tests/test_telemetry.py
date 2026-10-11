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
    assert "ghostslate_stream_synchronization_latency_microseconds_sum 8.5" in prom_text
    assert "ghostslate_uptime_seconds" in prom_text

def test_telemetry_rejects_nan_and_negative_durations():
    collector = InMemoryMetricsCollector()
    collector.record_duration("ast_parsing", float("nan"))
    collector.record_duration("ast_parsing", float("inf"))
    collector.record_duration("ast_parsing", -50.0)
    collector.record_duration("ast_parsing", 25.0)

    summary = collector.get_summary()
    ast_stats = summary["latencies_us"]["ast_parsing"]
    assert ast_stats["count"] == 1
    assert ast_stats["avg"] == 25.0

def test_telemetry_bounds_maximum_categories():
    collector = InMemoryMetricsCollector()
    # Attempt to flood with 100 unique categories
    for i in range(100):
        collector.record_duration(f"category_{i}", 10.0)
        collector.increment_counter(f"counter_{i}", 1)

    summary = collector.get_summary()
    assert len(summary["latencies_us"]) <= InMemoryMetricsCollector.MAX_METRIC_CATEGORIES
    assert len(summary["counters"]) <= InMemoryMetricsCollector.MAX_METRIC_CATEGORIES
