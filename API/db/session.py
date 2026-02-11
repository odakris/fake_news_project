from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings

# 1. Création du moteur de base de données
# On récupère l'URL de connexion depuis nos settings (.env)
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# 2. Création de l'usine à sessions
# autocommit=False : On veut contrôler quand valider les changements
# autoflush=False : On veut contrôler quand envoyer les données
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. La dépendance (Dependency) pour FastAPI
def get_db():
    """
    Crée une nouvelle session de base de données pour une requête,
    et la ferme obligatoirement à la fin, même en cas d'erreur.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()