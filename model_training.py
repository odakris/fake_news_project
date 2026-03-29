# ============================================================
#  model_training.py — Training, optimization, and evaluation
# ============================================================

from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from config import RANDOM_STATE, TEST_SIZE


# --- Optimization ---

def optimize_tfidf(df, model, param_grid):
    """Find optimal TfidfVectorizer (and optionally model) parameters using GridSearchCV.
    
    Uses Pipeline + GridSearchCV with cv=5 to avoid data leakage:
    fit_transform is applied only on the training fold of each split.
    """
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer()),
        ("model", model)
    ])
    grid = GridSearchCV(pipeline, param_grid, cv=5, scoring="f1_weighted", n_jobs=-1, verbose=1)
    grid.fit(df["lemmatized_text"], df["label"])
    print(f"  Best params: {grid.best_params_}")
    print(f"  Best F1: {grid.best_score_:.4f}")
    return grid.best_params_, grid.best_score_


# --- Comparison ---

def compare_models(df, models, tfidf_params):
    """Compare multiple models using cross-validation with optimized TF-IDF params.
    
    Each model is evaluated with 5-fold cross-validation using the same
    TF-IDF configuration. This ensures a fair comparison.
    """
    results = {}
    for name, model in models.items():
        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(**tfidf_params)),
            ("model", model)
        ])
        scores = cross_val_score(pipeline, df["lemmatized_text"], df["label"], cv=5, scoring="f1_weighted")
        results[name] = {"mean": scores.mean(), "std": scores.std()}
        print(f"  {name}: {scores.mean():.4f} (+/- {scores.std():.4f})")
    return results


# --- Training ---

def split_and_vectorize(df, tfidf_params):
    """Split data and vectorize using TF-IDF parameters.
    
    fit_transform on train only, transform on test only — prevents data leakage.
    """
    X_train, X_test, y_train, y_test = train_test_split(
        df["lemmatized_text"], 
        df["label"], 
        test_size=TEST_SIZE, 
        random_state=RANDOM_STATE, 
        stratify=df["label"])

    vectorizer = TfidfVectorizer(**tfidf_params)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    return X_train_tfidf, X_test_tfidf, y_train, y_test, vectorizer


def train_and_evaluate(model, X_train, X_test, y_train, y_test):
    """Train a model and print evaluation metrics."""
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))
    return model


# --- Analysis ---

def print_top_words(model, vectorizer, num_top_words=15):
    """Print the top predictive words for fake and real news."""
    feature_names = vectorizer.get_feature_names_out()
    coefs = model.coef_[0]

    top_fake_words = coefs.argsort()[:num_top_words]
    print(f"Top {num_top_words} words indicative of FAKE news (label 0):")
    for idx in top_fake_words:
        print(f"  {feature_names[idx]}: {coefs[idx]:.4f}")

    top_real_words = coefs.argsort()[-num_top_words:][::-1] # [::-1] --> pour inverser sens de la liste (du plus fort au plus faible)
    print(f"Top {num_top_words} words indicative of REAL news (label 1):")
    for idx in top_real_words:
        print(f"  {feature_names[idx]}: {coefs[idx]:.4f}")