# ============================================================
#  data_loader.py — Loading, merging, and caching datasets
# ============================================================

import pandas as pd
import time
from config import (
    ISOT_DATASET_PATH, LIAR_DATASET_PATH,
    FULL_DATASET_PATH, PREPROCESSED_DATASET_PATH, RANDOM_STATE
)
from preprocessing import preprocess


def get_preprocessed_data():
    """Main entry point: returns a clean, preprocessed DataFrame ready for training."""

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
    """Merge raw datasets (ISOT + LIAR) together."""

    print("\n>> Merging raw datasets (ISOT + LIAR)...")

    # Load datasets
    isot_dataset = pd.read_csv(ISOT_DATASET_PATH)
    print(f"   ISOT loaded : {len(isot_dataset):,} rows")
    liar_dataset = pd.read_csv(LIAR_DATASET_PATH)
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

    # Shuffle to avoid fold contamination in cross-validation
    # (ISOT and LIAR would otherwise be sequential, causing high variance between folds)
    full_dataset_df = full_dataset_df.sample(frac=1, random_state=RANDOM_STATE).reset_index(drop=True)
    
    # Save merged dataset
    full_dataset_df.to_csv(FULL_DATASET_PATH, index=False)
    print(f"   Merged dataset saved to {FULL_DATASET_PATH}  ({len(full_dataset_df):,} rows)")
    return full_dataset_df


def load_or_merge_full_dataset():
    """Load merged dataset or merge raw datasets together."""
    try:
        print("\n>> Loading merged dataset...")
        df = pd.read_csv(FULL_DATASET_PATH)
        print(f"   Merged dataset loaded from {FULL_DATASET_PATH}  ({len(df):,} rows)")
    except FileNotFoundError:
        print("   [INFO] Merged dataset not found. Merging now...")
        df = merge_datasets()
    return df


def load_or_preprocess_data(full_df):
    """Load preprocessed dataframe or apply preprocessing to merged dataset."""
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