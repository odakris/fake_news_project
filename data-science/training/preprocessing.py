# ============================================================
#  preprocessing.py — NLP text cleaning and lemmatization
# ============================================================

import spacy
import re
import time
import collections
import pandas as pd

# Load the English model with only the tagger component for lemmatization
nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])  

def clean_text(text):
    """Cleans the input text by removing URLs, mentions, and irrelevant patterns."""
    # Normalize curly/smart quotes to standard apostrophes
    # Normalize apostrophes
    text = text.replace("\u2019", "'")  # ' → ' (70,279 occurrences — main issue)
    text = text.replace("\u2018", "'")  # ' → ' (1,183 occurrences)
    # Normalize double quotes
    text = text.replace("\u201C", '"')  # " → " (53,766)
    text = text.replace("\u201D", '"')  # " → " (53,489)
    # Normalize dashes
    text = text.replace("\u2013", "-")  # – → - (714)
    text = text.replace("\u2014", "-")  # — → - (500)
    # Normalize spaces and other
    text = text.replace("\u00A0", " ")  # non-breaking space (5,251)
    text = text.replace("\u2026", "...")  # … → ... (74)
    # Remove source signatures at the start: "WASHINGTON (Reuters) -"
    text = re.sub(r'^[A-Z\s/,]+ \([A-Za-z\s]+\)\s*[-–—]\s*', '', text)
    # Remove photo attributions
    text = re.sub(r'(?i)(photo|image|featured? image|featured? sketch)\s*(by|via|courtesy of)\s*.{0,80}', '', text)
    # Remove call-to-action patterns
    text = re.sub(r'(?i)(read more|watch .{0,20}video|click here|subscribe|share this|sign up).*', '', text)
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+|\S+\.\w{2,}/\S*', '', text)
    # Remove mentions
    text = re.sub(r'@\w+', ' ', text)
    # Remove numbers (including decimals and currency)
    text = re.sub(r'[\$€£]?\d[\d,.]*', '', text)
    # Normalize spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text


SKIP_TOKENS = {"didn", "isn", "doesn", "wasn", "aren", "wouldn", "couldn", "shouldn", "hasn", "haven", "weren", "don", "won", "ain", "the", "not"}

def lemmatize(doc, row_num=0, total=1, verbose=True):
    """Lemmatizes the input text and removes stop words, punctuation, and extra whitespace."""
    if verbose and row_num % 1000 == 0:
        pct = round(row_num / total * 100)
        print(f"   {pct:>3}%  —  row {row_num:,}/{total:,}", flush=True)

    tokens = [
        token.lemma_.lower()
        for token in doc
        if not token.is_stop
            and not token.is_punct
            and not token.is_space
            and token.pos_ not in ["PROPN", "NUM", "SYM", "X"]
            and len(token.lemma_) > 2
            and token.lemma_.lower() not in SKIP_TOKENS
            and token.text.lower() not in SKIP_TOKENS
    ]

    return " ".join(tokens)


def preprocess(df):
    """Preprocesses the text data by cleaning and lemmatizing it."""
    
    start_total = time.time()
    initial_rows = len(df)
    df = df.copy()
    
    print("\n" + "=" * 60)
    print("           PREPROCESSING PIPELINE")
    print("=" * 60)

    # STEP 1 : TEXT CLEANING
    print("\n>> Step 1/3 — Cleaning text...")
    step_start = time.time()
    df = df.dropna(subset=["text"])  # Drop rows where text is NaN
    df = df[df["text"].str.strip().astype(bool)]  # Drop rows where text is empty or whitespace-only
    df["cleaned_text"] = df["text"].apply(clean_text)
    df = df[df["cleaned_text"].str.strip().astype(bool)].reset_index(drop=True)  # Drop rows where cleaned text is empty
    rows_after_clean = len(df)
    dropped = initial_rows - rows_after_clean
    print(f"   Cleaning done in {time.time() - step_start:.1f}s")
    print(f"   Rows dropped (empty/NaN): {dropped:,}  —  remaining: {rows_after_clean:,}")

    # STEP 2 : LEMMATIZATION
    print("\n>> Step 2/3 — Lemmatization (spaCy)...")
    step_start = time.time()
    processed_texts = []
    try:
        #for i, doc in enumerate(nlp.pipe(df["cleaned_text"], batch_size=1000)):
        total = len(df)
        for i, doc in enumerate(nlp.pipe(df["cleaned_text"], batch_size=1000)):
            lemmatized_text = lemmatize(doc, i, total)
            processed_texts.append(lemmatized_text)
            # df["text"] = df.apply(lambda row: lemmatize(next(doc), row.name), axis=1)
    except Exception as e:
        print(f"   [ERROR] Error during lemmatization: {e}")
    
    print(f"   100%  —  {total:,}/{total:,}")
    print(f"   Lemmatization done in {time.time() - step_start:.1f}s")

    # STEP 3 : FINALIZING DATASET
    print("\n>> Step 3/3 — Finalizing dataset...")
    df["lemmatized_text"] = processed_texts
    df = df.dropna()
    # Drop the residual index column from the CSV
    df = df[df["lemmatized_text"].str.strip().astype(bool)]
    df.drop(columns=df.columns[0], inplace=True)

    total_time = time.time() - start_total
    print("-" * 60)
    print(f"   Preprocessing completed in {total_time:.1f}s")
    print(f"   Final rows: {len(df):,}  (total dropped: {initial_rows - len(df):,})")
    print("=" * 60 + "\n")
    
    return df