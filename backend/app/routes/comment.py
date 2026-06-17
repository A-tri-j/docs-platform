from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.extras import CommentCreate, CommentOut
from app.services import comment_service, document_service
from app.utils.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/documents", tags=["Comments"])

# ---- PUBLIC: list comments for a document ----
@router.get("/{document_id}/comments", response_model=List[CommentOut])
def list_comments(document_id: int, db: Session = Depends(get_db)):
    document = document_service.get_document(db, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return comment_service.get_comments(db, document_id)

# ---- AUTH USER: add a comment ----
@router.post("/{document_id}/comments", response_model=CommentOut)
def add_comment(
    document_id: int,
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    document = document_service.get_document(db, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return comment_service.create_comment(db, document_id, current_user.id, data.comment)

# ---- ADMIN: delete a comment ----
@router.delete("/comments/{comment_id}", dependencies=[Depends(require_admin)])
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    success = comment_service.delete_comment(db, comment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted successfully"}