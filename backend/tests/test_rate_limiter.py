import pytest
from backend.adapters.security.token_bucket import TokenBucketRateLimiterAdapter

def test_token_bucket_initial_allowance():
    limiter = TokenBucketRateLimiterAdapter(capacity=5, refill_rate_per_sec=1.0)
    allowed, meta = limiter.is_allowed("192.168.1.1", cost=1)
    assert allowed is True
    assert meta["limit"] == 5
    assert meta["remaining"] == 4

def test_token_bucket_exhaustion_and_rejection():
    limiter = TokenBucketRateLimiterAdapter(capacity=3, refill_rate_per_sec=0.1)
    # Consume 3 tokens
    assert limiter.is_allowed("192.168.1.2", cost=1)[0] is True
    assert limiter.is_allowed("192.168.1.2", cost=1)[0] is True
    assert limiter.is_allowed("192.168.1.2", cost=1)[0] is True
    
    # 4th request must be rejected
    allowed, meta = limiter.is_allowed("192.168.1.2", cost=1)
    assert allowed is False
    assert meta["remaining"] == 0
    assert meta["reset_after_seconds"] > 0

def test_token_bucket_reset():
    limiter = TokenBucketRateLimiterAdapter(capacity=2, refill_rate_per_sec=0.1)
    limiter.is_allowed("user-1", cost=2)
    assert limiter.is_allowed("user-1", cost=1)[0] is False
    
    # Reset user-1
    limiter.reset("user-1")
    assert limiter.is_allowed("user-1", cost=1)[0] is True
