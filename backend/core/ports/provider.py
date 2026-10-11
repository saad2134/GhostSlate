from abc import ABC, abstractmethod
from typing import List, Tuple, Optional
from backend.core.models import PatchCandidate, AgentDebateTurn, InvariantViolation, ASTNodeInfo

class ModelProviderPort(ABC):
    """Hexagonal Port for patch synthesis and multi-agent debate providers."""

    @abstractmethod
    def synthesize_repair(
        self,
        scenario_id: str,
        original_code: str,
        violation: InvariantViolation,
        isolated_node: Optional[ASTNodeInfo]
    ) -> Tuple[PatchCandidate, List[AgentDebateTurn]]:
        """Synthesizes surgical AST diff patch and multi-agent debate conversation."""
        pass
