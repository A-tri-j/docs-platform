from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import auth, category, topic, document, tag, comment, view, search

app = FastAPI(title="Documentation Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    return {"status": "ok", "message": "Documentation Platform API running"}












