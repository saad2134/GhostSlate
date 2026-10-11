"""Unit Tests for Dynamic Language Registry Plugin
Validates polyglot language registration and AST scoping isolation.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
import pytest
from backend.adapters.plugins.language_registry import DynamicLanguageRegistryAdapter
from backend.core.ports.plugin import LanguageMetadata, LanguageScopingResult

SAMPLE_PY = """class OrderBook:
    def process_order(self, order_id, amount):
        if amount <= 0:
            return False
        return True
"""

SAMPLE_C = """int process_buffer(char *buf, int len) {
    if (len < 0) {
        return -1;
    }
    return 0;
}
"""

def test_language_registry_defaults():
    registry = DynamicLanguageRegistryAdapter()
    langs = registry.get_supported_languages()

    assert "python" in langs
    assert "c" in langs
    assert "typescript" in langs
    assert "rust" in langs
    assert "go" in langs

    py_meta = registry.get_metadata("python")
    assert py_meta is not None
    assert py_meta.name == "Python 3.10+"
    assert ".py" in py_meta.file_extensions

def test_language_registry_custom_registration():
    registry = DynamicLanguageRegistryAdapter()
    custom_meta = LanguageMetadata(
        language_id="zig",
        name="Zig 0.13",
        file_extensions=[".zig"],
        tree_sitter_available=True,
        default_test_framework="zig test"
    )
    registry.register_language(custom_meta)

    assert "zig" in registry.get_supported_languages()
    retrieved = registry.get_metadata("zig")
    assert retrieved is not None
    assert retrieved.name == "Zig 0.13"

def test_language_scoping_python_ast():
    registry = DynamicLanguageRegistryAdapter()
    result = registry.scope_ast_node(SAMPLE_PY, "python", target_line=3)

    assert isinstance(result, LanguageScopingResult)
    assert result.node_found is True
    assert result.language_id == "python"
    assert "def process_order" in result.enclosing_scope
    assert result.target_node_type in ["If", "Compare"]
    assert result.start_line <= 3 <= result.end_line

def test_language_scoping_fallback():
    registry = DynamicLanguageRegistryAdapter()
    result = registry.scope_ast_node(SAMPLE_C, "c", target_line=2)

    assert result.node_found is True
    assert result.language_id == "c"
    assert result.source_slice == "if (len < 0) {"
