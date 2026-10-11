import pytest
import os
import tempfile
from backend.adapters.ledger.jsonl_ledger import AppendOnlyJSONLLedger, GENESIS_HASH

def test_ledger_genesis_and_chaining():
    ledger = AppendOnlyJSONLLedger()
    h1 = ledger.record_audit_entry(
        session_id="sess_001",
        scenario_id="race_condition",
        invariant_name="ThreadSafetyInvariant",
        diff_unified="@@ -1 +1 @@",
        deterministic_proof="ExitCode: 0"
    )
    assert len(h1) == 64
    entries = ledger.get_entries()
    assert len(entries) == 1
    assert entries[0]["prev_hash"] == GENESIS_HASH
    assert entries[0]["block_hash"] == h1

    # Second block chains to h1
    h2 = ledger.record_audit_entry(
        session_id="sess_002",
        scenario_id="null_pointer",
        invariant_name="NullSafetyInvariant",
        diff_unified="@@ -5 +5 @@",
        deterministic_proof="ExitCode: 0"
    )
    assert len(h2) == 64
    entries = ledger.get_entries()
    assert len(entries) == 2
    assert entries[1]["prev_hash"] == h1
    assert entries[1]["block_hash"] == h2

    # Verify chain integrity
    is_valid, count = ledger.verify_chain_integrity()
    assert is_valid is True
    assert count == 2

def test_ledger_detects_tampering():
    ledger = AppendOnlyJSONLLedger()
    ledger.record_audit_entry("s1", "sc1", "Inv1", "diff1", "proof1")
    ledger.record_audit_entry("s2", "sc2", "Inv2", "diff2", "proof2")
    
    # Tamper with block 0 payload in-memory
    ledger._entries[0]["diff_unified"] = "TAMPERED_INJECTED_CODE"
    
    is_valid, corrupted_index = ledger.verify_chain_integrity()
    assert is_valid is False
    assert corrupted_index == 0

def test_ledger_file_persistence():
    with tempfile.NamedTemporaryFile(suffix=".jsonl", delete=False) as tf:
        temp_path = tf.name

    try:
        ledger = AppendOnlyJSONLLedger(ledger_file_path=temp_path)
        ledger.record_audit_entry("s1", "sc1", "Inv1", "diff1", "proof1")
        ledger.record_audit_entry("s2", "sc2", "Inv2", "diff2", "proof2")

        # Reload from disk
        reloaded = AppendOnlyJSONLLedger(ledger_file_path=temp_path)
        assert len(reloaded.get_entries()) == 2
        is_valid, count = reloaded.verify_chain_integrity()
        assert is_valid is True
        assert count == 2
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
