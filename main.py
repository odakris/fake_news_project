import pandas as pd
from model_training import train_model
from preprocessing import preprocess

# TRUE/REAL NEWS ----> 1
# FALSE/FAKE NEWS ---->0

# 1 - Charger full datasets ou le creer
# 2 - Charger les datas préprocessed ou les proprocessed

FULL_DATASET_PATH = "./data/datasets/full_dataset.csv"
PREPROCESSED_DATASET_PATH = "./data/datasets/preprocessed_dataset.csv"


def main():

    try:
        # Try to load preprocessed data first
        preprocess_df = pd.read_csv(PREPROCESSED_DATASET_PATH)
        print("Preprocessed data loaded successfully!\n")
        
    except FileNotFoundError:
        # If preprocessed data is not found, load or merge full dataset and preprocess it
        print("Preprocessed data not found. Building pipeline...\n")
        full_df = load_or_merge_full_dataset()
        print(f"full_df value counts: {full_df['label'].value_counts()}")
   
        # Preprocess the full dataset and save it to a new CSV file    
        preprocess_df = preprocess(full_df)
        preprocess_df.to_csv(PREPROCESSED_DATASET_PATH, index=False)
        print(f"Preprocessed data saved saved to {PREPROCESSED_DATASET_PATH}\n")

    #     # Check for nulls and empty strings in the relevant columns
    #     print("text nulls:", preprocess_df['text'].isnull().sum())
    #     print("lemmatized text nulls:", preprocess_df["lemmatized_text"].isnull().sum())
    #     print("cleaned text nulls:", preprocess_df["cleaned_text"].isnull().sum())
    #     print("text empty strings:", (preprocess_df['text'] == '').sum())
    #     print("lemmatized text empty strings:", (preprocess_df['lemmatized_text'] == '').sum())
    #     print("cleaned text empty strings:", (preprocess_df['cleaned_text'] == '').sum())
    #     print("text whitespace-only:", preprocess_df['text'].str.strip().eq('').sum())
    #     print("lemmatized text whitespace-only:", preprocess_df['lemmatized_text'].str.strip().eq('').sum())
    #     print("cleaned text whitespace-only:", preprocess_df['cleaned_text'].str.strip().eq('').sum())

    # train_model(preprocess_df)


def merge_datasets():
    """Merge raw datasets together"""
    # Load datasets
    isot_dataset = pd.read_csv("./data/datasets/isot_dataset.csv")
    liar_dataset = pd.read_csv("./data/datasets/liar_dataset.csv")
    real_news_pro_dataset = pd.read_csv("./data/datasets/real_news_pro_dataset.csv")
    # Concat Datasets together
    full_dataset_df = pd.concat([isot_dataset, liar_dataset, real_news_pro_dataset], ignore_index=True)
    # Drop rows where text is empty or whitespace-only
    full_dataset_df = full_dataset_df[full_dataset_df["text"].str.strip().astype(bool)]
    full_dataset_df = full_dataset_df.reset_index(drop=True)

    full_dataset_df.to_csv("./data/datasets/full_dataset.csv", index=False)
    print(f"Merged dataset saved to {FULL_DATASET_PATH}\n")
    return full_dataset_df


def load_or_merge_full_dataset():
    """Load merged dataset or mger raw datasets together"""
    try:
        df = pd.read_csv(FULL_DATASET_PATH)
        print("Merged dataset loaded successfully!\n")
    except FileNotFoundError:
        print("Merged dataset not found. Merging raw datasets...\n")
        df = merge_datasets()
    return df


def load_or_preprocess_data(full_df):
    """Load preprocess dataframe or apply preprocessing to merged dataset"""
    try:
        df = pd.read_csv(PREPROCESSED_DATASET_PATH)
        print("Preprocessed data loaded successfully!")
    except FileNotFoundError:
        print("Preprocessed data not found, starting preprocessing...")
        df = preprocess(full_df)
        df.to_csv(PREPROCESSED_DATASET_PATH, index=False)
        print("Datas have been successfully preprocessed!")
    return df


if __name__ == "__main__":
    main()