from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from transformers import pipeline
from training.preprocessing import clean_text

from predict import predict_texts_distilbert, analyze_emotion, compute_credibility_score, get_top_words

class TextRequest(BaseModel):
    text: str
    top_k: int = Field(default=10, ge=1, le=10)

app = FastAPI()

# A text-only model cannot judge a claim that carries no signal. Two guards:
#  - too few words  -> not enough text to say anything (greetings, fragments).
#  - low confidence -> after de-confounding length in training, a neutral
#    one-liner ("Macron arrived in Paris") lands near 0.5; the model is guessing.
# In both cases we return "Uncertain" instead of asserting Fake/Real.
MIN_WORDS = 5            # below this, ignore the prediction (not enough text)
CONFIDENCE_FLOOR = 0.60  # below this, the model is too unsure to commit

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

    # Strip source tells (Reuters byline, datelines, URLs...) so the input matches
    # what DistilBERT was trained on (see notebooks/fake_news.ipynb de-leaking cell).
    # Emotion stays on the RAW text - it wants the "!" and sensational punctuation.
    cleaned = clean_text(text)

    distilbert_label, distilbert_score = predict_texts_distilbert(classifier, cleaned)

    # Don't report a prediction the model can't actually back up.
    word_count = len(cleaned.split())
    if word_count < MIN_WORDS:
        final_label, reason = "Uncertain", "insufficient_text"
    elif distilbert_score < CONFIDENCE_FLOOR:
        final_label, reason = "Uncertain", "low_confidence"
    else:
        final_label, reason = distilbert_label, None

    emotions = analyze_emotion(emotion_classifier, text)
    credibility = compute_credibility_score(final_label, distilbert_score, emotions)
    emotion_dict = {e["label"]: e["score"] for e in emotions}
    # how much each word's embedding influenced the model's logit for the predicted class.
    # Pure classification sensitivity.
    # Higher = that word pushed the model harder toward "Fake" (or "Real").
    # No relation to emotion (that's DistilRoBERTa's separate output).
    top_words = get_top_words(classifier, cleaned, distilbert_label, top_k=top_k)

    classification = {
        "label": final_label,
        "confidence": distilbert_score,
        # what the raw model said, before the guards
        "model_label": distilbert_label,
    }
    if reason:
        classification["reason"] = reason

    return {
        "text": text,
        "classification": classification,
        "emotions": emotion_dict,
        "credibility_score": credibility,
        "top_words": top_words
    }