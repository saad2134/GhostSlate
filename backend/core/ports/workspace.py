"""Hexagonal Port: Workspace Isolation Port (WorkspaceIsolationPort)
Orchestrates isolated ephemeral working trees for AST verification, preventing
contamination or mutation of user working trees and active git branches.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
from abc import ABC, abstractmethod
from typing import Optional, Dict

class WorkspaceIsolationPort(ABC):
    """Abstract port for isolated scratch workspaces during patch verification."""

    @abstractmethod
    def create_ephemeral_workspace(self, prefix: str = "ghostslate_ws_") -> str:
        """Creates an ephemeral isolated directory and returns its absolute path."""
        pass

    @abstractmethod
    def cleanup_workspace(self, workspace_path: str) -> bool:
        """Safely removes an ephemeral workspace directory."""
        pass

    @abstractmethod
    def stage_file(self, workspace_path: str, filename: str, content: str) -> str:
        """Writes candidate file content into the ephemeral workspace and returns the file path."""
        pass
