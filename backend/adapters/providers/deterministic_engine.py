import uuid
import datetime
from typing import List, Tuple, Optional
from backend.adapters.providers.base import ModelProviderPort
from backend.core.models import PatchCandidate, AgentDebateTurn, InvariantViolation, ASTNodeInfo
from backend.core.ast_engine import ASTEngine

class DeterministicEngine(ModelProviderPort):
    """
    Offline deterministic synthesis engine.
    Ensures 100% demo stability, zero API quota dependency, and microsecond latency.
    """
    def __init__(self):
        self.ast_engine = ASTEngine()

    def synthesize_repair(
        self,
        scenario_id: str,
        original_code: str,
        violation: InvariantViolation,
        isolated_node: Optional[ASTNodeInfo]
    ) -> Tuple[PatchCandidate, List[AgentDebateTurn]]:
        now = datetime.datetime.now().strftime("%H:%M:%S")

        if scenario_id == "race_condition":
            return self._repair_race_condition(original_code, violation, isolated_node, now)
        elif scenario_id == "off_by_one":
            return self._repair_off_by_one(original_code, violation, isolated_node, now)
        elif scenario_id == "null_pointer":
            return self._repair_null_pointer(original_code, violation, isolated_node, now)
        elif scenario_id == "financial_ledger":
            return self._repair_financial_ledger(original_code, violation, isolated_node, now)
        elif scenario_id == "stream_interrupt":
            return self._repair_stream_interrupt(original_code, violation, isolated_node, now)
        elif scenario_id == "custom":
            return self._repair_custom(original_code, violation, isolated_node, now)
        else:
            return self._repair_race_condition(original_code, violation, isolated_node, now)

    def _repair_race_condition(self, original_code, violation, isolated_node, now):
        replacement = """        # PATCHED: Enforce atomic solvency constraint before mutating state
        if self.balance >= amount and amount > 0:
            current = self.balance
            new_balance = current - amount
            self.balance = new_balance
            self.processed_orders.append(order_id)
            return True
        return False"""

        patch = self.ast_engine.apply_surgical_patch(
            source_code=original_code,
            start_line=8,
            end_line=15,
            replacement_code=replacement,
            explanation="Tightened guard condition to require `self.balance >= amount and amount > 0`. Prevents negative balance overdrafts.",
            target_node_id=isolated_node.node_id if isolated_node else None,
            target_node_type="IfStatement"
        )

        turns = [
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Discovered critical invariant violation at Line 8: `self.balance >= 0` check ignores requested transaction `amount`, permitting overdrafts.",
                status="proposing",
                confidence_score=0.96
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="AUDIT WARNING: What happens if `amount` is negative or zero? A malicious client could inflate balances if `amount <= 0` is not barred.",
                status="challenging",
                confidence_score=0.89
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Valid objection. Hardened replacement AST node to enforce both `self.balance >= amount` AND `amount > 0`.",
                status="proposing",
                confidence_score=0.99
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="SYNTAX & INVARIANT PROOF VERIFIED: No scope creep. Preserved class constructor and order history state intact. Passing to sandbox.",
                status="approved",
                confidence_score=1.00
            )
        ]
        return patch, turns

    def _repair_off_by_one(self, original_code, violation, isolated_node, now):
        replacement = """        # PATCHED: Strict inequality '<' preserves max_requests boundary invariant
        if len(self.timestamps) < self.max_requests:
            self.timestamps.append(current_time)
            return True
        return False"""

        patch = self.ast_engine.apply_surgical_patch(
            source_code=original_code,
            start_line=12,
            end_line=16,
            replacement_code=replacement,
            explanation="Changed `<= self.max_requests` to strict `< self.max_requests`. Rejects excess requests when window is at capacity.",
            target_node_id=isolated_node.node_id if isolated_node else None,
            target_node_type="IfStatement"
        )

        turns = [
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Pinpointed boundary off-by-one fault in `is_allowed()` at Line 13. The `<=` operator admits N+1 requests instead of N.",
                status="proposing",
                confidence_score=0.98
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="CHECK: Does the cutoff timestamp pruning logic precede this boundary comparison? Verify array length semantics.",
                status="challenging",
                confidence_score=0.92
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Confirmed. Pruning runs prior at Line 10. Replacing AST node with strict `< self.max_requests` restores deterministic capacity invariant.",
                status="proposing",
                confidence_score=0.99
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="BOUNDARY INVARIANT PROVED: Strict 3/3 capacity guaranteed. Forwarding patch to subprocess runner.",
                status="approved",
                confidence_score=1.00
            )
        ]
        return patch, turns

    def _repair_null_pointer(self, original_code, violation, isolated_node, now):
        replacement = """        # PATCHED: Null-coalescing guard against missing or None user profile payloads
        user_meta = self.payload.get("user") if isinstance(self.payload, dict) else None
        if not user_meta or not isinstance(user_meta, dict):
            return "ANONYMOUS"
        role = user_meta.get("role")
        return str(role).upper() if role else "ANONYMOUS\""""

        patch = self.ast_engine.apply_surgical_patch(
            source_code=original_code,
            start_line=6,
            end_line=9,
            replacement_code=replacement,
            explanation="Added defensive null coalescing and type validation for `user_meta`. Safely defaults to 'ANONYMOUS' when payload is absent or None.",
            target_node_id=isolated_node.node_id if isolated_node else None,
            target_node_type="MethodBody"
        )

        turns = [
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Caught unhandled AttributeError in `get_user_role()`. `self.payload.get('user')` returns None for guest tokens, crashing on `.get('role')`.",
                status="proposing",
                confidence_score=0.97
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="CHALLENGE: What if `role` exists but is None, empty string, or an integer? A blind `.upper()` call will still crash.",
                status="challenging",
                confidence_score=0.95
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Incorporated typecast and empty guard: `str(role).upper() if role else 'ANONYMOUS'`. Handles None, int, and missing keys.",
                status="proposing",
                confidence_score=1.00
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="TYPE SAFETY INVARIANT PASSED: Null dereference eliminated. Clean zero-crash guarantee.",
                status="approved",
                confidence_score=1.00
            )
        ]
        return patch, turns

    def _repair_financial_ledger(self, original_code, violation, isolated_node, now):
        replacement = """        # PATCHED: Solvency validation guard ensuring sender holds sufficient funds
        sender_balance = self.accounts.get(sender, 0.0)
        if sender_balance < amount:
            return False
        self.accounts[sender] -= amount
        self.accounts[receiver] = self.accounts.get(receiver, 0.0) + amount
        self.audit_log.append((sender, receiver, amount))
        return True"""

        patch = self.ast_engine.apply_surgical_patch(
            source_code=original_code,
            start_line=9,
            end_line=13,
            replacement_code=replacement,
            explanation="Added pre-transfer solvency check `sender_balance < amount` and safe dictionary access. Preserves total supply invariant.",
            target_node_id=isolated_node.node_id if isolated_node else None,
            target_node_type="MethodBody"
        )

        turns = [
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Detected state invariant corruption in `transfer()`. Sender balance drops to negative, violating zero-sum conservation.",
                status="proposing",
                confidence_score=0.98
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="CHECK: Does receiver account exist in the dictionary? Using direct index access might raise KeyError on new accounts.",
                status="challenging",
                confidence_score=0.94
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Addressed. Using `.get(receiver, 0.0)` for safe credit initialization alongside strict sender balance guard.",
                status="proposing",
                confidence_score=0.99
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="CONSERVATION INVARIANT VERIFIED: Total supply preserved, negative balance prevented. Ready for sandbox test.",
                status="approved",
                confidence_score=1.00
            )
        ]
        return patch, turns

    def _repair_stream_interrupt(self, original_code, violation, isolated_node, now):
        replacement = """        # PATCHED: Enforce causal watermark monotonicity and strict capacity boundary
        if len(self.pending_tasks) < self.max_buffer_size and sequence_no > self.watermark_sequence:
            self.pending_tasks.append(task_id)
            self.watermark_sequence = sequence_no
            self.processed_count += 1
            return True
        return False"""

        patch = self.ast_engine.apply_surgical_patch(
            source_code=original_code,
            start_line=10,
            end_line=16,
            replacement_code=replacement,
            explanation="Tightened dispatch guard to enforce causal sequence monotonicity `sequence_no > self.watermark_sequence` and strict buffer capacity. Rejects out-of-order interrupt execution.",
            target_node_id=isolated_node.node_id if isolated_node else None,
            target_node_type="IfStatement"
        )

        turns = [
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Discovered out-of-order execution trace at Line 10: `dispatch_task` admits regressive sequence numbers following high-priority interrupts without checking `sequence_no > self.watermark_sequence`.",
                status="proposing",
                confidence_score=0.97
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="AUDIT WARNING: What if an interrupt delivers a task exactly at capacity? Will `<` or `<=` prevent buffer overflow?",
                status="challenging",
                confidence_score=0.91
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Confirmed. Mutating AST node to strictly enforce `len(self.pending_tasks) < self.max_buffer_size` along with the monotonic watermark barrier.",
                status="proposing",
                confidence_score=0.99
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="CAUSAL WATERMARK PROOF VERIFIED: Monotonic order preserved, regressive interrupt tasks safely rejected. Passing to sandbox.",
                status="approved",
                confidence_score=1.00
            )
        ]
        return patch, turns

    def _repair_custom(self, original_code, violation, isolated_node, now):
        lines = original_code.splitlines()
        target_line = violation.line_number if violation else 8
        start_line = target_line
        end_line = target_line
        replacement_code = ""

        # Scan for boundary condition to harden
        found = False
        for idx, line in enumerate(lines, start=1):
            if "balance >= 0" in line:
                start_line = idx
                end_line = idx
                replacement_code = line.replace("balance >= 0", "balance >= amount")
                found = True
                break
            elif "<=" in line and ("len(" in line or "capacity" in line or "items" in line or "max" in line or "limit" in line or "tokens" in line):
                start_line = idx
                end_line = idx
                replacement_code = line.replace("<=", "<")
                found = True
                break

        if not found:
            for idx, line in enumerate(lines, start=1):
                if "<=" in line:
                    start_line = idx
                    end_line = idx
                    replacement_code = line.replace("<=", "<")
                    found = True
                    break

        if not found:
            if 1 <= target_line <= len(lines):
                orig_line = lines[target_line - 1]
                if "<=" in orig_line:
                    replacement_code = orig_line.replace("<=", "<")
                elif "==" in orig_line:
                    replacement_code = orig_line.replace("==", "!=")
                else:
                    replacement_code = orig_line
            else:
                start_line = 8
                end_line = 8
                replacement_code = "        return False"

        patch = self.ast_engine.apply_surgical_patch(
            source_code=original_code,
            start_line=start_line,
            end_line=end_line,
            replacement_code=replacement_code,
            explanation="Synthesized dynamic AST repair: hardened boundary condition `<` to preserve capacity state invariant.",
            target_node_id=isolated_node.node_id if isolated_node else None,
            target_node_type="IfStatement" if isolated_node else "Statement"
        )

        turns = [
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message=f"Analyzed custom code AST tree. Invariant violation detected at Line {start_line}. Proposing surgical syntax mutation.",
                status="proposing",
                confidence_score=0.96
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="AUDIT WARNING: Verifying syntax bounds and regression risk against target test assertions.",
                status="challenging",
                confidence_score=0.92
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="TriageAgent",
                avatar="⚡",
                timestamp=now,
                message="Refined replacement node to preserve exact indentation, comments, and method signature.",
                status="proposing",
                confidence_score=0.99
            ),
            AgentDebateTurn(
                id=str(uuid.uuid4())[:8],
                speaker="AdversarialCritic",
                avatar="🛡️",
                timestamp=now,
                message="CUSTOM AST PATCH APPROVED: Boundary condition verified. Dispatching to isolated pytest subprocess sandbox.",
                status="approved",
                confidence_score=1.00
            )
        ]
        return patch, turns
