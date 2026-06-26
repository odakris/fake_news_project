# Fake News Project

Un client web inspiré de Bluesky qui analyse en temps réel les publications pour détecter les **fake news**. Chaque post est passé dans un pipeline de Machine Learning qui renvoie une classification (`Fake` / `Real` / `Uncertain`), une analyse émotionnelle, un score de crédibilité et les mots les plus influents dans la décision du modèle.

## Architecture

Le projet est composé de trois services orchestrés via Docker Compose, plus une base de données et un cache.

```
┌────────────────────┐      ┌────────────────────────┐      ┌─────────────────────┐
│  front (Next.js)   │ ───► │ data-science (FastAPI) │ ───► │  Modèles ML          │
│  Client Bluesky    │ POST │  /fakenews/verify      │      │  DistilBERT +        │
│  + Better Auth     │ ◄─── │                        │ ◄─── │  DistilRoBERTa       │
└─────────┬──────────┘      └────────────────────────┘      └─────────────────────┘
          │
          ├──► PostgreSQL (Prisma)   — sessions, comptes, utilisateurs
          └──► Redis                 — cache des vérifications (TTL 30 jours)
```

| Service | Dossier | Stack | Port |
|---------|---------|-------|------|
| Front-end | [`front/`](./front) | Next.js 16, React 19, Better Auth, AT Protocol, Prisma, Tailwind/Radix | `3000` |
| Data science | [`data-science/`](./data-science) | FastAPI, Transformers, PyTorch, spaCy/NLTK | `8000` |
| Base de données | — | PostgreSQL 13 | `5432` |
| Cache | — | Redis | `6379` |

## Démarrage rapide (Docker)

La méthode la plus simple pour lancer toute la stack :

```bash
docker compose up --build
```

Une fois les services démarrés :

- Application web : http://localhost:3000
- API data-science (docs) : http://localhost:8000/docs

## Le pipeline de détection

L'endpoint `POST /fakenews/verify` du service data-science effectue les étapes suivantes :

1. **Nettoyage** — suppression des indices de source (bylines Reuters, datelines, URLs…) pour coller à ce que DistilBERT a vu à l'entraînement.
2. **Classification** — un **DistilBERT** fine-tuné prédit `Fake` ou `Real` avec un score de confiance.
3. **Garde-fous** — un texte trop court (< 5 mots) ou une prédiction peu sûre (< 0.60 de confiance) est requalifié en `Uncertain`.
4. **Analyse émotionnelle** — un **DistilRoBERTa** (`j-hartmann/emotion`) score 7 émotions (colère, dégoût, peur, joie, neutre, tristesse, surprise) sur le texte brut.
5. **Score de crédibilité** — un score normalisé entre 0 et 1.
6. **Mots influents** — attribution par gradient (`grad * (input - baseline PAD)`) pour identifier les mots ayant le plus pesé dans la décision.

### Exemple de réponse

```ts
await verify({ search: "anything you want to verify", top_k: 5 });
```

| Method | Route | Body / Query |
|--------|--------|---------------|
| GET | `/api/verify` | `{ search: string, top_k?: int }` |

```json
{
  "text": "Breaking: scientists discover ...",
  "classification": { "label": "Fake", "confidence": 0.92, "model_label": "Fake" },
  "emotions": { "anger": 0.12, "surprise": 0.41, "neutral": 0.18, "...": 0.0 },
  "credibility_score": 0.08,
  "top_words": [{ "word": "shocking", "score": 1.0 }, { "word": "secret", "score": 0.74 }]
}
```

## Développement local

### Front-end

```bash
cd front
pnpm install
pnpm dev          # http://localhost:3000
```

Variables d'environnement principales (voir `front/src/lib/env.ts`) :

| Variable | Description | Défaut (dev) |
|----------|-------------|--------------|
| `DATABASE_URL` | Connexion PostgreSQL | `postgresql://user:password@localhost:5432/fakenewsproject` |
| `BETTER_AUTH_SECRET` | Secret Better Auth (≥ 32 caractères) | `dev-only-change-me-...` |
| `BETTER_AUTH_URL` | URL publique de l'app | `http://localhost:3001` |
| `DATA_SCIENCE_API_URL` | URL de l'API data-science | `http://localhost:8000` |
| `REDIS_URL` | Connexion Redis | `redis://localhost:6379` |

### Data science

Le service utilise [`uv`](https://github.com/astral-sh/uv) pour la gestion des dépendances.

```bash
cd data-science
uv sync                     # dépendances d'exécution
uv sync --group training    # + dépendances d'entraînement (scikit-learn, joblib)
uv run uvicorn api:app --reload --port 8000
```

## Structure du projet

```
fake_news_project/
├── docker-compose.yml          # Orchestration des 4 services
├── front/                      # Application web Next.js (client Bluesky)
│   ├── app/                    # Routes (App Router) + route API /api/verify
│   ├── src/components/bsky/    # Composants UI (post-card, feed, badges de classification…)
│   ├── src/lib/                # auth, prisma, redis, intégration data-science (bsky/verify.ts)
│   └── prisma/schema.prisma    # Modèles User / Session / Account / Verification
└── data-science/               # Service ML FastAPI
    ├── api.py                  # Endpoint POST /fakenews/verify
    ├── predict.py              # Inférence : classification, émotions, crédibilité, top words
    ├── training/               # Pipeline d'entraînement (preprocessing, model_training…)
    ├── notebooks/              # Exploration de données (ISOT, LIAR) + entraînement DistilBERT
    └── models/                 # Modèles entraînés (distilbert, emotion, baseline logistic)
```

## Modèles

- **`models/distilbert/`** — DistilBERT fine-tuné pour la classification Fake/Real.
- **`models/emotion/`** — DistilRoBERTa pour l'analyse émotionnelle.
- **`models/logistic_regression.pkl` + `tfidf_vectorizer.pkl`** — baseline TF-IDF + régression logistique.

Les datasets d'exploration (ISOT, LIAR) et le notebook d'entraînement se trouvent dans `data-science/notebooks/`.

## License

MIT.
