from pathlib import Path
import hashlib

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="CYBER ALIXEN API",
    description="Defensive cybersecurity learning platform",
    version="1.0.0",
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


class HashRequest(BaseModel):
    text: str = Field(min_length=1, max_length=10000)


@app.get("/")
async def home():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/api/health")
async def health():
    return {
        "status": "online",
        "platform": "CYBER ALIXEN",
        "version": "1.0.0",
    }


@app.post("/api/hash")
async def hash_text(data: HashRequest):
    digest = hashlib.sha256(data.text.encode("utf-8")).hexdigest()
    return {"algorithm": "SHA-256", "hash": digest}


@app.get("/api/modules")
async def modules():
    return {
        "modules": [
            {"name": "Security Learning", "status": "available"},
            {"name": "SHA-256 Hash Tool", "status": "available"},
            {"name": "Password Safety Check", "status": "available"},
            {"name": "Phishing Awareness", "status": "available"},
            {"name": "Community", "status": "demo"},
            {"name": "AI Assistant", "status": "planned"},
        ]
    }
