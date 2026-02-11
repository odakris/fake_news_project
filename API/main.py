from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import api_router
from core.config import settings

app = FastAPI(title="Bluesky Fake News API")

# --- CONFIGURATION CORS ---

origins = [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    
    allow_credentials=True,  
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FIN CONFIGURATION CORS ---

app.include_router(api_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok", "cors": "enabled"}