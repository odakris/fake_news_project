from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from transformers import pipeline

from api_predict import predict_texts_distilbert, analyze_emotion, compute_credibility_score#, get_top_words

class TextRequest(BaseModel):
    text: str
    top_k: int = Field(default=10, ge=1, le=10)

app = FastAPI()

classifier = pipeline("text-classification", model="./models/distilbert", tokenizer="./models/distilbert")
emotion_classifier = pipeline("text-classification", model="./models/emotion", tokenizer="./models/emotion", top_k=None, device=-1, truncation=True)

@app.post("/fakenews/verify")
def verify(body: TextRequest):
    """Analyse un texte pour détecter les fake news.
    
    Args:
        body: corps de la requête contenant le texte à analyser
    
    Returns:
        dict: classification DistilBERT (label + confidence), 
            analyse émotionnelle (7 émotions),
            score de crédibilité final (0 à 1)
    """
    # Create safe parsing of the request body
    try:
        text = body.text
        top_k = body.top_k
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request body: {e}")

    distilbert_label, distilbert_score = predict_texts_distilbert(classifier, text)
    emotions = analyze_emotion(emotion_classifier, text)
    credibility = compute_credibility_score(distilbert_label, distilbert_score, emotions)
    emotion_dict = {e["label"]: e["score"] for e in emotions}
    # how much each word's embedding influenced the model's logit for the predicted class. 
    # Pure classification sensitivity. 
    # Higher = that word pushed the model harder toward "Fake" (or "Real"). 
    # No relation to emotion (that's DistilRoBERTa's separate output).
    # top_words = get_top_words(classifier, text, distilbert_label, top_k=top_k)

    return {
        "text": text,
        "classification": {
            "label": distilbert_label,
            "confidence": distilbert_score
        },
        "emotions": emotion_dict,
        "credibility_score": credibility,
        "top_words": []
    }