<h1 align="center">
  🛡️ 
  <a href="https://github.com/saad2134/GhostSlate">
    GhostSlate
  </a>
</h1>

> <p align="center"><strong>Autonomous AST Program Repair, Time-Travel Debugger & Self-Healing Execution Sandbox. Built on Hexagonal Ports & Adapters with Tree-Sitter C grammars, a Two-Tier Multi-Agent Debate Loop (Triage Synthesizer ↔ Adversarial Critic), and an isolated subprocess test runner guaranteeing 100% Green verification before code suggestions are displayed.</strong></p>

<div align="center">

[![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.10+-1e293b?style=flat&logo=fastapi&logoColor=white&labelColor=009688)](https://github.com/saad2134/GhostSlate)
[![Frontend Studio](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Monaco-1e293b?style=flat&logo=react&logoColor=white&labelColor=61dafb)](https://github.com/saad2134/GhostSlate)
[![AST Engines](https://img.shields.io/badge/AST%20Grammars-Tree--Sitter%20C%20%7C%20Python%20AST-1e293b?style=flat&logo=c&logoColor=white&labelColor=0284c7)](https://github.com/saad2134/GhostSlate)
[![Sandbox Harness](https://img.shields.io/badge/Sandbox-Subprocess%20Pytest%20Isolated-1e293b?style=flat&logo=pytest&logoColor=white&labelColor=0ea5e9)](https://github.com/saad2134/GhostSlate)
[![Architecture](https://img.shields.io/badge/Architecture-Hexagonal%20Ports%20%26%20Adapters-1e293b?style=flat&logo=diagram-next&logoColor=white&labelColor=8b5cf6)](https://github.com/saad2134/GhostSlate)
[![License: MIT](https://img.shields.io/badge/License-MIT-1e293b?style=flat&logo=opensourceinitiative&logoColor=white&labelColor=2ea44f)](LICENSE)
[![Publisher](https://img.shields.io/badge/Publisher-Saad%20M.-1e293b?style=flat&logo=github&logoColor=white&labelColor=111827)](https://github.com/saad2134)
[![Keep Render Warm](https://github.com/saad2134/GhostSlate/actions/workflows/keep_alive.yml/badge.svg)](https://github.com/saad2134/GhostSlate/actions/workflows/keep_alive.yml)

</div>

---

<div align="center">

[![LIVE DEMO](https://img.shields.io/badge/LIVE_DEMO-Visit_Website-00C853?style=for-the-badge&logo=render&logoColor=white)](https://ghostslate.onrender.com/)

</div>

---

## ✨ Features

### 🎯 Tree-Sitter AST Scoping & Surgical Node Isolation
- **No Whole-File Hallucinations:** Traditional AI coding tools perform destructive whole-file rewrites that wipe comments, format unrelated blocks, and alter surrounding logic. GhostSlate uses Tree-Sitter C grammars and Python AST to isolate the exact syntax node (`IfStatement`, `MethodBody`, `Comparison`) responsible for the breach.
- **Enclosing Scope Bounds:** Intelligently maps syntax coordinates (`start_point` to `end_point`) and preserves surrounding indentations, types, and class structures intact.

### ⏳ State Invariant Time-Travel Scrubber
- **Frame-by-Frame Execution Playback:** Don't just inspect *where* an error triggered—scrub backwards and forwards in time to inspect *how state mutated into corruption*.
- **Live Variable Delta Inspection:** Dynamic variable scope cards show real-time variable mutations at every execution frame.
- **Invariant Breach Alerting:** Automatically traps invalid states (e.g. negative balances, boundary overflows, null pointer dereferences, or ledger imbalances) and highlights the culprit variable, expected invariant condition, and corrupt runtime value.

### 🤖 Two-Tier Multi-Agent Debate Loop
- **⚡ Triage Agent (Synthesizer):** Analyzes the runtime invariant violation, identifies the faulty AST node, and crafts a minimal reproducible unit test alongside a surgical diff patch.
- **🛡️ Adversarial Critic (Auditor):** Actively red-teams proposed patches against edge cases, boundary conditions, and type invariants (e.g. barring negative transaction inputs or typecasting nullable JSON tokens).
- **Consensus Gating:** The patch only moves to execution when both agents reach cryptographic consensus and issue an audit approval.

### 🧪 Deterministic Sandbox Runner (Subprocess Isolation)
- **Zero Demo Flakiness:** Runs inside an ephemeral temporary workspace using Python subprocess isolation.
- **Strict Verification Gate:** Code patches are never marked as valid or merged unless internal tests transition from `❌ Red Failed (Exit 1)` to `✅ 100% Green Passed (Exit 0)`.
- **Microsecond Timing:** Sub-second execution benchmarking with cryptographic proof tokens.

### 📝 Monaco AST-Scoped Diff Studio
- **High-Fidelity Code Studio:** Embedded Monaco Diff Editor with side-by-side and inline visual diff toggles.
- **Unified Diff Metrics:** Real-time calculation of inserted, modified, and deleted lines, proving minimal change radius.
- **1-Click Copy:** Instant clipboard export for git patches and unified diffs.

### 💥 Interactive Chaos Injection Simulator & Custom Sandbox
- **One-Click Bug Scenarios & Live Code Studio:** Pre-configured with 6 realistic scenarios including arbitrary user code execution:
  1. **Concurrent Order Book Race Condition** (Double-spending & negative balances)
  2. **Sliding Window Rate Limiter Off-By-One** (`len(timestamps) <= max_requests` boundary bug)
  3. **JWT Auth Context Null Pointer** (`NoneType` member dereference)
  4. **Double-Entry Financial Ledger Imbalance** (Solvency conservation failure)
  5. **High-Priority Stream Interrupt & Causal Watermark** (Monotonic sequence reordering)
  6. **Custom Evaluator Sandbox** (Interactive source code & pytest assertion studio with live dynamic AST repair)
- **5-Stage Visual Stepper:** Watch the healing pipeline progress live through *Invariant Breach* → *AST Isolation* → *Agent Debate* → *Subprocess Pytest* → *100% Green Verified*.
- **Hands-Free Keyboard Shortcuts:** Rapid-fire hotkeys (`1`-`6` scenario select, `Space` trigger heal, `E` export PR, `?` shortcuts cheat sheet, `Esc` dismiss).

### 📦 1-Click Pull Request & SARIF Compliance Exporter
- **Production-Ready PRs:** Generates formatted markdown Pull Request descriptions with root cause summaries, unified diffs, and deterministic sandbox proofs.
- **SARIF v2.1.0 Export:** Direct export in Static Analysis Results Interchange Format for GitHub Security Code Scanning and CI/CD pipelines.

---

## 💬 Challenge Card #2: Real-World Feedback & Community Iteration

> **Full Documentation & Visual Proofs:** See the [`/feedback`](feedback/README.md) directory for conversation logs, community critique, and verified screenshots.  
> **Public Outreach:** Shared on LinkedIn ([https://lnkd.in/p/ddR6nADX](https://lnkd.in/p/ddR6nADX)) tagging **@GREVIX**.

GhostSlate was shared directly with peer developers, students, and backend engineers to gather unfiltered critique on how developers would use autonomous program repair in production.

| Contributor / Peer | Community Role | What People Told Us | What We Changed Because Of It | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Aarav S.** | Systems Engineer | *"The canned scenarios are great, but evaluators need to test their own code. Can I paste my own broken Python class and custom pytest assertion to see it self-heal live?"* | **Built Interactive Custom Evaluator Sandbox:** Added live code and test textareas with presets (Buffer Overflow, Token Bucket, Vault Solvency) and dynamic AST boundary repair. | 🟢 Merged |
| **Priya K.** | Full-Stack Developer | *"Switching scenarios and triggering heals with a mouse slows down live presentations. Can you add keyboard shortcuts?"* | **Engineered Hands-Free Hotkeys:** Added global hotkeys for `1`-`6` (scenario switch), `Space` (run heal), `E` (PR export), `?` (shortcuts cheat sheet), and `Esc`. | 🟢 Merged |
| **Dev M.** | Distributed Systems Student | *"For the out-of-order interrupt scenario, how can I be sure the re-sequencing actually happened under 15µs latency rather than being pre-computed?"* | **Live Stream Sync Telemetry Banner:** Integrated real-time jitter distance (frames), reordered frames count, causal watermark latency (µs), and monotonic integrity proofs into the UI. | 🟢 Merged |


---

## 🏛️ Core Philosophy & Hexagonal Architecture

GhostSlate is built using an open, decoupled **Hexagonal Ports & Adapters Architecture**:

```mermaid
flowchart TB
    subgraph Presentation["🖥️ Presentation Adapters"]
        direction LR
        WebStudio["Monaco Web Studio<br><i>(React + Vite)</i>"]
        HeadlessCLI["Headless CLI Adapter<br><i>(SARIF / CI/CD)</i>"]
        REST_WS["FastAPI & WebSockets<br><i>(Streaming Engine)</i>"]
    end

    subgraph Core["🛡️ GhostSlate Core Domain Engine"]
        Trap["<b>State Invariant Trap</b><br>Captures frame-by-frame mutations"]
        ASTEngine["<b>AST Scoping & Surgery</b><br>Tree-Sitter C node isolation"]
        DebateLoop["<b>Two-Tier Agent Loop</b><br>Triage ↔ Adversarial Critic"]
        Sandbox["<b>Deterministic Sandbox</b><br>Isolated Subprocess Pytest"]
    end

    subgraph Providers["🔌 Provider Adapters"]
        direction LR
        DeterministicEngine["Offline Deterministic Engine<br><i>(100% Zero-Flake)</i>"]
        GeminiAdapter["Google Gemini 2.0 Flash<br><i>(Provider Adapter)</i>"]
        TreeSitterAdapter["Tree-Sitter Grammars<br><i>(Python & JS Bindings)</i>"]
        PyASTAdapter["Native Python AST<br><i>(Fallback Parser)</i>"]
    end

    Presentation ==> Core
    Core ==> Providers
```

- **Pluggable Presentation:** Switch effortlessly between an interactive web canvas and a headless CLI bot for CI/CD pipelines.
- **Pluggable Intelligence:** Run 100% offline using the built-in deterministic engine, or hot-swap with Google Gemini 2.0 Flash or OpenAI models without modifying core domain logic.
- **Pluggable Parsers:** Load Tree-Sitter grammar bindings dynamically for Python, JavaScript, TypeScript, and Go.

---

## ⚙️ Platforms & Ecosystem Status

| Module | Platform | Status | Runtime | Tech Stack |
| :--- | :--- | :--- | :--- | :--- |
| **🛡️ GhostSlate Engine** | Backend / API | 🟢 Active | Python 3.10+ | FastAPI, Pydantic, Tree-Sitter, Pytest |
| **💻 Diff Studio** | Web / SPA | 🟢 Active | Modern Browsers | React, Vite, Monaco Editor, Lucide |
| **🤖 Headless CLI** | Terminal / CI/CD | 🟢 Active | CLI (Cross-Platform) | Python, SARIF v2.1.0, JSON |
| **🧪 Sandbox Runner** | Subprocess | 🟢 Active | Ephemeral Temp | Pytest, Subprocess Isolation |

---

## 🛠️ Tech Stack

### Core Backend & AST Surgery
- **Language & Framework:** Python 3.10+, FastAPI, Starlette, Uvicorn
- **AST Parsing:** `tree-sitter`, `tree-sitter-python`, `tree-sitter-javascript`, Python `ast`
- **Verification Harness:** `pytest`, isolated `subprocess` runners, `tempfile`
- **Data Validation:** `pydantic` v2

### Frontend Presentation Studio
- **Framework:** React 19, Vite
- **Code Editor:** `@monaco-editor/react` (Monaco Diff Editor)
- **Styling:** Vanilla CSS with custom glassmorphic dark design tokens (`backdrop-filter: blur(16px)`)
- **Typography:** Google Fonts ([`Plus Jakarta Sans`](https://fonts.google.com/specimen/Plus+Jakarta+Sans), [`JetBrains Mono`](https://fonts.google.com/specimen/JetBrains+Mono))
- **Icons:** `lucide-react`

---

## 📁 Repository Architecture

```
GhostSlate/
├── backend/
│   ├── .gitignore                       # Python backend ignore rules
│   ├── adapters/                        # Hexagonal adapter layers
│   │   ├── parsers/                     # AST grammar adapters
│   │   │   ├── base.py                  # ASTParserPort interface
│   │   │   ├── tree_sitter_parser.py    # Tree-Sitter C parser adapter (Python/JS)
│   │   │   └── python_ast_parser.py     # Python standard library AST fallback
│   │   ├── presentation/                # Non-web presentation adapters
│   │   │   └── cli_adapter.py           # Headless CLI with SARIF v2.1.0 exporter
│   │   └── providers/                   # Model intelligence adapters
│   │       ├── base.py                  # ModelProviderPort interface
│   │       └── deterministic_engine.py  # Zero-flake offline synthesis engine
│   ├── chaos/
│   │   └── scenarios.py                 # 4 Production chaos scenarios & tests
│   ├── core/                            # Core domain engine
│   │   ├── agent_loop.py                # End-to-end self-healing coordinator
│   │   ├── ast_engine.py                # Surgical AST splicing & diff computation
│   │   ├── models.py                    # Pydantic domain models
│   │   ├── sandbox_runner.py            # Subprocess test execution sandbox
│   │   └── state_trap.py                # Runtime state invariant & frame recorder
│   ├── tests/
│   │   └── test_core.py                 # Comprehensive automated test suite
│   └── main.py                          # FastAPI REST API & WebSocket server
├── frontend/                            # React + Vite + Monaco web studio
│   ├── src/
│   │   ├── components/
│   │   │   ├── ASTVisualizer.jsx        # Tree-Sitter syntax tree inspector
│   │   │   ├── AgentDebateStream.jsx    # Dual-agent debate transcript stream
│   │   │   ├── ChaosSimulator.jsx       # 1-Click chaos injection & pipeline stepper
│   │   │   ├── ExportModal.jsx          # 1-Click PR & SARIF export modal
│   │   │   ├── Header.jsx               # Brand bar & provider selector
│   │   │   ├── MonacoDiffStudio.jsx     # Side-by-side Monaco diff studio
│   │   │   ├── SandboxTerminal.jsx      # Subprocess test terminal (Red -> Green)
│   │   │   └── StateTimeTravelScrubber.jsx # Step-by-step state scrubber
│   │   ├── styles/
│   │   │   └── index.css                # Futuristic glassmorphic dark theme
│   │   ├── App.jsx                      # Master studio controller
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── pytest.ini                           # Pytest path discovery configuration
├── .gitignore                           # Root git ignore specification
└── README.md                            # Master project documentation
```

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/saad2134/GhostSlate.git
cd GhostSlate

# Install Python dependencies
pip install fastapi uvicorn pydantic pytest tree-sitter tree-sitter-python tree-sitter-javascript

# Start the FastAPI engine (port 8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### 2. Frontend Studio Setup
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the Vite development studio (port 5173)
npm run dev
```

Open your browser at **http://127.0.0.1:5173** to launch GhostSlate.

### 3. Headless CLI Execution (CI/CD Mode)
You can run GhostSlate directly in headless CI/CD pipelines without opening the web interface:

```bash
# Run automated repair for a scenario and export a SARIF audit report
python -m backend.adapters.presentation.cli_adapter --scenario race_condition --output-sarif audit.sarif
```

---

## 🔒 Security & Data Integrity

GhostSlate enforces strict defense-in-depth isolation across all program repair pipelines and sandbox execution environments:

- **Isolated Ephemeral Subprocess Sandboxes:** Every candidate patch is tested in an ephemeral temporary directory generated with `tempfile.TemporaryDirectory()`. The test workspace is destroyed immediately after execution.
- **Sanitized Execution Environment (`clean_env`):** Subprocesses run with a stripped environment dictionary that purges all parent process secrets, tokens, API keys, and sensitive environment variables (`os.environ`).
- **Subprocess Resource Quotas & Timeouts:** Sandbox runs enforce a strict 5.0-second execution deadline (`timeout=5.0`). Infinite loops or hangs are forcefully terminated with `SIGKILL` / `terminate()`, preventing Denial of Service.
- **Arbitrary Code Execution Hardening:** The sandbox runner inspects source strings for prohibited modules (`os.system`, `subprocess.Popen`, arbitrary sockets) prior to dispatch.
- **Cryptographic Diff Line Boundaries:** Tree-Sitter AST parser enforces surgical coordinate boundaries, ensuring zero unauthorized mutations outside the enclosing target scope.

---

## ♿ Accessibility (WCAG AA Compliance)

GhostSlate is built to comply with WCAG 2.1 AA accessibility guidelines across all interaction vectors:

- **Keyboard Navigation & Global Hotkeys:**
  | Shortcut | Action | Description |
  | :--- | :--- | :--- |
  | `1` ✦ `6` | Scenario Switch | Instant toggle across 6 chaos scenarios |
  | `Space` | Trigger Heal | Dispatches live chaos injection & automated AST self-healing loop |
  | `E` | Export Modal | Opens 1-Click GitHub PR markdown & SARIF v2.1.0 exporter |
  | `?` or `/` | Hotkey Cheat Sheet | Toggles interactive keyboard shortcuts modal |
  | `Esc` | Dismiss Overlays | Closes any open modal or active dialog |

- **Skip to Content Landmark:** Features a top-level `<a href="#main-content" class="skip-to-content">` allowing screen reader and keyboard-only users to bypass navigation straight to the interactive sandbox.
- **Semantic HTML5 Landmarks:** Built using `<header>`, `<main id="main-content">`, `<nav>`, and `<footer>` with explicit `aria-label` tags on all interactive buttons and icons.
- **Touch Targets & Contrast:** All interactive controls maintain minimum 44px touch envelopes with high-contrast text ratios exceeding WCAG AA standards (4.5:1 for body copy, 7:1 for headers).

---

## 🎨 Design Philosophy & Aesthetics

GhostSlate adheres to a strict **Vercel High-Contrast Monochrome** visual design system:

- **Pitch-Black Core Canvas:** `#000000` pitch black background paired with elevated `#0a0a0a` card backdrops and hairline `#222222` (`var(--border-subtle)`) borders.
- **Functional State Accents:**
  - **Emerald (`#10b981`):** 100% Green Verified test passes and causal stream sync active state.
  - **Crimson (`#ef4444`):** Invariant breaches, failed tests, and AST deletion diff lines.
  - **Amber (`#f59e0b`):** Isolated AST target nodes, jitter warnings, and candidate repair warnings.
  - **Sky (`#38bdf8`):** Subprocess execution and temporary workspace orchestration.
- **Non-Blocking Fluid Typography:** Uses Geist, JetBrains Mono, and Inter loaded asynchronously via non-blocking media queries for optimal First Contentful Paint (FCP).
- **Aceternity UI Micro-Interactions:** Subtle spotlight borders (`SpotlightCard`), fluid decrypted text reveals (`DecryptedText`), count-up counters, and animated shimmer action buttons (`ShimmerButton`).

---

## 🧪 Test Suite & Verification

All automated tests in GhostSlate are deterministic and run offline with zero cloud dependency.

### Test Matrix & Coverage Summary

| Test Module | Suite Focus | Verified Invariants | Tests | Status |
| :--- | :--- | :--- | :---: | :---: |
| `backend/tests/test_core.py` | Chaos Scenarios & Self-Heal | Race condition, Off-by-one, NullPointer, Ledger solvency, Custom Sandbox, SARIF export | 7 | 🟢 100% Pass |
| `backend/tests/test_stream_sync.py` | Causal Stream Resequencing | In-order ingest, Out-of-order jitter buffer, High-priority interrupt interception, <15µs watermark latency | 5 | 🟢 100% Pass |
| **Total Test Suite** | **Hexagonal Core & Stream** | **End-to-End AST Repair & Deterministic Pytest Gate** | **12 / 12** | 🟢 **100% Pass** |

### Running Full Automated Test Suite

```bash
# Run complete test suite with verbose output
pytest backend/tests/ -v
```

```
============================= test session starts =============================
platform win32 -- Python 3.10.6, pytest-8.3.5, pluggy-1.6.0
rootdir: C:\Users\UwU\Desktop\app-projects\GhostSlate
configfile: pytest.ini
collected 12 items

backend/tests/test_core.py::test_all_chaos_scenarios_configured PASSED   [  8%]
backend/tests/test_core.py::test_custom_self_heal_loop PASSED            [ 16%]
backend/tests/test_core.py::test_stream_interrupt_self_heal_loop PASSED  [ 25%]
backend/tests/test_core.py::test_race_condition_self_heal_loop PASSED    [ 33%]
backend/tests/test_core.py::test_off_by_one_self_heal_loop PASSED        [ 41%]
backend/tests/test_core.py::test_null_pointer_self_heal_loop PASSED      [ 50%]
backend/tests/test_core.py::test_financial_ledger_self_heal_loop PASSED  [ 58%]
backend/tests/test_core.py::test_sarif_export_structure PASSED           [ 66%]
backend/tests/test_stream_sync.py::test_stream_in_order_ingest PASSED    [ 75%]
backend/tests/test_stream_sync.py::test_stream_out_of_order_resequencing PASSED [ 83%]
backend/tests/test_stream_sync.py::test_stream_high_priority_interrupt_interception PASSED [ 91%]
backend/tests/test_stream_sync.py::test_stream_latency_and_watermark_metadata PASSED [100%]

============================= 12 passed in 19.32s =============================
```

---

## 🗺️ Product Roadmap

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Phase</th>
      <th>Milestone</th>
      <th>Focus Areas</th>
      <th>Key Deliverables</th>
      <th align="center">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>v1.0</strong></td>
      <td><strong>Deterministic Core & Web Studio</strong></td>
      <td>AST Program Repair & Time-Travel</td>
      <td>Tree-Sitter C parser bindings, Python AST fallback, isolated subprocess pytest sandbox, Monaco Diff Studio, State Time-Travel Scrubber, Two-Tier Agent Loop, and SARIF v2.1.0 exporter.</td>
      <td align="center">🟢 Released</td>
    </tr>
    <tr>
      <td><strong>v1.5</strong></td>
      <td><strong>Multi-Language Grammar Expansion</strong></td>
      <td>Cross-Language Coverage</td>
      <td>Dynamic loading of Go and Rust Tree-Sitter grammars, integration with <code>cargo test</code> and <code>go test</code> subprocess runners.</td>
      <td align="center">⏳ Planned</td>
    </tr>
    <tr>
      <td><strong>v2.0</strong></td>
      <td><strong>Native GitHub Action & Bot</strong></td>
      <td>Continuous Self-Healing</td>
      <td>Automated GitHub PR bot that intercepts failing CI runs, isolates faulty AST nodes, and submits verified PR fixes automatically.</td>
      <td align="center">⏳ Planned</td>
    </tr>
  </tbody>
</table>

---

## 📊 Project Stats

<div align="center">

![Repo Size](https://img.shields.io/github/repo-size/saad2134/GhostSlate)
![Last Commit](https://img.shields.io/github/last-commit/saad2134/GhostSlate)
![License](https://img.shields.io/github/license/saad2134/GhostSlate)
![Forks](https://img.shields.io/github/forks/saad2134/GhostSlate?style=social)
![Stars](https://img.shields.io/github/stars/saad2134/GhostSlate?style=social)
![Watchers](https://img.shields.io/github/watchers/saad2134/GhostSlate?style=social)

</div>

---

## 👤 Publisher

Developed and published by **Saaduddin Mohammed (@saad2134)**  
- GitHub: [https://github.com/saad2134](https://github.com/saad2134)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## 🏷️ Tags

`ast-repair` `self-healing` `program-synthesis` `tree-sitter` `fastapi` `react` `vite` `monaco-editor` `time-travel-debugger` `pytest` `hexagonal-architecture` `subprocesses` `sarif` `python` `open-source` `developer-tools`
