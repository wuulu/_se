from fastapi import FastAPI
import os

app = FastAPI()

@app.get("/ping")
def ping():
    return {"ok": True, "svc": "python", "ts": os.environ.get("TS") or __import__("time").time()*1000}

@app.get("/health")
def health():
    return {"ok": True}
