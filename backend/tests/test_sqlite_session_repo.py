import os
import time
import tempfile
import pytest
from concurrent.futures import ThreadPoolExecutor
from backend.adapters.repositories.sqlite_session_repo import SQLiteSessionRepository
from backend.core.models import SelfHealingSession, VerificationResult

def create_sample_session(session_id: str, scenario_id: str = "race_condition") -> SelfHealingSession:
    verification = VerificationResult(
        patch_id=f"p_{session_id}",
        is_verified=True,
        pre_patch_test_output="failed",
        post_patch_test_output="passed",
        exit_code=0,
        duration_ms=45.2,
        tests_passed=1,
        tests_failed=0,
        deterministic_proof="Verified 100% Green",
        pre_duration_ms=25.0,
        post_duration_ms=20.2,
        canary_passed=True
    )
    return SelfHealingSession(
        session_id=session_id,
        scenario_id=scenario_id,
        title=f"Session {session_id}",
        language="python",
        original_code="def f(): pass",
        test_suite="def test_f(): pass",
        verification=verification,
        stage="healed"
    )

def test_sqlite_repo_save_and_retrieve_by_id():
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
        db_path = f.name

    try:
        repo = SQLiteSessionRepository(db_path=db_path)
        sess = create_sample_session("sess_001", "race_condition")
        repo.save(sess)

        retrieved = repo.get_by_id("sess_001")
        assert retrieved is not None
        assert retrieved.session_id == "sess_001"
        assert retrieved.scenario_id == "race_condition"
        assert retrieved.verification.is_verified is True
        assert retrieved.verification.duration_ms == 45.2
        assert retrieved.verification.canary_passed is True
        repo.close()
    finally:
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
            except Exception:
                pass

def test_sqlite_repo_get_latest_by_scenario():
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
        db_path = f.name

    try:
        repo = SQLiteSessionRepository(db_path=db_path)
        sess1 = create_sample_session("sess_old", "stream_interrupt")
        repo.save(sess1)
        time.sleep(0.02)
        sess2 = create_sample_session("sess_new", "stream_interrupt")
        repo.save(sess2)

        latest = repo.get_latest_by_scenario("stream_interrupt")
        assert latest is not None
        assert latest.session_id == "sess_new"
        repo.close()
    finally:
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
            except Exception:
                pass

def test_sqlite_repo_survives_process_restart():
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
        db_path = f.name

    try:
        # Instance A saves session
        repo_a = SQLiteSessionRepository(db_path=db_path)
        sess = create_sample_session("sess_reboot_test", "off_by_one")
        repo_a.save(sess)
        repo_a.close()

        # Instance B reopens database file
        repo_b = SQLiteSessionRepository(db_path=db_path)
        reopened = repo_b.get_by_id("sess_reboot_test")
        assert reopened is not None
        assert reopened.title == "Session sess_reboot_test"
        assert reopened.scenario_id == "off_by_one"
        repo_b.close()
    finally:
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
            except Exception:
                pass

def test_sqlite_repo_concurrent_writes():
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
        db_path = f.name

    try:
        repo = SQLiteSessionRepository(db_path=db_path)

        def write_worker(idx: int):
            sess = create_sample_session(f"conc_{idx}", "custom")
            repo.save(sess)

        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(write_worker, i) for i in range(20)]
            for fut in futures:
                fut.result()

        recent = repo.list_recent(limit=50)
        assert len(recent) == 20
        repo.close()
    finally:
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
            except Exception:
                pass
