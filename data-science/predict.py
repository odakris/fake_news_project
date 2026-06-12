# ============================================================
#  predict.py — Prediction on new texts
# ============================================================

from torch import no_grad, enable_grad, full_like
from preprocessing import clean_text, nlp, lemmatize
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from transformers import pipeline

_STOPWORDS = set(stopwords.words('english'))

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

# how much each word's embedding influenced the model's logit for the predicted class. 
# Pure classification sensitivity. 
# Higher = that word pushed the model harder toward "Fake" (or "Real"). 
# No relation to emotion (that's DistilRoBERTa's separate output).
def get_top_words(classifier_pipeline, text: str, label: str, top_k: int = 10):
    """Get top words driving the classification using gradient attribution (PAD baseline).

    Computes grad * (input - PAD_baseline), L2 norm per token.
    PAD baseline removes token-frequency bias from zero-vector baseline.
    Higher score = token pushed model harder toward the predicted label.

    Args:
        classifier_pipeline: Hugging Face pipeline (text-classification)
        text: raw input text
        label: predicted label ("Fake" or "Real")
        top_k: number of top words to return

    Returns:
        list of dicts: [{"word": str, "score": float}] sorted by importance desc
    """
    model = classifier_pipeline.model
    tokenizer = classifier_pipeline.tokenizer
    target_idx = model.config.label2id.get(label, 0)

    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])

    model.eval()

    with no_grad():
        actual = model.distilbert.embeddings(inputs["input_ids"]).detach()
        pad_ids = full_like(inputs["input_ids"], tokenizer.pad_token_id)
        baseline = model.distilbert.embeddings(pad_ids).detach()

    with enable_grad():
        interp = actual.requires_grad_(True)
        model.zero_grad()
        model(inputs_embeds=interp, attention_mask=inputs.get("attention_mask")).logits[0, target_idx].backward()

    # grad * (input - baseline), L2 norm per token
    attr_norms = (interp.grad * (actual - baseline))[0].norm(dim=-1)

    # Merge WordPiece subwords (## prefix) back to full words; skip [CLS] and [SEP]
    words, scores = [], []
    current_word, current_score = "", 0.0

    for token, score in zip(tokens[1:-1], attr_norms[1:-1].tolist()):
        if token.startswith("##"):
            current_word += token[2:]
            current_score = max(current_score, score)
        else:
            if current_word:
                words.append(current_word)
                scores.append(current_score)
            current_word, current_score = token, score

    if current_word:
        words.append(current_word)
        scores.append(current_score)

    if not scores:
        return []

    max_score = max(scores)
    ranked = sorted(zip(words, scores), key=lambda x: x[1], reverse=True)
    # drop stopwords; drop pure structural punctuation (,.:;) but keep ! and ? (meaningful signals)
    ranked = [
        (w, s) for w, s in ranked
        if w not in _STOPWORDS and (any(c.isalnum() for c in w) or w in {"!", "?"})
    ]
    return [{"word": w, "score": round(s / max_score, 4)} for w, s in ranked[:top_k]]


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
    credibility_score = base_score #* (1 - penatlty)

    return round(credibility_score, 3)
