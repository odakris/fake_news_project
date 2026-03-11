from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer


def split_and_vectorize(df, ngram_range=(1,1)):
    """Splits the data into training and testing sets and vectorizes the text using TF-IDF."""
    X_train, X_test, y_train, y_test = train_test_split(
        df["lemmatized_text"], 
        df["label"], 
        test_size=0.2, 
        random_state=42, 
        stratify=df["label"])

    vectorizer = TfidfVectorizer(ngram_range=ngram_range)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    return X_train_tfidf, X_test_tfidf, y_train, y_test, vectorizer


def train_and_evaluate(model, X_train, X_test, y_train, y_test):
    """Train a model and print evaluation metrics"""
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))
    return model


def print_top_words(model, vectorizer, num_top_words=15):
    """Returns the top words of faake and real news"""
    feature_names = vectorizer.get_feature_names_out()
    coefs = model.coef_[0]

    top_fake_words = coefs.argsort()[:num_top_words]
    print("Top 15 words indicative of FAKE news (label 0):")
    for idx in top_fake_words:
        print(f"  {feature_names[idx]}: {coefs[idx]}")

    top_real_words = coefs.argsort()[-num_top_words:] # [-num_top_words:][::-1] --> pour inverser sens de la liste
    print("Top 15 words indicative of REAL news (label 0):")
    for idx in top_real_words:
        print(f"  {feature_names[idx]}: {coefs[idx]}")







    



