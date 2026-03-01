import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# df = pd.read_csv('./data/datasets/preprocessed_data.csv')

def train_model(df):

    data_to_train = df[["lemmatized_text", "label"]].copy()
    text_data = data_to_train["lemmatized_text"] # data
    labels = data_to_train["label"] # labels

    X_train, X_test, y_train, y_test = train_test_split(text_data, labels, test_size=0.2, random_state=42, stratify=labels)

    vectorizer = TfidfVectorizer()
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # # Get all words
    feature_names = vectorizer.get_feature_names_out()
    # # Get first article in the train data matrix
    # first_acticle = X_train_tfidf[0]
    # # Filtering on non zeros TF-IDF
    # non_zeros = first_acticle.nonzero()[1]

    # for i in non_zeros:
    #     word = feature_names[i]
    #     score = first_acticle[0, i] 
    #     print(f"word -> {word} : score -> {score}")

    logistic_regression_model = LogisticRegression()
    logistic_regression_model.fit(X_train_tfidf, y_train)

    coefs = logistic_regression_model.coef_
    print(coefs)
    



