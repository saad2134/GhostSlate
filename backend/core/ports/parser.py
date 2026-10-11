from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from backend.core.models import ASTNodeInfo

class ASTParserPort(ABC):
    """Hexagonal Port for AST syntax parsing, scoping, and coordinate isolation."""

    @abstractmethod
    def parse_to_nodes(self, source_code: str, language: str = "python") -> List[ASTNodeInfo]:
        """Parses source code into a flat or hierarchical list of AST nodes with coordinates."""
        pass

    @abstractmethod
    def find_node_at_line(self, source_code: str, line_number: int, language: str = "python") -> Optional[ASTNodeInfo]:
        """Locates the innermost statement or expression node active at line_number."""
        pass

    @abstractmethod
    def get_enclosing_block(self, source_code: str, line_number: int, language: str = "python") -> Tuple[int, int, str]:
        """Returns (start_line, end_line, source_slice) of the enclosing statement block."""
        pass
