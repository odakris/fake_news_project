# ============================================================
#  predict.py — Prediction on new texts
# ============================================================

from preprocessing import clean_text, nlp, lemmatize


def predict_text(model, vectorizer, text):
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
    # In that case, return None for proba
    proba = None
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(tfidf)[0]

    return label, proba