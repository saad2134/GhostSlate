"""Hexagonal Port: Rate Limiter Boundary Port (RateLimiterPort)
Standardized contract for request throttling, token bucket accounting, and DDoS edge protection.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any

class RateLimiterPort(ABC):
    """Abstract Port representing a concurrency/request throttling boundary."""

    @abstractmethod
    def is_allowed(self, client_identifier: str, cost: int = 1) -> Tuple[bool, Dict[str, Any]]:
        """Evaluates whether a request for client_identifier is within rate quotas.
        
        Returns:
            Tuple of (allowed: bool, metadata: dict)
            where metadata contains limit, remaining, reset_after_seconds.
        """
        pass

    @abstractmethod
    def reset(self, client_identifier: str) -> None:
        """Resets rate quotas for the given client identifier."""
        pass
