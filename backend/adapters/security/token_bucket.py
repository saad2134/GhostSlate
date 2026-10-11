"""Security Adapter: Token Bucket Rate Limiter (TokenBucketRateLimiterAdapter)
Implements RateLimiterPort using thread-safe sliding token bucket accounting.
Protects compute-intensive AST parsing and subprocess execution from exhaustion.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
import time
import threading
from typing import Tuple, Dict, Any
from backend.core.ports.rate_limiter import RateLimiterPort

class TokenBucketRateLimiterAdapter(RateLimiterPort):
    """Thread-safe in-memory Token Bucket rate limiter implementing RateLimiterPort."""

    def __init__(self, capacity: int = 15, refill_rate_per_sec: float = 0.5):
        """
        Args:
            capacity: Maximum burst capacity of tokens.
            refill_rate_per_sec: Rate at which tokens refill per second (e.g. 0.5 = 30 tokens/minute).
        """
        self.capacity = capacity
        self.refill_rate_per_sec = refill_rate_per_sec
        # Store format: {client_id: (current_tokens: float, last_updated_time: float)}
        self._buckets: Dict[str, Tuple[float, float]] = {}
        self._lock = threading.Lock()

    def is_allowed(self, client_identifier: str, cost: int = 1) -> Tuple[bool, Dict[str, Any]]:
        """Evaluates if the client request can consume `cost` tokens.
        
        Returns:
            Tuple of (allowed: bool, metadata: dict)
        """
        now = time.time()
        with self._lock:
            if client_identifier not in self._buckets:
                current_tokens = float(self.capacity)
                last_updated = now
            else:
                tokens, last_updated = self._buckets[client_identifier]
                # Refill tokens according to elapsed duration
                elapsed = max(0.0, now - last_updated)
                current_tokens = min(float(self.capacity), tokens + (elapsed * self.refill_rate_per_sec))

            if current_tokens >= cost:
                # Deduct cost
                new_tokens = current_tokens - cost
                self._buckets[client_identifier] = (new_tokens, now)
                return True, {
                    "limit": self.capacity,
                    "remaining": int(new_tokens),
                    "reset_after_seconds": 0
                }
            else:
                # Quota exceeded
                needed = cost - current_tokens
                wait_seconds = int(needed / self.refill_rate_per_sec) + 1 if self.refill_rate_per_sec > 0 else 60
                self._buckets[client_identifier] = (current_tokens, now)
                return False, {
                    "limit": self.capacity,
                    "remaining": 0,
                    "reset_after_seconds": wait_seconds
                }

    def reset(self, client_identifier: str) -> None:
        """Resets the token bucket for the specified client."""
        with self._lock:
            if client_identifier in self._buckets:
                del self._buckets[client_identifier]
