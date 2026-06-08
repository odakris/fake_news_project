# ============================================================
#  predict.py — Prediction on new texts
# ============================================================

from preprocessing import clean_text, nlp, lemmatize
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from transformers import pipeline

def predict_text_baseline(model: object, vectorizer: object, text: str):
    """Make a prediction on a given text.
    
    Applies the same preprocessing pipeline as training:
    clean_text → spaCy tokenization → lemmatization → TF-IDF → prediction
    
    Returns:
        label (int): 0 = FAKE, 1 = REAL
        proba (array): [probability_fake, probability_real]
    """
    # Apply the same pipeline as training
    cleaned = clean_text(text)
    doc = nlp(cleaned)
    lemmatized = lemmatize(doc, verbose=False)
    tfidf = vectorizer.transform([lemmatized])

    label = model.predict(tfidf)[0]

    # predict_proba is not available for all models (e.g. LinearSVC)
    proba = None
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(tfidf)[0]

    return label, proba


def predict_texts_distilbert(classifier: pipeline, text: str):
    """Predict using DistilBERT model (from Hugging Face).
    No preprocessing needed — the tokenizer handles everything.
    
    Args:
        classifier: Hugging Face pipeline object
        text: raw text string
    
    Returns:
        label (str): "Fake" or "Real"
        proba (float): confidence score
    """

    result = classifier(text)
    label = result[0]['label']  # "Fake" or "Real"
    proba = result[0]['score']  # confidence score for the predicted label

    return label, proba


def analyze_sentiment(sia: SentimentIntensityAnalyzer, text: str):
    """Analyze sentiment using VADER (from NLTK).
    
    Args:
        sia: SentimentIntensityAnalyzer object
        text: raw text string
    
    Returns:
        scores (dict): dictionary with 'neg', 'neu', 'pos', and 'compound' scores
    """

    scores = sia.polarity_scores(text)
    return scores


def analyze_emotion(emotion_classifier, text):
    """Analyze emotions using DistilRoBERTa (j-hartmann).
    
    Args:
        emotion_classifier: Hugging Face pipeline object
        text: raw text string
    
    Returns:
        list: scores for each emotion (anger, disgust, fear, joy, neutral, sadness, surprise)
    """
    return emotion_classifier(text, truncation=True, max_length=512)[0]


def compute_credibility_score(distilbert_label, distilbert_score, emotions):
    """Calcule un score de crédibilité entre 0 et 1.

    - distilbert_label: "Fake" or "Real"
    - distilbert_score: confiance du modèle (0 à 1)
    - emotions: listes des émotions [{'label': 'anger', 'score': 0.45}, ...]
    """

    # Score de base : Probabilité "REAL"
    if distilbert_label == "Real":
        base_score = distilbert_score
    else:
        base_score = 1 - distilbert_score

    # Récupération des scores des émotions suspectes
    emotion_dict = {e["label"]: e["score"] for e in emotions}
    suprise = emotion_dict.get("surprise", 0)
    anger = emotion_dict.get("anger", 0)
    disgust = emotion_dict.get("disgust", 0)

    # Pénalité émotionnelle (moyenne)
    penatlty = (suprise + anger + disgust) / 3

    # Score final
    credibility_score = base_score * (1 - penatlty)

    return round(credibility_score, 3)
