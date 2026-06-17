from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.extras import TagCreate, TagOut
from app.services import tag_service
from app.utils.dependencies import require_admin

router = APIRouter(prefix="/tags", tags=["Tags"])

# ---- PUBLIC: list all tags ----
@router.get("/", response_model=List[TagOut])
def list_tags(db: Session = Depends(get_db)):
    return tag_service.get_tags(db)

# ---- ADMIN: create tag ----
@router.post("/", response_model=TagOut, dependencies=[Depends(require_admin)])
def create_tag(data: TagCreate, db: Session = Depends(get_db)):
    existing = tag_service.get_tag_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Tag slug already exists")
    return tag_service.create_tag(db, data)

# ---- ADMIN: delete tag ----
@router.delete("/{tag_id}", dependencies=[Depends(require_admin)])
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    success = tag_service.delete_tag(db, tag_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tag not found")
    return {"message": "Tag deleted successfully"}

# ---- ADMIN: attach tag to document ----
@router.post("/{tag_id}/documents/{document_id}", dependencies=[Depends(require_admin)])
def attach_tag(tag_id: int, document_id: int, db: Session = Depends(get_db)):
    result = tag_service.attach_tag_to_document(db, document_id, tag_id)
    if not result:
        raise HTTPException(status_code=404, detail="Document or tag not found")
    return {"message": "Tag attached to document"}

# ---- ADMIN: remove tag from document ----
@router.delete("/{tag_id}/documents/{document_id}", dependencies=[Depends(require_admin)])
def detach_tag(tag_id: int, document_id: int, db: Session = Depends(get_db)):
    result = tag_service.remove_tag_from_document(db, document_id, tag_id)
    if not result:
        raise HTTPException(status_code=404, detail="Document or tag not found")
    return {"message": "Tag removed from document"}