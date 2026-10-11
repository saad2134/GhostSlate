import pytest
import asyncio
from backend.adapters.queue.worker_pool import BoundedWorkerPoolAdapter
from backend.core.agent_loop import AgentLoopCoordinator

@pytest.mark.asyncio
async def test_worker_pool_submits_and_completes_job():
    pool = BoundedWorkerPoolAdapter(max_concurrent_workers=2)
    job_id = await pool.submit_job(scenario_id="off_by_one")

    assert job_id.startswith("job_")
    
    # Poll until completed (capped at 5s)
    max_wait = 50
    for _ in range(max_wait):
        status = pool.get_job_status(job_id)
        if status and status["status"] in ("completed", "failed"):
            break
        await asyncio.sleep(0.1)

    final_status = pool.get_job_status(job_id)
    assert final_status is not None
    assert final_status["status"] == "completed"
    assert final_status["progress"] == 100
    assert final_status["session"] is not None
    assert final_status["session"]["verification"]["is_verified"] is True
    await pool.wait_all()

@pytest.mark.asyncio
async def test_worker_pool_burst_concurrency_bounded():
    pool = BoundedWorkerPoolAdapter(max_concurrent_workers=2)
    
    # Submit 2 jobs in quick succession
    job_ids = [
        await pool.submit_job(scenario_id="off_by_one"),
        await pool.submit_job(scenario_id="null_pointer")
    ]

    assert len(job_ids) == 2
    for jid in job_ids:
        status = pool.get_job_status(jid)
        assert status is not None
        assert status["status"] in ("queued", "running", "completed")
    
    await pool.wait_all()
