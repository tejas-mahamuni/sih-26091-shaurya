# UdyamSaathi Backend Services

Microservice architecture — each service runs independently.

## Services

| Service | Language | Port | Purpose |
|---------|----------|------|--------|
| `services/rag/` | Node.js (Express) | 3000 | RAG pipeline — PDF ingestion, vector search, LLM Q&A |
| `services/core_api/` | Python (FastAPI) | 8000 | Core Engine — Module 1 (Feasibility Engine) & Module 2 (Financial Structure) |

## Running Services

### RAG Service (JS)
```bash
cd services/rag
npm install
node server.js
```

Requires: Ollama (localhost:11434), Qdrant (localhost:6333)

### Core Engine Service (Python)
```bash
cd services/core_api
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Requires: Supabase PostgreSQL + PostGIS (configured via .env)

## Adding New Services

Create a new folder under `services/` with its own dependency management:
- JS services: include their own `package.json`
- Python services: include their own `requirements.txt` + `venv/`
