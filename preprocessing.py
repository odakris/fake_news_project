import spacy
import re

# Load the English model with only the tagger component for lemmatization
nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])  

def clean_text(text):
    """ Cleans the input text by removing URLs, mentions"""

    text = re.sub(r'https?://\S+|www\.\S+|\S+\.\w{2,}/\S*', '', text)  # Remove URLs
    text = re.sub(r'@\w+', ' ', text)  # Remove mentions
    text = re.sub(r'\b[a-zA-Z]{1}\b', '', text)  # Remove single-character words (s, t, d from contractions)
    text = re.sub(r'(\d)([a-zA-Z])', r'\1 \2', text)  # Add space between digits and letters (2017Trump -> 2017 Trump)
    text = re.sub(r'[^\w\s]', ' ', text)  # Remove punctuation
    text = re.sub(r'\s+', ' ', text).strip()  # Collapse multiple spaces
    return text


def lemmatize(doc, row_num): 
    """Lemmatizes the input text and removes stop words, punctuation, and extra whitespace."""

    print(f"Lemmatization of row {row_num}...")
    tokens = [
        token.lemma_.lower() 
        for token in doc 
        if not token.is_stop 
            and not token.is_punct 
            and not token.is_space
    ]

    return " ".join(tokens)


def preprocess(df):
    """Preprocesses the text data by cleaning and lemmatizing it."""
    
    df = df.copy()
    
    print("Cleaning text...")
    df = df[df["text"].str.strip().astype(bool)]  # Drop rows where text is empty or whitespace-only
    df["cleaned_text"] = df["text"].apply(clean_text)
    df = df[df["cleaned_text"].str.strip().astype(bool)].reset_index(drop=True)  # Drop rows where cleaned text is empty

    print("Lemmatizing text...")
    processed_texts = []
    try:
        #for i, doc in enumerate(nlp.pipe(df["cleaned_text"], batch_size=1000)):
        for i, doc in enumerate(nlp.pipe(df["cleaned_text"])):
            lemmatized_text = lemmatize(doc, i)
            processed_texts.append(lemmatized_text)
            # df["text"] = df.apply(lambda row: lemmatize(next(doc), row.name), axis=1)
    except Exception as e:
        print(f"Error during preprocessing: {e}")
    
    print("Preprocessing complete.")
    df["lemmatized_text"] = processed_texts
    return df

