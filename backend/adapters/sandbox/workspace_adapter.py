"""Ephemeral Workspace Adapter
Implements WorkspaceIsolationPort using ephemeral directory trees and secure cleanup.
Protects developer working trees and active git branches from verification mutations.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
import os
import shutil
import tempfile
import threading
from typing import Set
from backend.core.ports.workspace import WorkspaceIsolationPort

class EphemeralDirectoryWorkspaceAdapter(WorkspaceIsolationPort):
    """
    Adapter implementing WorkspaceIsolationPort.
    Creates isolated ephemeral working trees for AST verification,
    tracking active workspaces and cleaning them up safely on lifecycle completion.
    """

    def __init__(self):
        self._active_workspaces: Set[str] = set()
        self._lock = threading.RLock()

    def create_ephemeral_workspace(self, prefix: str = "ghostslate_ws_") -> str:
        """Creates an ephemeral isolated directory and registers it."""
        tmp_dir = tempfile.mkdtemp(prefix=prefix)
        with self._lock:
            self._active_workspaces.add(tmp_dir)
        return tmp_dir

    def cleanup_workspace(self, workspace_path: str) -> bool:
        """Safely removes the ephemeral workspace and unregisters it."""
        with self._lock:
            if workspace_path in self._active_workspaces:
                self._active_workspaces.remove(workspace_path)

        if os.path.exists(workspace_path):
            try:
                shutil.rmtree(workspace_path, ignore_errors=True)
                return True
            except Exception:
                return False
        return True

    def stage_file(self, workspace_path: str, filename: str, content: str) -> str:
        """Writes candidate file content into the ephemeral workspace."""
        file_path = os.path.join(workspace_path, filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        return file_path

    def cleanup_all(self) -> int:
        """Emergency cleanup of all active ephemeral workspaces."""
        with self._lock:
            to_clean = list(self._active_workspaces)
            self._active_workspaces.clear()

        cleaned_count = 0
        for ws in to_clean:
            if os.path.exists(ws):
                try:
                    shutil.rmtree(ws, ignore_errors=True)
                    cleaned_count += 1
                except Exception:
                    pass
        return cleaned_count
