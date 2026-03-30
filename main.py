# ============================================================
#  main.py — Training final model & predictions
#
#  Optimal parameters found by optimize.py:
#  - TF-IDF: max_df=0.8, max_features=50000, min_df=1, ngram_range=(1,2), sublinear_tf=True
#  - Best model: Logistic Regression (C=10.0) → F1 = 0.8997
#  - SVM (C=0.5) → F1 = 0.8991
#  - Naive Bayes (alpha=0.01) → F1 = 0.8723
# ============================================================
import joblib
import os
from sklearn.linear_model import LogisticRegression

from config import RANDOM_STATE
from data_loader import get_preprocessed_data
from model_training import split_and_vectorize, train_and_evaluate, print_top_words
from predict import predict_text


# ── Optimal parameters (from optimize.py) ──
TFIDF_PARAMS = {
    "max_df": 0.8,
    "max_features": 50000,
    "min_df": 1,
    "ngram_range": (1, 2),
    "sublinear_tf": True,
    "stop_words": ["the"],
}
BEST_C = 10.0


if __name__ == "__main__":

    # Load data
    df = get_preprocessed_data()
    df = df.sample(frac=1, random_state=RANDOM_STATE).reset_index(drop=True)

    # Train final model
    print("\n>> Training final model (Logistic Regression, C={})".format(BEST_C))
    X_train, X_test, y_train, y_test, vectorizer = split_and_vectorize(df, TFIDF_PARAMS)

    model = train_and_evaluate(
        LogisticRegression(C=BEST_C, random_state=RANDOM_STATE),
        X_train, X_test, y_train, y_test
    )
    print_top_words(model, vectorizer)

    # Test predictions
    print("\n>> Testing predictions")
    
    # Texte court et neutre — peu de signal, le modèle devrait hésiter
    test_short = "The government has announced a new policy to combat climate change."
    label, proba = predict_text(model, vectorizer, test_short)
    print(f"\n  Short text:  label={label}  proba={proba}")

    # Texte style journalistique — devrait être classé real
    test_real = "The spokesman for the ministry issued a statement saying the government would seek to address the allegations raised by the parliamentary committee investigating the matter."
    label, proba = predict_text(model, vectorizer, test_real)
    print(f"  Real style:  label={label}  proba={proba}")

    # Texte style blog/opinion — devrait être classé fake
    test_fake = "You won't believe what this racist politician just revealed about his secret scheme. Watch the video and share this story before they try to hide the truth from liberal America."
    label, proba = predict_text(model, vectorizer, test_fake)
    print(f"  Fake style:  label={label}  proba={proba}")

    os.makedirs("./models", exist_ok=True)
    joblib.dump(model, "./models/logistic_regression.pkl")
    joblib.dump(vectorizer, "./models/tfidf_vectorizer.pkl")
    print("\n>> Model and vectorizer saved to ./models/")