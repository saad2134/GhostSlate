import ast
import difflib
import uuid
from typing import List, Optional, Tuple, Dict
from backend.core.models import ASTNodeInfo, PatchCandidate
from backend.core.ports.parser import ASTParserPort
from backend.adapters.parsers.python_ast_parser import PythonASTParser
from backend.adapters.parsers.tree_sitter_parser import TreeSitterASTParser

class ASTEngine:
    """
    Surgical AST Engine: isolates exact syntax node coordinates and applies line-bounded diffs.
    Supports pluggable parser ports and pre-flight syntax compilation validation.
    """

    def __init__(self, parsers: Optional[Dict[str, ASTParserPort]] = None):
        self.py_parser = parsers.get("python") if parsers else PythonASTParser()
        self.ts_parser = parsers.get("tree-sitter") if parsers else TreeSitterASTParser()
        self.parsers = parsers or {
            "python": self.py_parser,
            "tree-sitter": self.ts_parser
        }

    def validate_syntax(self, code: str, language: str = "python") -> Tuple[bool, Optional[str]]:
        """
        Zero-cost pre-flight syntax compilation gate.
        Validates concrete syntax trees before dispatching code to the subprocess sandbox.
        """
        lang = language.lower()
        if lang == "python":
            try:
                ast.parse(code)
                return True, None
            except SyntaxError as e:
                return False, f"AST Syntax Error at line {e.lineno}: {e.msg}"
            except Exception as e:
                return False, f"AST Syntax Compilation Exception: {str(e)}"
        return True, None

    def get_nodes(self, source_code: str, language: str = "python") -> List[ASTNodeInfo]:
        lang = language.lower()
        if lang == "python":
            nodes = self.py_parser.parse_to_nodes(source_code, language)
            if not nodes:
                nodes = self.ts_parser.parse_to_nodes(source_code, language)
            return nodes
        else:
            return self.ts_parser.parse_to_nodes(source_code, language)

    def find_isolated_node(self, source_code: str, line_number: int, language: str = "python") -> Optional[ASTNodeInfo]:
        lang = language.lower()
        node = None
        if lang == "python":
            node = self.py_parser.find_node_at_line(source_code, line_number, language)
            if not node:
                node = self.ts_parser.find_node_at_line(source_code, line_number, language)
        else:
            node = self.ts_parser.find_node_at_line(source_code, line_number, language)

        if node:
            node.is_faulty_target = True
        return node

    def get_enclosing_block(self, source_code: str, line_number: int, language: str = "python") -> Tuple[int, int, str]:
        lang = language.lower()
        if lang == "python":
            return self.py_parser.get_enclosing_block(source_code, line_number, language)
        return self.ts_parser.get_enclosing_block(source_code, line_number, language)

    def apply_surgical_patch(
        self,
        source_code: str,
        start_line: int,
        end_line: int,
        replacement_code: str,
        explanation: str,
        target_node_id: Optional[str] = None,
        target_node_type: str = "Statement",
        language: str = "python"
    ) -> PatchCandidate:
        lines = source_code.splitlines()

        if 1 <= start_line <= len(lines):
            original_slice = "\n".join(lines[start_line - 1:min(len(lines), end_line)])
        else:
            original_slice = ""

        prefix = lines[:max(0, start_line - 1)]
        suffix = lines[end_line:]
        replacement_lines = replacement_code.splitlines()

        patched_lines = prefix + replacement_lines + suffix
        patched_code = "\n".join(patched_lines) + "\n"

        # Directive 1: AST Pre-Flight Syntax Gate
        is_valid_syntax, syntax_err = self.validate_syntax(patched_code, language)
        if not is_valid_syntax:
            raise ValueError(f"AST PRE-FLIGHT REJECTION: Candidate patch introduces invalid syntax: {syntax_err}")

        diff_lines = list(difflib.unified_diff(
            lines,
            patched_lines,
            fromfile="original.py",
            tofile="patched_ast.py",
            lineterm=""
        ))
        diff_unified = "\n".join(diff_lines)

        patch_id = f"patch_{uuid.uuid4().hex[:8]}"

        return PatchCandidate(
            patch_id=patch_id,
            target_node_id=target_node_id,
            target_node_type=target_node_type,
            start_line=start_line,
            end_line=end_line,
            original_code=original_slice,
            replacement_code=replacement_code,
            full_patched_code=patched_code,
            explanation=explanation,
            diff_unified=diff_unified
        )
