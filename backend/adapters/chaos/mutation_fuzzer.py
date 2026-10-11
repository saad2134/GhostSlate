"""AST Mutation Fuzzer Adapter
Synthesizes adversarial syntactic defects to evaluate test coverage and repair robustness.
Implements ChaosFuzzerPort using Python AST transformations.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
import ast
import copy
import time
import uuid
from typing import List, Dict, Any, Optional

from backend.core.ports.fuzzer import (
    ChaosFuzzerPort,
    FuzzingCandidate,
    FuzzingCampaignResult
)

class ASTMutationFuzzerAdapter(ChaosFuzzerPort):
    """
    Adapter implementing ChaosFuzzerPort.
    Applies surgical syntactic mutations:
    1. Comparison Inversion (< -> >=, == -> !=, etc.)
    2. Arithmetic Operator Swap (+ -> -, * -> //)
    3. Off-by-one Boundary Shifts (n -> n + 1)
    4. Defensive Guard Stripping (if cond -> if False)
    """

    COMPARE_INVERSIONS = {
        ast.Lt: ast.GtE,
        ast.LtE: ast.Gt,
        ast.Gt: ast.LtE,
        ast.GtE: ast.Lt,
        ast.Eq: ast.NotEq,
        ast.NotEq: ast.Eq,
        ast.Is: ast.IsNot,
        ast.IsNot: ast.Is,
        ast.In: ast.NotIn,
        ast.NotIn: ast.In
    }

    BINOP_SWAPS = {
        ast.Add: ast.Sub,
        ast.Sub: ast.Add,
        ast.Mult: ast.FloorDiv,
        ast.FloorDiv: ast.Mult
    }

    def generate_mutants(self, source_code: str, max_mutants: int = 10) -> List[FuzzingCandidate]:
        try:
            base_tree = ast.parse(source_code)
        except SyntaxError:
            return []

        candidates: List[FuzzingCandidate] = []
        source_lines = source_code.splitlines()

        # Phase 1: Invert Comparisons
        for node in ast.walk(base_tree):
            if len(candidates) >= max_mutants:
                break
            if isinstance(node, ast.Compare) and hasattr(node, "ops") and node.ops:
                orig_op_type = type(node.ops[0])
                if orig_op_type in self.COMPARE_INVERSIONS:
                    new_op_type = self.COMPARE_INVERSIONS[orig_op_type]
                    mutated_tree = copy.deepcopy(base_tree)
                    target_line = getattr(node, "lineno", 1)

                    # Locate corresponding node in copy
                    for m_node in ast.walk(mutated_tree):
                        if (isinstance(m_node, ast.Compare) and 
                            getattr(m_node, "lineno", -1) == target_line and 
                            m_node.ops and type(m_node.ops[0]) == orig_op_type):
                            m_node.ops[0] = new_op_type()
                            try:
                                mutated_code = ast.unparse(mutated_tree)
                                orig_line_str = source_lines[target_line - 1] if 0 <= target_line - 1 < len(source_lines) else ""
                                candidates.append(FuzzingCandidate(
                                    candidate_id=f"mutant_cmp_{len(candidates) + 1}",
                                    mutation_type="INVERT_COMPARISON",
                                    target_line=target_line,
                                    original_snippet=orig_line_str.strip(),
                                    mutated_snippet=f"{orig_op_type.__name__} ➔ {new_op_type.__name__}",
                                    mutated_code=mutated_code
                                ))
                            except Exception:
                                pass
                            break

        # Phase 2: Binary Arithmetic Operator Swap
        for node in ast.walk(base_tree):
            if len(candidates) >= max_mutants:
                break
            if isinstance(node, ast.BinOp) and type(node.op) in self.BINOP_SWAPS:
                orig_op_type = type(node.op)
                new_op_type = self.BINOP_SWAPS[orig_op_type]
                mutated_tree = copy.deepcopy(base_tree)
                target_line = getattr(node, "lineno", 1)

                for m_node in ast.walk(mutated_tree):
                    if (isinstance(m_node, ast.BinOp) and 
                        getattr(m_node, "lineno", -1) == target_line and 
                        type(m_node.op) == orig_op_type):
                        m_node.op = new_op_type()
                        try:
                            mutated_code = ast.unparse(mutated_tree)
                            orig_line_str = source_lines[target_line - 1] if 0 <= target_line - 1 < len(source_lines) else ""
                            candidates.append(FuzzingCandidate(
                                candidate_id=f"mutant_arith_{len(candidates) + 1}",
                                mutation_type="SWAP_ARITHMETIC_OPERATOR",
                                target_line=target_line,
                                original_snippet=orig_line_str.strip(),
                                mutated_snippet=f"{orig_op_type.__name__} ➔ {new_op_type.__name__}",
                                mutated_code=mutated_code
                            ))
                        except Exception:
                            pass
                        break

        # Phase 3: Constant Off-By-One Shifts
        for node in ast.walk(base_tree):
            if len(candidates) >= max_mutants:
                break
            if isinstance(node, ast.Constant) and isinstance(node.value, int) and not isinstance(node.value, bool):
                orig_val = node.value
                target_line = getattr(node, "lineno", 1)
                mutated_tree = copy.deepcopy(base_tree)

                for m_node in ast.walk(mutated_tree):
                    if (isinstance(m_node, ast.Constant) and 
                        getattr(m_node, "lineno", -1) == target_line and 
                        m_node.value == orig_val):
                        m_node.value = orig_val + 1
                        try:
                            mutated_code = ast.unparse(mutated_tree)
                            orig_line_str = source_lines[target_line - 1] if 0 <= target_line - 1 < len(source_lines) else ""
                            candidates.append(FuzzingCandidate(
                                candidate_id=f"mutant_shift_{len(candidates) + 1}",
                                mutation_type="BOUNDARY_OFF_BY_ONE",
                                target_line=target_line,
                                original_snippet=orig_line_str.strip(),
                                mutated_snippet=f"Constant {orig_val} ➔ {orig_val + 1}",
                                mutated_code=mutated_code
                            ))
                        except Exception:
                            pass
                        break

        # Phase 4: Defensive Guard Inversion
        for node in ast.walk(base_tree):
            if len(candidates) >= max_mutants:
                break
            if isinstance(node, ast.If):
                target_line = getattr(node, "lineno", 1)
                mutated_tree = copy.deepcopy(base_tree)

                for m_node in ast.walk(mutated_tree):
                    if isinstance(m_node, ast.If) and getattr(m_node, "lineno", -1) == target_line:
                        m_node.test = ast.Constant(value=False)
                        try:
                            mutated_code = ast.unparse(mutated_tree)
                            orig_line_str = source_lines[target_line - 1] if 0 <= target_line - 1 < len(source_lines) else ""
                            candidates.append(FuzzingCandidate(
                                candidate_id=f"mutant_guard_{len(candidates) + 1}",
                                mutation_type="STRIP_DEFENSIVE_GUARD",
                                target_line=target_line,
                                original_snippet=orig_line_str.strip(),
                                mutated_snippet="Guard test replaced with False",
                                mutated_code=mutated_code
                            ))
                        except Exception:
                            pass
                        break

        return candidates[:max_mutants]

    def evaluate_campaign(
        self,
        source_code: str,
        test_code: str,
        sandbox_runner: Any,
        max_mutants: int = 5
    ) -> FuzzingCampaignResult:
        t0 = time.time()
        campaign_id = f"fuzz_{uuid.uuid4().hex[:8]}"
        candidates = self.generate_mutants(source_code, max_mutants=max_mutants)

        caught_count = 0
        survived_count = 0

        for cand in candidates:
            try:
                if hasattr(sandbox_runner, "run_tests"):
                    success, output, code = sandbox_runner.run_tests(cand.mutated_code, test_code)
                elif hasattr(sandbox_runner, "execute_test"):
                    success, output, code = sandbox_runner.execute_test(cand.mutated_code, test_code)
                else:
                    raise AttributeError("Sandbox runner does not implement run_tests or execute_test")
                # If test FAILED (success == False), the mutation was caught by the test suite!
                if not success:
                    cand.caught = True
                    cand.diagnostics = f"Mutant caught: test failed with exit code {code}"
                    caught_count += 1
                else:
                    cand.caught = False
                    cand.diagnostics = "Mutant survived: test suite unexpectedly passed without detecting defect"
                    survived_count += 1
            except Exception as e:
                cand.caught = True
                cand.diagnostics = f"Mutant caught via exception: {str(e)}"
                caught_count += 1

        total = len(candidates)
        score = (caught_count / total) if total > 0 else 1.0
        duration_ms = (time.time() - t0) * 1000.0

        return FuzzingCampaignResult(
            campaign_id=campaign_id,
            total_mutants=total,
            caught_mutants=caught_count,
            survived_mutants=survived_count,
            mutation_score=round(score, 3),
            candidates=candidates,
            duration_ms=round(duration_ms, 2)
        )
