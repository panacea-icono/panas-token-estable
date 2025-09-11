from fastapi import FastAPI
from datetime import datetime

app = FastAPI(title="PANAS Index API")

@app.get("/health")
def health():
    return {"ok": True, "ts": datetime.utcnow().isoformat()}

@app.get("/index/price")
def index_price():
    # TODO: agregar lógica de agregación (tokens.yaml + oráculos)
    return {"symbol": "PANAS", "price": None, "note": "WIP"}
