"""Subprocess Resource Profiler Adapter
Monitors peak Resident Set Size (RSS) memory consumption and CPU statistics
to ensure candidate AST patches do not introduce memory leaks or unbounded state growth.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
import os
import sys
import time
from typing import Dict, Tuple, Optional
from backend.core.ports.profiler import ResourceProfilerPort

class SubprocessResourceProfiler(ResourceProfilerPort):
    """
    Adapter implementing ResourceProfilerPort.
    Profiles subprocess memory footprint (RSS in MB) across Windows and POSIX systems.
    Protects production deployments from candidate patches that leak heap memory.
    """

    def __init__(self, default_max_growth_mb: float = 64.0):
        self.default_max_growth_mb = default_max_growth_mb

    def profile_process(self, pid: int) -> Dict[str, float]:
        """
        Retrieves current RSS memory in MB for the target process.
        Uses platform-appropriate system calls with graceful fallback.
        """
        rss_mb = 0.0
        cpu_time_s = 0.0

        try:
            # Attempt psutil if installed in the environment
            import psutil
            try:
                proc = psutil.Process(pid)
                mem = proc.memory_info()
                rss_mb = mem.rss / (1024.0 * 1024.0)
                cpu_times = proc.cpu_times()
                cpu_time_s = cpu_times.user + cpu_times.system
                return {
                    "rss_mb": round(rss_mb, 2),
                    "cpu_time_s": round(cpu_time_s, 3),
                    "is_active": proc.is_running()
                }
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        except ImportError:
            pass

        # Windows-native ctypes fallback
        if sys.platform == "win32":
            try:
                import ctypes
                from ctypes import wintypes

                PROCESS_QUERY_INFORMATION = 0x0400
                PROCESS_VM_READ = 0x0010

                class PROCESS_MEMORY_COUNTERS(ctypes.Structure):
                    _fields_ = [
                        ("cb", wintypes.DWORD),
                        ("PageFaultCount", wintypes.DWORD),
                        ("PeakWorkingSetSize", ctypes.c_size_t),
                        ("WorkingSetSize", ctypes.c_size_t),
                        ("QuotaPeakPagedPoolUsage", ctypes.c_size_t),
                        ("QuotaPagedPoolUsage", ctypes.c_size_t),
                        ("QuotaPeakNonPagedPoolUsage", ctypes.c_size_t),
                        ("QuotaNonPagedPoolUsage", ctypes.c_size_t),
                        ("PagefileUsage", ctypes.c_size_t),
                        ("PeakPagefileUsage", ctypes.c_size_t),
                    ]

                handle = ctypes.windll.kernel32.OpenProcess(
                    PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, False, pid
                )
                if handle:
                    try:
                        counters = PROCESS_MEMORY_COUNTERS()
                        counters.cb = ctypes.sizeof(PROCESS_MEMORY_COUNTERS)
                        if ctypes.windll.psapi.GetProcessMemoryInfo(
                            handle, ctypes.byref(counters), counters.cb
                        ):
                            rss_mb = counters.WorkingSetSize / (1024.0 * 1024.0)
                    finally:
                        ctypes.windll.kernel32.CloseHandle(handle)
            except Exception:
                pass

        return {
            "rss_mb": round(rss_mb, 2),
            "cpu_time_s": round(cpu_time_s, 3),
            "is_active": True
        }

    def evaluate_memory_delta(
        self,
        pre_rss_mb: float,
        post_rss_mb: float,
        max_growth_mb: Optional[float] = None
    ) -> Tuple[bool, Optional[str]]:
        """
        Verifies that memory growth does not exceed allowable threshold.
        """
        limit = max_growth_mb if max_growth_mb is not None else self.default_max_growth_mb
        growth = post_rss_mb - pre_rss_mb

        if growth > limit:
            reason = (
                f"AST Memory Canary Regression: Candidate patch induced {growth:.1f}MB heap growth "
                f"(exceeds maximum allowable boundary of {limit:.1f}MB)."
            )
            return False, reason

        return True, None
