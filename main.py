import pandas as pd
import time

from sklearn.model_selection import cross_val_score
from model_training import split_and_vectorize, train_and_evaluate
from preprocessing import preprocess, nlp, lemmatize, clean_text
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer

# TRUE/REAL NEWS ----> 1
# FALSE/FAKE NEWS ---->0

# 1 - Charger full datasets ou le creer
# 2 - Charger les datas préprocessed ou les proprocessed

FULL_DATASET_PATH = "./data/datasets/full_dataset.csv"
PREPROCESSED_DATASET_PATH = "./data/datasets/preprocessed_dataset.csv"

def get_preprocessed_data():

    print("\n" + "#" * 60)
    print("        FAKE NEWS DETECTION — PIPELINE")
    print("#" * 60)
    start = time.time()

    try:
        # Try to load preprocessed data first
        print("\n>> Loading preprocessed data...")
        preprocess_df = pd.read_csv(PREPROCESSED_DATASET_PATH)
        print(f"   Preprocessed data loaded from {PREPROCESSED_DATASET_PATH}")
        print(f"   Shape: {preprocess_df.shape[0]:,} rows x {preprocess_df.shape[1]} columns")
        
    except FileNotFoundError:
        # If preprocessed data is not found, load or merge full dataset and preprocess it
        print("   [INFO] Preprocessed file not found. Starting full pipeline...")
        full_df = load_or_merge_full_dataset()
        print(f"   Label distribution:\n{full_df['label'].value_counts().to_string()}")
        preprocess_df = load_or_preprocess_data(full_df)

    #  Drop rows where lemmatized text is NaN, empty or whitespace-only
    preprocess_df = preprocess_df.dropna(subset=["lemmatized_text"])
    preprocess_df = preprocess_df[preprocess_df["lemmatized_text"].str.strip().astype(bool)]

    print(f"   After dropping empty lemmatized text: {preprocess_df.shape[0]:,} rows")
    print(f"   Final label distribution:\n{preprocess_df['label'].value_counts().to_string()}")

    print("\n" + "-" * 60)
    print(f"   Dataset ready — {preprocess_df.shape[0]:,} rows x {preprocess_df.shape[1]} columns")
    print(f"   Total time: {time.time() - start:.1f}s")
    print("-" * 60)

    return preprocess_df


def merge_datasets():
    """Merge raw datasets together"""

    print("\n>> Merging raw datasets (ISOT + LIAR)...")

    # Load datasets
    isot_dataset = pd.read_csv("./data/datasets/isot_dataset.csv")
    print(f"   ISOT loaded : {len(isot_dataset):,} rows")
    liar_dataset = pd.read_csv("./data/datasets/liar_dataset.csv")
    print(f"   LIAR loaded : {len(liar_dataset):,} rows")

    # Concat Datasets together
    full_dataset_df = pd.concat([isot_dataset, liar_dataset], ignore_index=True)
    print(f"   Total after concat: {len(full_dataset_df):,} rows")
    
    # Drop rows where text is empty or whitespace-only
    full_dataset_df = full_dataset_df[full_dataset_df["text"].str.strip().astype(bool)]
    full_dataset_df = full_dataset_df.reset_index(drop=True)
    before_dedup = len(full_dataset_df)
    full_dataset_df = full_dataset_df.drop_duplicates(subset=["text"]).reset_index(drop=True)
    print(f"   Duplicates removed: {before_dedup - len(full_dataset_df):,} rows")

    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Save merged dataset
    full_dataset_df.to_csv("./data/datasets/full_dataset.csv", index=False)
    print(f"   Merged dataset saved to {FULL_DATASET_PATH}  ({len(full_dataset_df):,} rows)")
    return full_dataset_df


def load_or_merge_full_dataset():
    """Load merged dataset or merge raw datasets together"""
    try:
        print("\n>> Loading merged dataset...")
        df = pd.read_csv(FULL_DATASET_PATH)
        print(f"   Merged dataset loaded from {FULL_DATASET_PATH}  ({len(df):,} rows)")
    except FileNotFoundError:
        print("   [INFO] Merged dataset not found. Merging now...")
        df = merge_datasets()
    return df


def load_or_preprocess_data(full_df):
    """Load preprocess dataframe or apply preprocessing to merged dataset"""
    try:
        print("\n>> Loading preprocessed data...")
        df = pd.read_csv(PREPROCESSED_DATASET_PATH)
        print(f"   Preprocessed data loaded ({len(df):,} rows)")
    except FileNotFoundError:
        print("   [INFO] Preprocessed data not found. Starting preprocessing...")
        df = preprocess(full_df)
        df.to_csv(PREPROCESSED_DATASET_PATH, index=False)
        print(f"   Preprocessed data saved to {PREPROCESSED_DATASET_PATH}")
    return df


def prediction(model, vectorizer, text):
    """Make a prediction on a given text."""
    cleaned = clean_text(text)
    doc = nlp(cleaned)
    lemmatized = lemmatize(doc, verbose=False)
    tfidf = vectorizer.transform([lemmatized])
    return model.predict(tfidf)[0], model.predict_proba(tfidf)[0]


if __name__ == "__main__":
    
    # GET DATA
    # try:
    #     df = pd.read_csv(PREPROCESSED_DATASET_PATH)
    # except FileNotFoundError:
    #     df = get_preprocessed_data()
    df = get_preprocessed_data()
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    models = {
        "Logistic Regression": LogisticRegression(random_state=42),
        "SVM": LinearSVC(random_state=42),
        "Naive Bayes": MultinomialNB()
    }

    for name, model in models.items():
        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
            ("model", model)
        ])

        scores = cross_val_score(pipeline, df["lemmatized_text"], df["label"], cv=5, scoring="f1_weighted")
        print(f"{name}: {scores.mean():.4f} (+/- {scores.std():.4f})")

    # # SPLIT DATA
    # X_train, X_test, y_train, y_test, vectorizer = split_and_vectorize(df, ngram_range=(1, 2))

    # # LOGISTIC REGRESSION
    # log_reg_model = LogisticRegression(random_state=42)
    # log_reg = train_and_evaluate(log_reg_model, X_train, X_test, y_train, y_test)

    # # SVM
    # SVM_model = LinearSVC(random_state=42)
    # svm = train_and_evaluate(SVM_model, X_train, X_test, y_train, y_test)

    # # NAIVE BAYES
    # naive_bayes_model = MultinomialNB()
    # naive_bayes = train_and_evaluate(naive_bayes_model, X_train, X_test, y_train, y_test)

    # text_to_predict = "The government has announced a new policy to combat climate change."
    # pred_label, pred_proba = prediction(log_reg, vectorizer, text_to_predict)
    # print(f"\nPrediction for test text: {pred_label} / {pred_proba} %  (0 = FAKE, 1 = REAL)")

    # # Un texte style journalistique
    # real_test = "The spokesman for the ministry issued a statement saying the government would seek to address the allegations raised by the parliamentary committee investigating the matter."

    # # Un texte style blog/opinion
    # fake_test = "You won't believe what this racist politician just revealed about his secret scheme. Watch the video and share this story before they try to hide the truth from liberal America."

    # pred_label, pred_proba = prediction(model, vectorizer, real_test)
    # print(f"Real style: {pred_label} / {pred_proba}")
    # pred_label, pred_proba = prediction(model, vectorizer, fake_test)
    # print(f"Fake style: {pred_label} / {pred_proba}")