from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.routes import auth, category, topic, document, tag, comment, view, search

app = FastAPI(title="DocuHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
        "https://docshub.vercel.app",
        "*",  # will restrict after deploy
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploads only in development
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(category.router)
app.include_router(topic.router)
app.include_router(document.router)
app.include_router(tag.router)
app.include_router(comment.router)
app.include_router(view.router)
app.include_router(search.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "DocuHub API running 🚀"}
