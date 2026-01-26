from fastapi import APIRouter, HTTPException
import random
from app.snippets import all_code

router = APIRouter()

@router.get("/game/{language}")
def get_game(language: str):
    if language not in all_code:
        raise HTTPException(status_code=404, detail="Language not supported")

    snippets = all_code[language]
    if not snippets:
        raise HTTPException(status_code=404, detail="No snippets available")

    snippet = random.choice(snippets).replace("\t", "    ")
    return {"snippet": snippet}
