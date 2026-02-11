from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx

# 1. On définit le schéma Bearer (Le cadenas dans Swagger UI demandera un Token)
security = HTTPBearer()

BLUESKY_SESSION_ENDPOINT = "https://bsky.social/xrpc/com.atproto.server.getSession"

async def get_current_user(token_auth: HTTPAuthorizationCredentials = Depends(security)):
    """
    Vérifie la validité du JWT envoyé par le Front.
    """
    token = token_auth.credentials

    # 2. On interroge Bluesky pour vérifier le token
    async with httpx.AsyncClient() as client:
        response = await client.get(
            BLUESKY_SESSION_ENDPOINT,
            headers={"Authorization": f"Bearer {token}"}
        )

    # 3. Si Bluesky refuse le token (401 ou 400), on rejette la requête
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token Bluesky invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 4. Si c'est bon, on récupère les infos (did, handle, email)
    user_data = response.json()
    
    return {
        "did": user_data.get("did"),
        "handle": user_data.get("handle"),
        "email": user_data.get("email"),
        "jwt": token  # On peut renvoyer le token si besoin pour d'autres appels
    }