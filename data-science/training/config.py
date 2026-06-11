# ============================================================
#  config.py — Paths, constants, and parameters
# ============================================================

# TRUE/REAL NEWS ----> 1
# FALSE/FAKE NEWS ---->0

# Dataset paths
ISOT_DATASET_PATH = "./data/datasets/isot_dataset.csv"
LIAR_DATASET_PATH = "./data/datasets/liar_dataset.csv"
FULL_DATASET_PATH = "./data/datasets/full_dataset.csv"
PREPROCESSED_DATASET_PATH = "./data/datasets/preprocessed_dataset.csv"

# Random state for reproducibility
RANDOM_STATE = 42

# Train/test split ---
TEST_SIZE = 0.2

# Optimal TF-IDF parameters (from optimize.py)
TFIDF_PARAMS = {
    "max_df": 0.8,
    "max_features": 50000,
    "min_df": 1,
    "ngram_range": (1, 2),
    "sublinear_tf": True,
    "stop_words": ["the"],
}

# Best model parameters (from optimize.py)
BEST_C = 10.0