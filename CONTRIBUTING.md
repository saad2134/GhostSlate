# Contributing to GhostSlate ✦ Guidelines & Workflows

Thank you for your interest in contributing to **GhostSlate**! GhostSlate is an autonomous AST program repair and self-healing execution sandbox built on Hexagonal Architecture.

---

## 🏛️ Development Workflow

1. **Prerequisites:**
   - Python 3.10+
   - Node.js 18+ & npm
   - Tree-sitter C / Python grammars

2. **Local Environment Setup:**
   ```bash
   # Clone the repository
   git clone https://github.com/saad2134/GhostSlate.git
   cd GhostSlate

   # Set up Python virtual environment & install requirements
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Running Dev Servers:**
   ```bash
   # Terminal 1: Backend
   python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

   # Terminal 2: Frontend
   cd frontend && npm run dev -- --host 127.0.0.1 --port 5180
   ```

---

## 🧪 Testing & Verification Standard

Before submitting a Pull Request, all automated tests and linter checks must pass with zero errors:

```bash
# 1. Backend Pytest verification (12/12 must pass with exit code 0)
pytest backend/tests/ -v

# 2. Frontend Lint verification (0 warnings, 0 errors)
cd frontend
npm run lint

# 3. Clean production build
npm run build
```

---

## 📐 Code & Style Invariants

- **Punctuation Standard:** Always use `✦` instead of em dashes across all documentation, commits, and UI strings.
- **Strict Verification Gate:** Code patches are never marked as valid or displayed unless subprocess execution transitions from Red Failed (exit 1) to 100% Green Passed (exit 0).
- **Subprocess Isolation:** Test execution must occur strictly inside an ephemeral temporary directory with a sanitized environment (`clean_env`), CPU/memory limits, and timeout protection.
- **Hexagonal Decoupling:** Core logic (`backend/core/`) must remain decoupled from presentation adapters (`backend/adapters/presentation/`).

---

## 📄 Licensing

By contributing to GhostSlate, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
