from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analysis
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Beadazzled API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # We'll lock this down at deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/api")

@app.get("/")
async def root():
    return {"status": "Beadazzled API is running"}


@app.get("/test-key")
async def test_key():
    import os
    key = os.getenv("ANTHROPIC_API_KEY")
    if key:
        return {"key_loaded": True, "key_prefix": key[:10]}
    return {"key_loaded": False}