# ============================================================
#  main.py — Chargement des modèles et prédictions
# ============================================================
import joblib
import pandas as pd
from transformers import pipeline
from predict import analyze_sentiment, predict_text, predict_texts_distilbert
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

nltk.download('vader_lexicon')  # Télécharger le lexique VADER pour l'analyse de sentiment

def test_prediction(test_texts):
    # Charger les modèles sauvegardés
    model = joblib.load("./models/logistic_regression.pkl")
    vectorizer = joblib.load("./models/tfidf_vectorizer.pkl")
    classifier = pipeline("text-classification", model="./models/distilbert", tokenizer="./models/distilbert")

    print("\n>> Testing predictions\n")
    for name, text in test_texts:
        bl_label, bl_proba = predict_text(model, vectorizer, text)
        db_label, db_proba = predict_texts_distilbert(classifier, text)
        print(f"  [{name}]")
        print(f"    BASELINE   : label={bl_label}  proba={bl_proba}")
        print(f"    DISTILBERT : label={db_label}  proba={db_proba}\n")

def test_sentiment(test_texts):
    sia = SentimentIntensityAnalyzer()
        
    for name, text in test_texts:
        sentiment = analyze_sentiment(sia, text)
        print(f"  [{name}]")
        print(f"    VADER compound : {sentiment['compound']:.3f} {sentiment['neg']:.3f} {sentiment['neu']:.3f} {sentiment['pos']:.3f}\n")


if __name__ == "__main__":
    # test_texts = [
    #     ("Short neutre", "The government has announced a new policy to combat climate change."),
    #     ("Style journalistique", "The spokesman for the ministry issued a statement saying the government would seek to address the allegations raised by the parliamentary committee investigating the matter."),
    #     ("Style fake/opinion", "You won't believe what this racist politician just revealed about his secret scheme. Watch the video and share this story before they try to hide the truth from liberal America."),
    # ]
        
    # # test_prediction()
    # test_sentiment(test_texts)

    df = pd.read_csv("./data/datasets/full_dataset.csv")
    sia = SentimentIntensityAnalyzer()

    df["compound"] = df["text"].apply(lambda x: analyze_sentiment(sia, str(x))["compound"])

    print(f"Average compound score - FAKE : {df[df["label"] == 0]["compound"].mean():.3f}")
    print(f"Average compound score - REAL : {df[df["label"] == 1]["compound"].mean():.3f}")


    
    
    
    

