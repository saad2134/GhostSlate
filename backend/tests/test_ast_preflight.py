import pytest
from backend.core.ast_engine import ASTEngine

def test_ast_engine_preflight_valid_code():
    engine = ASTEngine()
    code = "def valid_func(x):\n    return x * 2\n"
    is_valid, err = engine.validate_syntax(code, "python")
    assert is_valid is True
    assert err is None

def test_ast_engine_preflight_catches_unclosed_parenthesis():
    engine = ASTEngine()
    broken_code = "def broken(x:\n    return x\n"
    is_valid, err = engine.validate_syntax(broken_code, "python")
    assert is_valid is False
    assert err is not None
    assert "Syntax Error" in err

def test_ast_engine_surgical_patch_rejects_syntax_errors():
    engine = ASTEngine()
    original_code = "class Safe:\n    def check(self):\n        return True\n"
    
    # Attempt to apply a replacement with invalid syntax (unclosed parenthesis)
    with pytest.raises(ValueError) as excinfo:
        engine.apply_surgical_patch(
            source_code=original_code,
            start_line=3,
            end_line=3,
            replacement_code="        return (True",
            explanation="Invalid syntax injection"
        )
    assert "AST PRE-FLIGHT REJECTION" in str(excinfo.value)

def test_coordinator_handles_syntax_rejection_gracefully():
    from backend.core.agent_loop import AgentLoopCoordinator
    coordinator = AgentLoopCoordinator()
    
    # Run healing session with intentionally broken Python syntax
    broken_code = "def totally_broken(:\n    return False"
    broken_test = "def test_it(): assert True"
    
    session = coordinator.run_healing_session(
        scenario_id="custom",
        custom_code=broken_code,
        custom_test=broken_test
    )
    assert session.stage == "failed"
    assert session.verification.is_verified is False
    assert session.verification.exit_code == -99
    assert session.verification.canary_passed is False
    assert "Pre-flight AST gate rejected candidate syntax" in session.verification.deterministic_proof
