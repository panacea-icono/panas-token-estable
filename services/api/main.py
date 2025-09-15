from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Dict, Any
import json
import os

# Importar el router de webhooks
from webhook_handler import router as webhook_router

app = FastAPI(title="PANAS Index API")

# Incluir el router de webhooks
app.include_router(webhook_router)

@app.get("/health")
def health():
    return {"ok": True, "ts": datetime.utcnow().isoformat()}

@app.get("/index/price")
def index_price():
    # TODO: agregar lógica de agregación (tokens.yaml + oráculos)
    return {"symbol": "PANAS", "price": None, "note": "WIP"}


# ==================== Fiat Index ====================

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DATA_FILE = os.path.join(DATA_DIR, "fiat_index.json")

os.makedirs(DATA_DIR, exist_ok=True)

def _load_fiat_db() -> Dict[str, Any]:
    if not os.path.exists(DATA_FILE):
        return {}
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def _save_fiat_db(db: Dict[str, Any]) -> None:
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)


def calculate_fiat_index(fx_official: float, fx_parallel: float, fx_usdt: float) -> float:
    """
    Calcular el índice fiat compuesto a partir de múltiples fuentes FX.
    Pesos por defecto: oficial 0.2, paralelo 0.4, usdt 0.4.
    """
    w_official = 0.2
    w_parallel = 0.4
    w_usdt = 0.4
    return (fx_official * w_official) + (fx_parallel * w_parallel) + (fx_usdt * w_usdt)


class FXData(BaseModel):
    fx_official: float = Field(..., gt=0)
    fx_parallel: float = Field(..., gt=0)
    fx_usdt: float = Field(..., gt=0)


@app.post("/oracles/fx/update")
async def update_fiat_index(data: FXData):
    try:
        idx = calculate_fiat_index(data.fx_official, data.fx_parallel, data.fx_usdt)
        db = _load_fiat_db()
        today = date.today().isoformat()
        db[today] = {
            "fx_official": data.fx_official,
            "fx_parallel": data.fx_parallel,
            "fx_usdt": data.fx_usdt,
            "fiat_index": idx,
            "updated_at": datetime.utcnow().isoformat(),
        }
        _save_fiat_db(db)
        return {"message": "Índice fiat actualizado exitosamente", "date": today, "index": idx}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/oracles/fx/today")
def get_today_fiat_index():
    db = _load_fiat_db()
    today = date.today().isoformat()
    rec = db.get(today)
    return {"date": today, "record": rec}
