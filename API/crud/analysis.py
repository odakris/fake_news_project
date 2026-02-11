from sqlalchemy.orm import Session
from app.models.analysis_log import AnalysisLog
from app.schemas.analysis import AnalysisResponse # On réutilise le schéma ou un spécifique

# --- LECTURE (READ) ---
def get_analysis_by_uri(db: Session, post_uri: str):
    """
    Cherche si une analyse existe déjà pour ce lien (URI).
    Renvoie l'objet AnalysisLog si trouvé, sinon None.
    """
    return db.query(AnalysisLog).filter(AnalysisLog.post_uri == post_uri).first()

# --- ÉCRITURE (CREATE) ---
def create_analysis(db: Session, post_uri: str, content: str, score: float, verdict: str, did: str):
    """
    Enregistre une nouvelle analyse en base de données.
    """
    # 1. Création de l'objet Python (instance du modèle)
    db_obj = AnalysisLog(
        post_uri=post_uri,
        content_text=content,
        fake_probability=score,
        verdict=verdict,
        requested_by_did=did
    )
    
    # 2. Ajout à la session (staging)
    db.add(db_obj)
    
    # 3. Validation finale (envoi du SQL à la base)
    db.commit()
    
    # 4. Rafraîchissement (récupérer l'ID généré par la BDD)
    db.refresh(db_obj)
    
    return db_obj