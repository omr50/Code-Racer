from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.snippets import load_snippets
from app.routes.game import router as game_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    load_snippets()

app.include_router(game_router)
