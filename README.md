# Chess Arena — RL Chess Engine

A chess project with a **React gaming UI** and a **Python chess engine** (minimax, alpha-beta pruning, piece-square tables).

## Repository structure

| Path | Description |
|------|-------------|
| [`frontend/`](frontend/) | Chess Arena — React + TypeScript + Vite + Tailwind |
| [`chess/`](chess/) | Streamlit app, Python engine, deployment config |

## Quick start — web UI (recommended)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Features

- Playable board with legal moves, check, checkmate, and stalemate
- Move highlights, legal-move indicators, and turn display
- Gaming UI: glassmorphism, neon theme, stats, pause, and new-game flow

### Production build

```bash
cd frontend
npm run build
npm run preview
```

## Quick start — Streamlit + AI

```bash
cd chess
pip install -r requirements.txt
streamlit run app.py
```

See [`chess/README.md`](chess/README.md) for engine details and cloud deployment.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion
- **Backend:** Python 3.8+, Streamlit, custom `chess_engine.py`

## Documentation

- [Frontend README](frontend/README.md)
- [Gaming UI guide](frontend/README_GAMING_UI.md)
- [Backend integration](frontend/BACKEND_INTEGRATION_GUIDE.md)
- [Streamlit / engine README](chess/README.md)

## License

Open source — modify and distribute freely.
