# ============================================================
#  optimize.py — Hyperparameter optimization (Steps 1-3)
#
#  Run this script to find optimal parameters.
#  Results are used in main.py for training and prediction.
# ============================================================

from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB

from config import RANDOM_STATE
from data_loader import get_preprocessed_data
from model_training import compare_models, optimize_tfidf


if __name__ == "__main__":

    # Load data
    df = get_preprocessed_data()
    df = df.sample(frac=1, random_state=RANDOM_STATE).reset_index(drop=True)


    # STEP 1 — Optimize TfidfVectorizer on Logistic Regression
    print("\n>> STEP 1 — Optimizing TF-IDF hyperparameters")
    tfidf_param_grid = {
        "tfidf__ngram_range": [(1, 1), (1, 2)],
        "tfidf__max_df": [0.7, 0.8, 0.9, 1.0],
        "tfidf__min_df": [1, 2, 3, 5],
        "tfidf__sublinear_tf": [True, False],
        "tfidf__max_features": [None, 50000, 100000],
    }
    best_params, best_score = optimize_tfidf(
        df, LogisticRegression(random_state=RANDOM_STATE), tfidf_param_grid
    )

    # Extract TF-IDF params only (remove "tfidf__" prefix)
    tfidf_params = {
        k.replace("tfidf__", ""): v 
        for k, v in best_params.items() 
        if k.startswith("tfidf__")
    }
    print(f"\n  Optimized TF-IDF params: {tfidf_params}")


    # STEP 2 - Compare models with optimized TF-IDF
    print("\n>> STEP 2 — Comparing models (cross-validation)")
    models = {
        "Logistic Regression": LogisticRegression(random_state=RANDOM_STATE),
        "SVM": LinearSVC(random_state=RANDOM_STATE),
        "Naive Bayes": MultinomialNB()
    }
    results = compare_models(df, models, tfidf_params)


    # STEP 3 - Optimize C/alpha on each model
    print("\n>> STEP 3 — Optimizing per-model parameters")

    # Fix TF-IDF params for all model optimizations
    fixed_tfidf = {f"tfidf__{k}": [v] for k, v in tfidf_params.items()}

    model_param_grids = {
        "Logistic Regression": {
            "model": LogisticRegression(random_state=RANDOM_STATE),
            "params": {**fixed_tfidf, "model__C": [0.01, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 20.0, 50.0, 100.0]}
        },
        "SVM": {
            "model": LinearSVC(random_state=RANDOM_STATE),
            "params": {**fixed_tfidf, "model__C": [0.01, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 20.0, 50.0, 100.0]}
        },
        "Naive Bayes": {
            "model": MultinomialNB(),
            "params": {**fixed_tfidf, "model__alpha": [0.01, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 20.0, 50.0, 100.0]}
        }
    }

    for name, config in model_param_grids.items():
        print(f"\n  --- {name} ---")
        best_p, best_s = optimize_tfidf(df, config["model"], config["params"])