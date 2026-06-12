# ============================================================
#  baseline_predict.py — Baseline (TF-IDF) prediction + sentiment helpers
# ============================================================

from training.preprocessing import clean_text, nlp, lemmatize
from nltk.sentiment.vader import SentimentIntensityAnalyzer

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