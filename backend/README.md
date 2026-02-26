# TerraGuard Simulation Backend

This backend provides a simulation-based monitoring engine for the TerraGuard landslide early warning system.

Quick start:

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Place CSV datasets in `backend/data/` or provide full path to `POST /simulation/start`.

3. Run the app from the `backend` folder:

```bash
python main.py
```

API endpoints:
- `POST /simulation/start` (json body or query param `csv_path`, optional `mode`)
- `POST /simulation/stop`
- `POST /simulation/reset`
- `GET /simulation/status`
- `GET /simulation/history`
- `POST /simulation/set-speed` (float seconds)
- `POST /simulation/set-mode` (classification|regression)
