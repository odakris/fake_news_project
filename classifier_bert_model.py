from transformers import pipeline

# 1. Chargement du modèle ALBERT
# Ce modèle est connu pour être très léger en termes de stockage
model_id = "XSY/albert-base-v2-fakenews-discriminator"

print(f"Chargement de {model_id}...")
classifier = pipeline("text-classification", model=model_id)

# 2. Textes à tester (Anglais)
textes = [
    "The US Congress passed a new bill regarding tax reform yesterday.",
    "Macron has announced that France will send troops to Ukraine.",
]

# 3. Analyse
print("\n--- Résultats de l'analyse ---")
resultats = classifier(textes)

# 4. Affichage et Interprétation
# Nous allons afficher les labels bruts et leur signification
mapping = classifier.model.config.id2label

for i, res in enumerate(resultats):
    label_id = res['label'] # Souvent LABEL_0 ou LABEL_1
    score = res['score']
    text = textes[i]
    
    # On essaie de traduire le label si le modèle a une config propre, sinon on affiche le brut
    # Note : Sur beaucoup de modèles ALBERT bruts : LABEL_1 = Real, LABEL_0 = Fake (à vérifier avec le mapping ci-dessous)
    print(f"\nPhrase : {text}")
    print(f"Prédiction : {label_id} (Confiance : {score:.4f})")

# 5. La clé de décodage (IMPORTANT pour ce modèle)
print("\n--- Légende interne du modèle ---")
print(f"Que signifient les labels ? : {mapping}")