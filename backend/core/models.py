from typing import Dict, List, Optional, Any, Tuple
from pydantic import BaseModel, Field

class RuntimeStateSnapshot(BaseModel):
    step: int
    line_number: int
    function_name: str = "main"
    variables: Dict[str, Any]
    call_stack: List[str] = Field(default_factory=list)
    status: str = "normal"  # "normal" | "invariant_violation" | "exception" | "healed"
    message: Optional[str] = None
    timestamp_ms: float = 0.0

class ASTNodeInfo(BaseModel):
    node_id: str
    node_type: str
    name: Optional[str] = None
    start_point: Tuple[int, int]  # (line, column) 1-indexed line
    end_point: Tuple[int, int]
    source_snippet: str
    enclosing_scope: Optional[str] = None
    children_count: int = 0
    is_faulty_target: bool = False

class InvariantViolation(BaseModel):
    rule_name: str
    description: str
    culprit_variable: str
    expected_condition: str
    actual_value: str
    line_number: int
    function_name: str

class PatchCandidate(BaseModel):
    patch_id: str
    target_node_id: Optional[str] = None
    target_node_type: str
    start_line: int
    end_line: int
    original_code: str
    replacement_code: str
    full_patched_code: str
    explanation: str
    diff_unified: str

class VerificationResult(BaseModel):
    patch_id: str
    is_verified: bool
    pre_patch_test_output: str
    post_patch_test_output: str
    exit_code: int
    duration_ms: float
    tests_passed: int
    tests_failed: int
    deterministic_proof: str

class AgentDebateTurn(BaseModel):
    id: str
    speaker: str  # "TriageAgent" | "AdversarialCritic" | "System"
    avatar: str
    timestamp: str
    message: str
    status: str  # "proposing" | "challenging" | "verifying" | "approved" | "rejected"
    confidence_score: float

class ChaosScenario(BaseModel):
    id: str
    title: str
    category: str
    language: str
    description: str
    bug_type: str
    source_code: str
    test_code: str
    expected_invariant: str

class SelfHealingSession(BaseModel):
    session_id: str
    scenario_id: str
    title: str
    language: str
    original_code: str
    test_suite: str
    invariant_violation: Optional[InvariantViolation] = None
    snapshots: List[RuntimeStateSnapshot] = Field(default_factory=list)
    ast_nodes: List[ASTNodeInfo] = Field(default_factory=list)
    isolated_node: Optional[ASTNodeInfo] = None
    debate_turns: List[AgentDebateTurn] = Field(default_factory=list)
    patch: Optional[PatchCandidate] = None
    verification: Optional[VerificationResult] = None
    stage: str = "idle"  # "idle" | "recording_trace" | "ast_isolation" | "agent_debate" | "sandbox_verifying" | "healed" | "failed"
