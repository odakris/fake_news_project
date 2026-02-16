import pandas as pd
from preprocessing import preprocess


def main():
    is_data_preprocessed = 0

    try:
        preprocess_df = pd.read_csv('./data/fake-and-real-news-dataset/preprocessed_data.csv')
        print("Preprocessed data loaded successfully.\n")
        is_data_preprocessed = 1
    except FileNotFoundError:
        print("Preprocessed data not found. Starting preprocessing...\n")
    
    if is_data_preprocessed == 0:
        # Load the dataset
        fake_df = pd.read_csv('./data/fake-and-real-news-dataset/Fake.csv')
        true_df = pd.read_csv('./data/fake-and-real-news-dataset/True.csv')

        # Add a label column to distinguish between fake and real news
        fake_df["label"] = 1
        true_df["label"] = 0

        # Combine the datasets
        combined_df = pd.concat([fake_df, true_df], ignore_index=True)

        # Drop rows where text is empty or whitespace-only
        combined_df = combined_df[combined_df["text"].str.strip().astype(bool)]
        combined_df = combined_df.reset_index(drop=True)

        # Preprocess the text data
        preprocess_df = preprocess(combined_df)

        # Save the preprocessed data
        preprocess_df.to_csv('./data/fake-and-real-news-dataset/preprocessed_data.csv', index=False)

    # Check for nulls and empty strings in the relevant columns
    print("text nulls:", preprocess_df['text'].isnull().sum())
    print("lemmatized text nulls:", preprocess_df["lemmatized_text"].isnull().sum())
    print("cleaned text nulls:", preprocess_df["cleaned_text"].isnull().sum())
    print("text empty strings:", (preprocess_df['text'] == '').sum())
    print("lemmatized text empty strings:", (preprocess_df['lemmatized_text'] == '').sum())
    print("cleaned text empty strings:", (preprocess_df['cleaned_text'] == '').sum())
    print("text whitespace-only:", preprocess_df['text'].str.strip().eq('').sum())
    print("lemmatized text whitespace-only:", preprocess_df['lemmatized_text'].str.strip().eq('').sum())
    print("cleaned text whitespace-only:", preprocess_df['cleaned_text'].str.strip().eq('').sum())

    
if __name__ == "__main__":
    main()