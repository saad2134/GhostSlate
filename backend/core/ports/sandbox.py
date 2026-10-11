from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any, Optional

class ExecutionSandboxPort(ABC):
    """Hexagonal Port for isolated execution sandboxes."""

    @abstractmethod
    def run_tests(
        self,
        target_code: str,
        test_code: str,
        filename: str = "target.py"
    ) -> Tuple[bool, str, int]:
        """
        Executes code and tests in an isolated, sanitized environment.
        Returns: (passed: bool, stdout: str, exit_code: int)
        """
        pass
