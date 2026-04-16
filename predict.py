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
    return emotion_classifier(text)[0]
            