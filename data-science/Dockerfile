FROM python:3.12

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_sm
RUN python -c "import nltk; nltk.download('vader_lexicon')"

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]