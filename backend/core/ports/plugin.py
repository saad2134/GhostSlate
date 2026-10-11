"""Language Plugin Port
Abstract port contract for polyglot language grammar registration and AST scoping.
Enables extensible language support across Python, C, TypeScript, Rust, and Go.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Tuple

@dataclass
class LanguageMetadata:
    language_id: str
    name: str
    file_extensions: List[str]
    tree_sitter_available: bool = False
    default_test_framework: str = "pytest"
    notes: Optional[str] = None

@dataclass
class LanguageScopingResult:
    language_id: str
    node_found: bool
    enclosing_scope: str
    target_node_type: str
    start_line: int
    end_line: int
    source_slice: str
    metadata: Dict[str, Any] = field(default_factory=dict)

class LanguagePluginPort(ABC):
    """
    Port contract for extensible multi-language AST grammar registration.
    """

    @abstractmethod
    def register_language(self, metadata: LanguageMetadata) -> None:
        """Registers a language plugin with metadata."""
        pass

    @abstractmethod
    def get_supported_languages(self) -> List[str]:
        """Returns list of registered language identifiers."""
        pass

    @abstractmethod
    def get_metadata(self, language_id: str) -> Optional[LanguageMetadata]:
        """Returns metadata for a specific language ID."""
        pass

    @abstractmethod
    def scope_ast_node(
        self,
        source_code: str,
        language_id: str,
        target_line: int
    ) -> LanguageScopingResult:
        """Locates enclosing AST scope and target node for target line in given language."""
        pass
