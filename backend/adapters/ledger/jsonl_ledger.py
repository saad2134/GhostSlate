"""Audit Ledger Adapter: Append-Only Cryptographic Audit Ledger (AppendOnlyJSONLLedger)
Implements AuditLedgerPort with SHA-256 tamper-evident blockchain-style hash chaining.
Provides cryptographic compliance proof for enterprise SOC 2 and ISO 27001 audits.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
import time
import json
import os
import hashlib
import threading
from typing import Tuple, List, Dict, Any, Optional
from backend.core.ports.ledger import AuditLedgerPort

GENESIS_HASH = "0" * 64

class AppendOnlyJSONLLedger(AuditLedgerPort):
    """Cryptographic append-only audit ledger implementing AuditLedgerPort."""

    def __init__(self, ledger_file_path: Optional[str] = None):
        """
        Args:
            ledger_file_path: Optional path to JSONL persistence file. If None, runs in-memory.
        """
        self.ledger_file_path = ledger_file_path
        self._entries: List[Dict[str, Any]] = []
        self._lock = threading.Lock()

        if self.ledger_file_path and os.path.exists(self.ledger_file_path):
            self._load_from_disk()

    def _compute_hash(
        self,
        prev_hash: str,
        session_id: str,
        scenario_id: str,
        invariant_name: str,
        diff_unified: str,
        deterministic_proof: str
    ) -> str:
        payload = f"{prev_hash}|{session_id}|{scenario_id}|{invariant_name}|{diff_unified}|{deterministic_proof}"
        return hashlib.sha256(payload.encode('utf-8')).hexdigest()

    def _load_from_disk(self) -> None:
        try:
            with open(self.ledger_file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line:
                        self._entries.append(json.loads(line))
        except Exception:
            pass

    def record_audit_entry(
        self,
        session_id: str,
        scenario_id: str,
        invariant_name: str,
        diff_unified: str,
        deterministic_proof: str
    ) -> str:
        """Appends a new cryptographic block and returns its SHA-256 hash."""
        with self._lock:
            prev_hash = self._entries[-1]["block_hash"] if self._entries else GENESIS_HASH
            block_hash = self._compute_hash(
                prev_hash=prev_hash,
                session_id=session_id,
                scenario_id=scenario_id,
                invariant_name=invariant_name,
                diff_unified=diff_unified,
                deterministic_proof=deterministic_proof
            )

            entry = {
                "index": len(self._entries),
                "timestamp": time.time(),
                "session_id": session_id,
                "scenario_id": scenario_id,
                "invariant_name": invariant_name,
                "diff_unified": diff_unified,
                "deterministic_proof": deterministic_proof,
                "prev_hash": prev_hash,
                "block_hash": block_hash
            }

            self._entries.append(entry)

            if self.ledger_file_path:
                try:
                    os.makedirs(os.path.dirname(os.path.abspath(self.ledger_file_path)), exist_ok=True)
                    with open(self.ledger_file_path, 'a', encoding='utf-8') as f:
                        f.write(json.dumps(entry) + "\n")
                except Exception:
                    pass

            return block_hash

    def verify_chain_integrity(self) -> Tuple[bool, int]:
        """Validates all blocks in the chain. Returns (is_valid: bool, verified_count: int)."""
        with self._lock:
            if not self._entries:
                return True, 0

            for i, entry in enumerate(self._entries):
                expected_prev = GENESIS_HASH if i == 0 else self._entries[i - 1]["block_hash"]
                if entry["prev_hash"] != expected_prev:
                    return False, i

                computed = self._compute_hash(
                    prev_hash=entry["prev_hash"],
                    session_id=entry["session_id"],
                    scenario_id=entry["scenario_id"],
                    invariant_name=entry["invariant_name"],
                    diff_unified=entry["diff_unified"],
                    deterministic_proof=entry["deterministic_proof"]
                )
                if entry["block_hash"] != computed:
                    return False, i

            return True, len(self._entries)

    def get_entries(self) -> List[Dict[str, Any]]:
        """Returns a snapshot of all ledger entries."""
        with self._lock:
            return list(self._entries)
