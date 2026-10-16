# AgroClimate AI API

FastAPI foundation for location-based climate summaries and seasonal farming guidance.

## Run locally

From this directory:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

The interactive API reference is available at `http://127.0.0.1:8000/docs`.

## Endpoints

- `GET /health` — process health check; does not call external services.
- `GET /api/v1/climate?latitude=51.5072&longitude=-0.1276` — returns the current calendar month's NASA POWER climate normal and a conservative, explainable farming suggestion. Pass `month=1..12` to inspect another month.

This API uses NASA POWER's public Agroclimatology climatology endpoint. It does not use the `api.nasa.gov` key. The climate normals describe long-term patterns, not a forecast. Responses include the period and the NASA grid-cell coordinates so callers can display the resolution honestly. Recommendations are rule-based examples, not crop-, soil-, or farm-specific prescriptions.

## Tests

From the repository root, after installing `src/backend/requirements-dev.txt`:

```bash
pytest
```

The tests use mocked NASA responses and do not require network access.
