# ============================================================
#  main.py — Chargement des modèles et prédictions
# ============================================================
import joblib
import nltk

# Runtime inference helpers (shared with the API) live in the root predict.py;
# baseline TF-IDF + sentiment helpers live in training/baseline_predict.py.
# Run this script as a module from data-science/:  python -m training.main
from predict import predict_texts_distilbert, analyze_emotion, compute_credibility_score
from training.baseline_predict import predict_text_baseline, analyze_sentiment
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from transformers import pipeline

nltk.download('vader_lexicon')  # Télécharger le lexique VADER pour l'analyse de sentiment

def test_prediction(test_texts):
    # Charger les modèles sauvegardés
    model = joblib.load("./models/logistic_regression.pkl")
    vectorizer = joblib.load("./models/tfidf_vectorizer.pkl")
    classifier = pipeline("text-classification", model="./models/distilbert", tokenizer="./models/distilbert")

    print("\n>> Testing predictions\n")
    for name, text in test_texts:
        bl_label, bl_proba = predict_text_baseline(model, vectorizer, text)
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

    classifier = pipeline("text-classification", model="./models/distilbert", tokenizer="./models/distilbert")
    emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=None, device=0, truncation=True)

    test_texts = [
        ("Short neutre", "The government has announced a new policy to combat climate change."),
        ("Style journalistique", "The spokesman for the ministry issued a statement saying the government would seek to address the allegations raised by the parliamentary committee investigating the matter."),
        ("Style fake/opinion", "You won't believe what this racist politician just revealed about his secret scheme. Watch the video and share this story before they try to hide the truth from liberal America."),
    ]

    for name, text in test_texts:
        distilbert_label, distilbert_score = predict_texts_distilbert(classifier, text)
        emotions = analyze_emotion(emotion_classifier, text)
        credibility = compute_credibility_score(distilbert_label, distilbert_score, emotions)
    
        emotion_dict = {e['label']: e['score'] for e in emotions}
        
        print(f"\n  [{name}]")
        print(f"    DistilBERT : {distilbert_label} ({distilbert_score:.3f})")
        print(f"    Base score : {distilbert_score if distilbert_label == 'Real' else 1 - distilbert_score:.3f}")
        print(f"    Émotions suspectes : anger={emotion_dict.get('anger',0):.3f}  surprise={emotion_dict.get('surprise',0):.3f}  disgust={emotion_dict.get('disgust',0):.3f}")
        print(f"    Score crédibilité : {credibility}")
        
    # # test_prediction()
    # test_sentiment(test_texts)

    # df = pd.read_csv("./data/datasets/full_dataset.csv")
    # sia = SentimentIntensityAnalyzer()

    # df["compound"] = df["text"].apply(lambda x: analyze_sentiment(sia, str(x))["compound"])

    # print(f"Average compound score - FAKE : {df[df["label"] == 0]["compound"].mean():.3f}")
    # print(f"Average compound score - REAL : {df[df["label"] == 1]["compound"].mean():.3f}")

    # emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1, device=0, truncation=True)

    # df["emotion"] = df["text"].apply(lambda x: analyze_emotion(emotion_classifier, str(x))[0]["label"])
    
    # print("FAKE")
    # print(df[df["label"] == 0]["emotion"].value_counts(normalize=True).round(3))
    # print("REAL")
    # print(df[df["label"] == 1]["emotion"].value_counts(normalize=True).round(3))
    # for name, text in test_texts:
    #     result = analyze_emotion(emotion_classifier, text)
    #     top = result[0]
    #     print(f"  [{name}]")
    #     print(f"    Émotion dominante: {top['label']} ({top['score']:.2%})")
    #     for e in result:
    #         print(f"      {e['label']:>10}: {e['score']:.3f}")
    #     print()



    
    
    
    

