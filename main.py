import pandas as pd
import numpy as np
from preprocessing import preprocess


def main():
    is_data_preprocessed = 0

    try:
        preprocess_df = pd.read_csv('./data/fake-and-real-news-dataset/preprocessed_data.csv')
        is_data_preprocessed = 1
    except FileNotFoundError:
        print("Preprocessed data not found. Starting preprocessing...")
    
    if is_data_preprocessed == 0:
        # Load the dataset
        fake_df = pd.read_csv('./data/fake-and-real-news-dataset/Fake.csv')
        true_df = pd.read_csv('./data/fake-and-real-news-dataset/True.csv')
        # Add a label column to distinguish between fake and real news
        fake_df["label"] = 1
        true_df["label"] = 0
        # Combine the datasets
        combined_df = pd.concat([fake_df, true_df], ignore_index=True)
        # Preprocess the text data
        preprocess_df = preprocess(combined_df)
        # Save the preprocessed data
        preprocess_df.to_csv('./data/fake-and-real-news-dataset/preprocessed_data.csv', index=False)

    print(preprocess_df["lemmatized_text"].isnull().sum())
    print(preprocess_df["text"].isnull().sum())

    
if __name__ == "__main__":
    main()