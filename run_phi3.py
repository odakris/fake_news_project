import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# 1. Configuration
model_id = "microsoft/Phi-3-mini-128k-instruct"
device = "cuda" if torch.cuda.is_available() else "cpu"

print(f"Chargement du modèle sur : {device}...")

# 2. Chargement du Tokenizer et du Modèle
tokenizer = AutoTokenizer.from_pretrained(model_id)

model = AutoModelForCausalLM.from_pretrained(
    model_id, 
    device_map="auto", 
    torch_dtype=torch.float16, # Utilise moins de VRAM (important pour le GPU)
    trust_remote_code=True,    # OBLIGATOIRE pour Phi-3
)

# 3. Création du pipeline de génération
pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
)

# 4. Préparation du prompt (Format ChatML)
messages = [
    {"role": "user", "content": "Peux-tu m'expliquer le concept de la gravité quantique en une phrase ?"},
]

generation_args = {
    "max_new_tokens": 500,
    "return_full_text": False,
    "temperature": 0.7,
    "do_sample": True,
}

# 5. Génération
print("Génération en cours...")
output = pipe(messages, **generation_args)
print("\n--- Réponse ---")
print(output[0]['generated_text'])