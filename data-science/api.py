#  Lancer le serveur : uvicorn api:app --reload
#  http://localhost:8000/docs

from fastapi import FastAPI
from transformers import pipeline
from pydantic import BaseModel

from predict import analyze_emotion, compute_credibility_score, predict_texts_distilbert, get_top_words

class TextRequest(BaseModel):
    text: str
    top_k: int = 10

app = FastAPI()

# Chargement des modèles au démarrage (une seule fois)
classifier = pipeline("text-classification", model="./models/distilbert", tokenizer="./models/distilbert")
emotion_classifier = pipeline("text-classification", model="./models/emotion", tokenizer="./models/emotion", top_k=None, device=-1, truncation=True)

@app.post("/fakenews/verify")
def verify(request: TextRequest):
    """Analyse un texte pour détecter les fake news.
    
    Args:
        request: corps de la requête contenant le texte à analyser
    
    Returns:
        dict: classification DistilBERT (label + confidence), 
              analyse émotionnelle (7 émotions),
              score de crédibilité final (0 à 1)
    """
    text = request.text

    distilbert_label, distilbert_score = predict_texts_distilbert(classifier, text)
    emotions = analyze_emotion(emotion_classifier, text)
    credibility = compute_credibility_score(distilbert_label, distilbert_score, emotions)
    emotion_dict = {e["label"]: e["score"] for e in emotions}
    # how much each word's embedding influenced the model's logit for the predicted class. 
    # Pure classification sensitivity. 
    # Higher = that word pushed the model harder toward "Fake" (or "Real"). 
    # No relation to emotion (that's DistilRoBERTa's separate output).
    top_words = get_top_words(classifier, text, distilbert_label, top_k=request.top_k)

    return {
        "text": text,
        "classification": {
            "label": distilbert_label,
            "confidence": distilbert_score
        },
        "emotions": emotion_dict,
        "credibility_score": credibility,
        "top_words": top_words
    }