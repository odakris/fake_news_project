from pydantic import BaseModel, HttpUrl

# Front resquest
class AnalysisRequest(BaseModel):
    post_text: str
    post_url: HttpUrl
    bsky_handle: str  # Pour vérifier l'identité

# Api response
class AnalysisResponse(BaseModel):
    is_fake_news_prob: float  # ex: 0.85
    verdict: str       
    reasoning: str