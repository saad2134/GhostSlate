import uuid
from typing import List, Optional, Tuple, Dict, Any
from backend.adapters.parsers.base import ASTParserPort
from backend.core.models import ASTNodeInfo

try:
    import tree_sitter
    import tree_sitter_python
    import tree_sitter_javascript

    PY_LANG = tree_sitter.Language(tree_sitter_python.language())
    JS_LANG = tree_sitter.Language(tree_sitter_javascript.language())
    HAS_TREE_SITTER = True
except Exception:
    HAS_TREE_SITTER = False

class TreeSitterASTParser(ASTParserPort):
    def __init__(self):
        self.parsers: Dict[str, Any] = {}
        if HAS_TREE_SITTER:
            self.parsers["python"] = tree_sitter.Parser(PY_LANG)
            self.parsers["javascript"] = tree_sitter.Parser(JS_LANG)
            self.parsers["typescript"] = tree_sitter.Parser(JS_LANG)

    def _get_parser(self, language: str):
        if not HAS_TREE_SITTER:
            return None
        lang = language.lower()
        return self.parsers.get(lang, self.parsers.get("python"))

    def parse_to_nodes(self, source_code: str, language: str = "python") -> List[ASTNodeInfo]:
        parser = self._get_parser(language)
        if not parser:
            return []

        tree = parser.parse(source_code.encode("utf-8"))
        nodes: List[ASTNodeInfo] = []
        code_lines = source_code.splitlines()

        meaningful_types = {
            "function_definition", "class_definition", "if_statement", "while_statement",
            "for_statement", "expression_statement", "return_statement", "assignment",
            "binary_operator", "call", "comparison_operator", "boolean_operator",
            "try_statement", "block", "module", "program", "method_definition"
        }

        cursor = tree.walk()
        visited_children = False

        while True:
            node = cursor.node
            node_type = node.type

            if node_type in meaningful_types:
                start_row = node.start_point.row + 1
                start_col = node.start_point.column
                end_row = node.end_point.row + 1
                end_col = node.end_point.column

                snippet = ""
                if 1 <= start_row <= len(code_lines) and end_row <= len(code_lines):
                    if start_row == end_row:
                        line = code_lines[start_row - 1]
                        snippet = line[start_col:end_col]
                    else:
                        snippet = "\n".join(code_lines[start_row - 1:end_row])

                nodes.append(ASTNodeInfo(
                    node_id=f"ts_{start_row}_{start_col}_{node_type}_{uuid.uuid4().hex[:6]}",
                    node_type=node_type,
                    name=None,
                    start_point=(start_row, start_col),
                    end_point=(end_row, end_col),
                    source_snippet=snippet[:120] + ("..." if len(snippet) > 120 else ""),
                    enclosing_scope="module",
                    children_count=node.child_count,
                    is_faulty_target=False
                ))

            if not visited_children and cursor.goto_first_child():
                visited_children = False
            elif cursor.goto_next_sibling():
                visited_children = False
            elif cursor.goto_parent():
                visited_children = True
            else:
                break

        return nodes

    def find_node_at_line(self, source_code: str, line_number: int, language: str = "python") -> Optional[ASTNodeInfo]:
        nodes = self.parse_to_nodes(source_code, language)
        candidates = [
            n for n in nodes
            if n.start_point[0] <= line_number <= n.end_point[0]
            and n.node_type not in ("module", "program", "block")
        ]
        if not candidates:
            return None
        candidates.sort(key=lambda x: (x.end_point[0] - x.start_point[0], -len(x.source_snippet)))
        return candidates[0]

    def get_enclosing_block(self, source_code: str, line_number: int, language: str = "python") -> Tuple[int, int, str]:
        lines = source_code.splitlines()
        node = self.find_node_at_line(source_code, line_number, language)
        if node:
            start_line = max(1, node.start_point[0])
            end_line = min(len(lines), node.end_point[0])
            slice_text = "\n".join(lines[start_line - 1:end_line])
            return (start_line, end_line, slice_text)

        if 1 <= line_number <= len(lines):
            return (line_number, line_number, lines[line_number - 1])
        return (1, len(lines), source_code)
