import pytest
from backend.adapters.telemetry.in_memory_metrics import InMemoryMetricsCollector

def test_prometheus_histograms_generation():
    collector = InMemoryMetricsCollector()
    
    # Record durations in microseconds: 50µs, 2000µs (2ms), 150000µs (150ms)
    collector.record_duration("ast_isolation", 50.0)
    collector.record_duration("ast_isolation", 2000.0)
    collector.record_duration("ast_isolation", 150000.0)
    
    prom_text = collector.to_prometheus()
    
    # Verify TYPE and HELP histogram declarations
    assert "# TYPE ghostslate_ast_isolation_duration_seconds histogram" in prom_text
    assert "# HELP ghostslate_ast_isolation_duration_seconds" in prom_text
    
    # Verify bucket format and +Inf bucket
    assert 'ghostslate_ast_isolation_duration_seconds_bucket{le="0.0001"}' in prom_text
    assert 'ghostslate_ast_isolation_duration_seconds_bucket{le="+Inf"} 3' in prom_text
    assert "ghostslate_ast_isolation_duration_seconds_count 3" in prom_text
    assert "ghostslate_ast_isolation_duration_seconds_sum" in prom_text

def test_prometheus_system_gauges():
    collector = InMemoryMetricsCollector()
    collector.set_gauge("worker_pool_active_workers", 2.0)
    collector.set_gauge("ledger_blocks_total", 42.0)
    
    prom_text = collector.to_prometheus()
    
    assert "ghostslate_worker_pool_active_workers 2.0" in prom_text
    assert "ghostslate_ledger_blocks_total 42.0" in prom_text
    assert "ghostslate_process_resident_memory_bytes" in prom_text
    assert "ghostslate_process_uptime_seconds" in prom_text
