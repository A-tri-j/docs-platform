from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.document import DocumentListOut
from app.services import search_service

router = APIRouter(prefix="/search", tags=["Search"])

# ---- PUBLIC: search documents by title/content/tags ----
@router.get("/", response_model=List[DocumentListOut])
def search(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    return search_service.search_documents(db, q)