from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.session import get_db
from crud import analysis as crud_analysis  # On importe notre nouveau fichier
from services.Ai_detector import FakeNewsDetector
from schemas.analysis import AnalysisRequest, AnalysisResponse
from deps import get_current_user

router = APIRouter()
detector = FakeNewsDetector()

@router.post("/verify", response_model=AnalysisResponse)
async def verify_post(
    request: AnalysisRequest,
    db: Session = Depends(get_db),        # Injection de la BDD
    current_user: dict = Depends(get_current_user) # Injection de l'User
):
    # 1. VÉRIFICATION DU CACHE (Économie d'argent et de temps)
    existing_analysis = crud_analysis.get_analysis_by_uri(db, post_uri=str(request.post_url))
    
    if existing_analysis:
        print("Cache HIT: Résultat trouvé en BDD !")
        return AnalysisResponse(
            is_fake_news_prob=existing_analysis.fake_probability,
            verdict=existing_analysis.verdict,
            reasoning="Résultat issu de l'historique (Cache)."
        )

    # 2. SI PAS EN CACHE : APPEL IA (Coûteux)
    print("Cache MISS: Appel au modèle IA...")
    score = await detector.analyze(request.post_text)
    verdict = "Fake" if score > 0.8 else "Safe"

    # 3. SAUVEGARDE EN BDD (Pour la prochaine fois)
    crud_analysis.create_analysis(
        db=db,
        post_uri=str(request.post_url),
        content=request.post_text,
        score=score,
        verdict=verdict,
        did=current_user['did']
    )

    return AnalysisResponse(
        is_fake_news_prob=score,
        verdict=verdict,
        reasoning="Analyse IA en temps réel."
    )