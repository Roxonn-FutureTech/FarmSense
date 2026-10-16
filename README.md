# AgroClimate AI 🌾🌡️

Climate information and practical planning ideas for climate-smart agriculture.

## Overview

The current homepage sample uses NASA POWER monthly climate normals and explainable seasonal rules. Climate normals describe long-term patterns; they are not a current weather forecast. Recommendations are general examples and are not crop- or soil-specific agronomic advice.

## Project structure

```
agroclimate-ai/
├── src/
│   ├── frontend/       Next.js homepage and climate-data route
│   ├── backend/        FastAPI climate API foundation
│   ├── data_pipeline/  NASA/IBM connector scaffolding
│   └── ml_model/       Experimental model scaffolding
└── tests/              Backend unit tests
```

The NASA POWER route uses its public Agroclimatology climate-normal endpoint. It does not require the `api.nasa.gov` key. The IBM connector and machine-learning modules are placeholders, not active prediction services.

## Run the frontend

```bash
cd src/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Run the FastAPI foundation

In a second terminal:

```bash
cd src/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

Interactive API docs are at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

- `GET /health` checks that the API process is running.
- `GET /api/v1/climate?latitude=51.5072&longitude=-0.1276` returns the current calendar month's climate normal and an explainable starter suggestion. Pass `month=1..12` to inspect another month.

## Run tests

After installing `src/backend/requirements-dev.txt`:

```bash
pytest
```

NASA responses are mocked in tests; running the suite does not require network access.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
