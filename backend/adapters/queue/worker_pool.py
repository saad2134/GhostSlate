import time
import uuid
import asyncio
import threading
from typing import Dict, Any, Optional
from backend.core.ports.queue import TaskQueuePort
from backend.core.agent_loop import AgentLoopCoordinator

class BoundedWorkerPoolAdapter(TaskQueuePort):
    """
    Controlled concurrency worker pool adapter.
    Implements TaskQueuePort using an asyncio semaphore to protect the host OS
    from kernel subprocess saturation and tempfile I/O bottlenecks during burst traffic.
    """

    def __init__(
        self,
        coordinator: Optional[AgentLoopCoordinator] = None,
        max_concurrent_workers: int = 4,
        max_workers: Optional[int] = None
    ):
        actual_workers = max_workers if max_workers is not None else max_concurrent_workers
        self.coordinator = coordinator or AgentLoopCoordinator()
        self.max_concurrent_workers = actual_workers
        self._semaphore = asyncio.Semaphore(actual_workers)
        self._jobs: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.RLock()
        self._tasks: list[asyncio.Task] = []
        self._is_shutdown: bool = False

    @property
    def is_shutdown(self) -> bool:
        return self._is_shutdown

    def shutdown(self) -> None:
        self._is_shutdown = True

    async def submit_job(
        self,
        scenario_id: str,
        custom_code: Optional[str] = None,
        custom_test: Optional[str] = None
    ) -> str:
        job_id = f"job_{uuid.uuid4().hex[:10]}"
        job_info = {
            "job_id": job_id,
            "scenario_id": scenario_id,
            "status": "queued",
            "progress": 0,
            "created_at": time.time(),
            "session": None,
            "error": None
        }

        with self._lock:
            self._jobs[job_id] = job_info

        # Schedule processing in background
        task = asyncio.create_task(
            self._process_job(job_id, scenario_id, custom_code, custom_test)
        )
        self._tasks.append(task)
        return job_id

    async def wait_all(self, timeout: float = 20.0) -> None:
        """Awaits all active worker tasks, useful for clean lifecycle shutdown and tests."""
        pending = [t for t in self._tasks if not t.done()]
        if pending:
            await asyncio.wait(pending, timeout=timeout)

    async def _process_job(
        self,
        job_id: str,
        scenario_id: str,
        custom_code: Optional[str],
        custom_test: Optional[str]
    ) -> None:
        async with self._semaphore:
            with self._lock:
                if job_id in self._jobs:
                    self._jobs[job_id]["status"] = "running"
                    self._jobs[job_id]["progress"] = 25

            try:
                # Execute CPU & subprocess bound healing loop in worker thread
                session = await asyncio.to_thread(
                    self.coordinator.run_healing_session,
                    scenario_id,
                    custom_code,
                    custom_test
                )

                with self._lock:
                    if job_id in self._jobs:
                        self._jobs[job_id]["status"] = "completed"
                        self._jobs[job_id]["progress"] = 100
                        self._jobs[job_id]["session"] = session

            except Exception as exc:
                with self._lock:
                    if job_id in self._jobs:
                        self._jobs[job_id]["status"] = "failed"
                        self._jobs[job_id]["progress"] = 100
                        self._jobs[job_id]["error"] = str(exc)

    def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            job = self._jobs.get(job_id)
            if not job:
                return None
            return {
                "job_id": job["job_id"],
                "scenario_id": job["scenario_id"],
                "status": job["status"],
                "progress": job["progress"],
                "created_at": job["created_at"],
                "session": job["session"].model_dump() if job["session"] else None,
                "error": job["error"]
            }
