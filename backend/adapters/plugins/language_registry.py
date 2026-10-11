"""Dynamic Language Registry Adapter
Provides extensible polyglot grammar management and AST scoping.
Implements LanguagePluginPort supporting Python, C, TypeScript, Rust, and Go.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
import ast
from typing import List, Dict, Optional, Any

from backend.core.ports.plugin import (
    LanguagePluginPort,
    LanguageMetadata,
    LanguageScopingResult
)

class DynamicLanguageRegistryAdapter(LanguagePluginPort):
    """
    Adapter implementing LanguagePluginPort.
    Maintains a decoupled registry of syntax engines and grammars.
    """

    def __init__(self):
        self._registry: Dict[str, LanguageMetadata] = {}
        self._initialize_defaults()

    def _initialize_defaults(self):
        defaults = [
            LanguageMetadata(
                language_id="python",
                name="Python 3.10+",
                file_extensions=[".py"],
                tree_sitter_available=True,
                default_test_framework="pytest",
                notes="Native ast + Tree-sitter dual engine"
            ),
            LanguageMetadata(
                language_id="c",
                name="ANSI C / C99",
                file_extensions=[".c", ".h"],
                tree_sitter_available=True,
                default_test_framework="criterion",
                notes="Tree-sitter C grammar parser"
            ),
            LanguageMetadata(
                language_id="typescript",
                name="TypeScript / JavaScript",
                file_extensions=[".ts", ".tsx", ".js", ".jsx"],
                tree_sitter_available=True,
                default_test_framework="vitest",
                notes="Tree-sitter TypeScript grammar"
            ),
            LanguageMetadata(
                language_id="rust",
                name="Rust 2021",
                file_extensions=[".rs"],
                tree_sitter_available=False,
                default_test_framework="cargo test",
                notes="Tree-sitter Rust bindings staged"
            ),
            LanguageMetadata(
                language_id="go",
                name="Go 1.22+",
                file_extensions=[".go"],
                tree_sitter_available=False,
                default_test_framework="go test",
                notes="Tree-sitter Go grammar staged"
            )
        ]
        for meta in defaults:
            self.register_language(meta)

    def register_language(self, metadata: LanguageMetadata) -> None:
        self._registry[metadata.language_id.lower()] = metadata

    def get_supported_languages(self) -> List[str]:
        return sorted(list(self._registry.keys()))

    def get_metadata(self, language_id: str) -> Optional[LanguageMetadata]:
        return self._registry.get(language_id.lower())

    def scope_ast_node(
        self,
        source_code: str,
        language_id: str,
        target_line: int
    ) -> LanguageScopingResult:
        lang_key = language_id.lower()
        lines = source_code.splitlines()
        source_slice = lines[target_line - 1].strip() if 0 <= target_line - 1 < len(lines) else ""

        if lang_key == "python":
            try:
                tree = ast.parse(source_code)
                enclosing_scope = "module"
                target_node_type = "Statement"
                start_line = target_line
                end_line = target_line

                for node in ast.walk(tree):
                    if hasattr(node, "lineno") and hasattr(node, "end_lineno"):
                        if node.lineno <= target_line <= node.end_lineno:
                            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                                enclosing_scope = f"def {node.name}"
                            elif isinstance(node, ast.ClassDef):
                                enclosing_scope = f"class {node.name}"
                            elif isinstance(node, (ast.If, ast.While, ast.For)):
                                target_node_type = type(node).__name__
                                start_line = node.lineno
                                end_line = node.end_lineno
                            elif isinstance(node, (ast.Compare, ast.Call, ast.Assign)):
                                target_node_type = type(node).__name__

                return LanguageScopingResult(
                    language_id="python",
                    node_found=True,
                    enclosing_scope=enclosing_scope,
                    target_node_type=target_node_type,
                    start_line=start_line,
                    end_line=end_line,
                    source_slice=source_slice,
                    metadata={"parser": "python_ast"}
                )
            except SyntaxError:
                pass

        # Fallback scoping for other registered languages or syntax errors
        return LanguageScopingResult(
            language_id=lang_key,
            node_found=bool(source_slice),
            enclosing_scope="global",
            target_node_type="LineStatement",
            start_line=target_line,
            end_line=target_line,
            source_slice=source_slice,
            metadata={"parser": "line_fallback"}
        )
