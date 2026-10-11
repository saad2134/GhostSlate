import os
import pytest
from backend.adapters.sandbox.workspace_adapter import EphemeralDirectoryWorkspaceAdapter

def test_workspace_lifecycle():
    adapter = EphemeralDirectoryWorkspaceAdapter()
    ws_path = adapter.create_ephemeral_workspace()
    
    assert os.path.exists(ws_path)
    assert os.path.isdir(ws_path)
    
    # Stage candidate file
    target_file = adapter.stage_file(ws_path, "candidate.py", "def fix(): return True\n")
    assert os.path.exists(target_file)
    with open(target_file, "r", encoding="utf-8") as f:
        assert f.read() == "def fix(): return True\n"
        
    # Safe cleanup
    cleaned = adapter.cleanup_workspace(ws_path)
    assert cleaned is True
    assert not os.path.exists(ws_path)

def test_workspace_emergency_cleanup_all():
    adapter = EphemeralDirectoryWorkspaceAdapter()
    ws1 = adapter.create_ephemeral_workspace()
    ws2 = adapter.create_ephemeral_workspace()
    
    assert os.path.exists(ws1)
    assert os.path.exists(ws2)
    
    cleaned_count = adapter.cleanup_all()
    assert cleaned_count >= 2
    assert not os.path.exists(ws1)
    assert not os.path.exists(ws2)
