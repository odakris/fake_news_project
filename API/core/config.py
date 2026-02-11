from pydantic import AnyHttpUrl, validator
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # ... autres configs ...
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    # ajouter l'url de connexion à la base de données

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

settings = Settings()