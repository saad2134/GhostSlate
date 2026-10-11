#!/usr/bin/env python3
"""
GhostSlate Keep-Alive Heartbeat Pinger
Prevents Render free-tier instances from spinning down by sending periodic HTTP requests.
Render spins down after 15 minutes of inactivity; this script pings every 10 minutes.
"""

import sys
import time
import urllib.request
import urllib.error
from datetime import datetime

# Ensure utf-8 output on Windows consoles if supported
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

TARGET_URL = "https://ghostslate.onrender.com/api/scenarios"
INTERVAL_SECONDS = 600  # 10 minutes (must be < 15 minutes to prevent sleep)

def safe_print(msg: str):
    try:
        print(msg)
    except UnicodeEncodeError:
        # Fallback to ASCII for legacy Windows consoles
        print(msg.encode("ascii", errors="replace").decode("ascii"))

def ping_service():
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    start_time = time.time()
    try:
        req = urllib.request.Request(
            TARGET_URL,
            headers={"User-Agent": "GhostSlate-KeepAlive/1.0 (Heartbeat Monitor)"}
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            latency = (time.time() - start_time) * 1000
            safe_print(f"[{timestamp}] [SUCCESS 200] PING OK - Status: {response.status} - Latency: {latency:.1f}ms")
            return True
    except urllib.error.HTTPError as e:
        latency = (time.time() - start_time) * 1000
        safe_print(f"[{timestamp}] [HTTP {e.code}] Service responded - Status: {e.code} - Latency: {latency:.1f}ms")
        return True  # Even 404/500 wakes up Render
    except urllib.error.URLError as e:
        safe_print(f"[{timestamp}] [CONNECTION ERROR] Reason: {e.reason}")
        return False
    except Exception as e:
        safe_print(f"[{timestamp}] [ERROR] {str(e)}")
        return False

def main():
    safe_print("=" * 65)
    safe_print("GhostSlate Render Keep-Alive Daemon Started")
    safe_print(f"Target:   {TARGET_URL}")
    safe_print(f"Interval: {INTERVAL_SECONDS}s ({INTERVAL_SECONDS // 60} minutes)")
    safe_print("=" * 65)
    
    # Initial immediate ping
    ping_service()

    while True:
        time.sleep(INTERVAL_SECONDS)
        ping_service()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        safe_print("\nKeep-alive daemon stopped cleanly.")
