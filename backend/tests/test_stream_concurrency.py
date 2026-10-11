import pytest
from concurrent.futures import ThreadPoolExecutor
from backend.core.stream_sync import ResilientInMemoryStream
from backend.core.models import RuntimeStateSnapshot

def test_stream_concurrent_multi_thread_ingest():
    stream = ResilientInMemoryStream(max_capacity=500)
    
    def ingest_item(seq):
        snap = RuntimeStateSnapshot(
            step=seq,
            line_number=seq,
            function_name=f"worker_{seq}",
            variables={"seq": seq},
            call_stack=["test_worker"],
            status="normal",
            message=f"Event {seq}"
        )
        stream.ingest(snap, sequence_id=seq)

    # Concurrently ingest 50 events in random order across 5 threads
    seqs = list(range(1, 51))
    import random
    random.shuffle(seqs)

    with ThreadPoolExecutor(max_workers=5) as executor:
        list(executor.map(ingest_item, seqs))

    ordered, meta = stream.synchronize_and_drain()
    assert len(ordered) == 50
    assert meta.timeline_integrity_verified is True
    # Verify strict monotonic ordering
    for i in range(len(ordered) - 1):
        assert ordered[i].sequence_id < ordered[i + 1].sequence_id

def test_stream_bounded_capacity_ceiling():
    stream = ResilientInMemoryStream(max_capacity=5)

    for i in range(1, 10):
        snap = RuntimeStateSnapshot(
            step=i, line_number=i, function_name="test", variables={}, call_stack=[], status="normal", message=""
        )
        stream.ingest(snap, sequence_id=i)

    ordered, meta = stream.synchronize_and_drain()
    # Cannot exceed max_capacity of 5
    assert len(ordered) == 5

def test_stream_sequence_deduplication():
    stream = ResilientInMemoryStream()

    snap = RuntimeStateSnapshot(
        step=1, line_number=1, function_name="test", variables={}, call_stack=[], status="normal", message=""
    )
    # Ingest event 1
    stream.ingest(snap, sequence_id=1)
    # Duplicate ingest of event 1
    stream.ingest(snap, sequence_id=1)

    ordered, meta = stream.synchronize_and_drain()
    assert len(ordered) == 1
