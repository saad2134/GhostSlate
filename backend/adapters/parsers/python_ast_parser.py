import ast
import uuid
from typing import List, Optional, Tuple
from backend.adapters.parsers.base import ASTParserPort
from backend.core.models import ASTNodeInfo

class PythonASTParser(ASTParserPort):
    def parse_to_nodes(self, source_code: str, language: str = "python") -> List[ASTNodeInfo]:
        try:
            tree = ast.parse(source_code)
        except SyntaxError:
            return []

        lines = source_code.splitlines()
        nodes: List[ASTNodeInfo] = []

        class NodeVisitor(ast.NodeVisitor):
            def __init__(self):
                self.scope_stack = ["module"]

            def generic_visit(self, node):
                node_type = type(node).__name__
                lineno = getattr(node, "lineno", 1)
                col_offset = getattr(node, "col_offset", 0)
                end_lineno = getattr(node, "end_lineno", lineno)
                end_col_offset = getattr(node, "end_col_offset", col_offset)

                snippet = ""
                if 1 <= lineno <= len(lines):
                    if lineno == end_lineno:
                        snippet = lines[lineno - 1][col_offset:end_col_offset]
                    else:
                        snippet = "\n".join(lines[lineno - 1:end_lineno])

                name = None
                if hasattr(node, "name"):
                    name = node.name

                nodes.append(ASTNodeInfo(
                    node_id=f"py_{lineno}_{col_offset}_{node_type}_{uuid.uuid4().hex[:6]}",
                    node_type=node_type,
                    name=name,
                    start_point=(lineno, col_offset),
                    end_point=(end_lineno, end_col_offset),
                    source_snippet=snippet[:120],
                    enclosing_scope=self.scope_stack[-1],
                    children_count=len(list(ast.iter_child_nodes(node))),
                    is_faulty_target=False
                ))

                push_scope = False
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                    self.scope_stack.append(f"{node_type}:{node.name}")
                    push_scope = True

                super().generic_visit(node)

                if push_scope:
                    self.scope_stack.pop()

        visitor = NodeVisitor()
        visitor.visit(tree)
        return nodes

    def find_node_at_line(self, source_code: str, line_number: int, language: str = "python") -> Optional[ASTNodeInfo]:
        nodes = self.parse_to_nodes(source_code, language)
        candidates = [
            n for n in nodes
            if n.start_point[0] <= line_number <= n.end_point[0]
            and n.node_type not in ("Module", "Expr")
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
