from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from db.base_class import Base

class AnalysisLog(Base):
    # Clé primaire technique
    id = Column(Integer, primary_key=True, index=True)

    # L'identifiant unique du post Bluesky (URI ou URL)
    # index=True est CRUCIAL ici : c'est ce qui rendra la vérification "déjà analysé ?" rapide
    post_uri = Column(String, unique=True, index=True, nullable=False)

    # Le contenu texte (au cas où le post est supprimé, on garde une trace)
    content_text = Column(Text, nullable=False)

    # Le résultat du modèle IA (0.0 à 1.0)
    fake_probability = Column(Float, nullable=False)
    
    # Le verdict textuel ("FAKE", "SAFE", "SUSPECT")
    verdict = Column(String, nullable=False)

    # Qui a demandé l'analyse ? (Le DID de l'utilisateur Bluesky)
    requested_by_did = Column(String, index=True)

    # Date de création automatique (gérée par le serveur SQL)
    created_at = Column(DateTime(timezone=True), server_default=func.now())