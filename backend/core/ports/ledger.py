"""Hexagonal Port: Cryptographic Audit Ledger Port (AuditLedgerPort)
Defines the contract for tamper-evident, append-only compliance logging for automated code repairs.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
from abc import ABC, abstractmethod
from typing import Tuple, List, Dict, Any

class AuditLedgerPort(ABC):
    """Abstract port for tamper-evident cryptographic audit logs."""

    @abstractmethod
    def record_audit_entry(
        self,
        session_id: str,
        scenario_id: str,
        invariant_name: str,
        diff_unified: str,
        deterministic_proof: str
    ) -> str:
        """Records an immutable audit entry and returns its cryptographic SHA-256 block hash."""
        pass

    @abstractmethod
    def verify_chain_integrity(self) -> Tuple[bool, int]:
        """Verifies the unbroken cryptographic SHA-256 chain across all historical ledger blocks.
        
        Returns:
            Tuple of (is_valid: bool, verified_block_count: int).
        """
        pass

    @abstractmethod
    def get_entries(self) -> List[Dict[str, Any]]:
        """Returns all recorded audit ledger blocks."""
        pass
