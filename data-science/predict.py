# ============================================================
#  predict.py — Prediction on new texts
# ============================================================

# from torch import enable_grad
from transformers import pipeline


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
    #penatlty = (suprise + anger + disgust) / 3
    penatlty = 0

    # Score final
    credibility_score = base_score * (1 - penatlty)

    return round(credibility_score, 3)

# how much each word's embedding influenced the model's logit for the predicted class. 
# Pure classification sensitivity. 
# Higher = that word pushed the model harder toward "Fake" (or "Real"). 
# No relation to emotion (that's DistilRoBERTa's separate output).
# def get_top_words(classifier_pipeline, text: str, label: str, top_k: int = 10):
#     """Get top words driving the classification using gradient-based attribution.

#     Computes L2 norm of input-embedding gradients w.r.t. the predicted class logit.
#     Higher score = token pushed the model harder toward the predicted label.

#     Args:
#         classifier_pipeline: Hugging Face pipeline (text-classification)
#         text: raw input text
#         label: predicted label ("Fake" or "Real")
#         top_k: number of top words to return

#     Returns:
#         list of dicts: [{"word": str, "score": float}] sorted by importance desc
#     """
#     model = classifier_pipeline.model
#     tokenizer = classifier_pipeline.tokenizer

#     target_idx = model.config.label2id.get(label, 0)

#     inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
#     tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])

#     model.eval()

#     with enable_grad():
#         embedding_output = model.distilbert.embeddings(inputs["input_ids"])
#         embedding_output.retain_grad()

#         outputs = model(
#             inputs_embeds=embedding_output,
#             attention_mask=inputs.get("attention_mask"),
#         )
#         model.zero_grad()
#         outputs.logits[0, target_idx].backward()

#     grad_norms = embedding_output.grad[0].norm(dim=-1)  # [seq_len]

#     # Merge WordPiece subwords (## prefix) back to full words; skip [CLS] and [SEP]
#     words, scores = [], []
#     current_word, current_score = "", 0.0

#     for token, score in zip(tokens[1:-1], grad_norms[1:-1].tolist()):
#         if token.startswith("##"):
#             current_word += token[2:]
#             current_score = max(current_score, score)
#         else:
#             if current_word:
#                 words.append(current_word)
#                 scores.append(current_score)
#             current_word = token
#             current_score = score

#     if current_word:
#         words.append(current_word)
#         scores.append(current_score)

#     if not scores:
#         return []

#     max_score = max(scores)
#     normalized = [round(s / max_score, 4) for s in scores]

#     # Drop punctuation-only tokens — no alpha char = not useful for highlighting
#     word_scores = [
#         (w, s) for w, s in sorted(zip(words, normalized), key=lambda x: x[1], reverse=True)
#         if any(c.isalpha() for c in w)
#     ]
#     return [{"word": w, "score": s} for w, s in word_scores[:top_k]]

