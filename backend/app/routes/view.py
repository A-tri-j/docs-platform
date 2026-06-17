from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.extras import DocumentViewStats
from app.services import view_service, document_service
from app.utils.security import decode_token

router = APIRouter(prefix="/documents", tags=["Views"])

# ---- PUBLIC: record a view (called when user opens a document) ----
@router.post("/{document_id}/view")
def record_view(document_id: int, request: Request, db: Session = Depends(get_db)):
    document = document_service.get_document(db, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # try to identify logged-in user (optional)
    user_id = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        payload = decode_token(token)
        if payload:
            user_id = payload.get("user_id")  # optional, not strictly required

    ip_address = request.client.host if request.client else None

    view_service.record_view(db, document_id, user_id, ip_address)
    return {"message": "View recorded"}

# ---- PUBLIC: get view stats for a document ----
@router.get("/{document_id}/views", response_model=DocumentViewStats)
def get_view_stats(document_id: int, db: Session = Depends(get_db)):
    document = document_service.get_document(db, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    total = view_service.get_view_count(db, document_id)
    return {"document_id": document_id, "total_views": total}