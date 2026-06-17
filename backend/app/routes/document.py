from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File as FastAPIFile
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentOut, DocumentListOut
from app.schemas.file import FileOut
from app.services import document_service, file_service
from app.utils.dependencies import require_admin

router = APIRouter(prefix="/documents", tags=["Documents"])

# ---- PUBLIC: list documents (filter by topic, status) ----
@router.get("/", response_model=List[DocumentListOut])
def list_documents(
    topic_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return document_service.get_documents(db, topic_id, status)

# ---- PUBLIC: get single document with files ----
@router.get("/{document_id}", response_model=DocumentOut)
def get_document(document_id: int, db: Session = Depends(get_db)):
    document = document_service.get_document(db, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

# ---- ADMIN: create document ----
@router.post("/", response_model=DocumentOut, dependencies=[Depends(require_admin)])
def create_document(data: DocumentCreate, db: Session = Depends(get_db)):
    existing = document_service.get_document_by_slug(db, data.slug, data.topic_id)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists in this topic")
    return document_service.create_document(db, data)

# ---- ADMIN: update document ----
@router.put("/{document_id}", response_model=DocumentOut, dependencies=[Depends(require_admin)])
def update_document(document_id: int, data: DocumentUpdate, db: Session = Depends(get_db)):
    document = document_service.update_document(db, document_id, data)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

# ---- ADMIN: delete document ----
@router.delete("/{document_id}", dependencies=[Depends(require_admin)])
def delete_document(document_id: int, db: Session = Depends(get_db)):
    success = document_service.delete_document(db, document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}

# ---- ADMIN: upload file to a document ----
@router.post("/{document_id}/upload", response_model=FileOut, dependencies=[Depends(require_admin)])
def upload_file(document_id: int, file: UploadFile = FastAPIFile(...), db: Session = Depends(get_db)):
    document = document_service.get_document(db, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        db_file = file_service.save_file(db, document_id, file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return db_file

# ---- PUBLIC: list files for a document ----
@router.get("/{document_id}/files", response_model=List[FileOut])
def list_files(document_id: int, db: Session = Depends(get_db)):
    return file_service.get_files_by_document(db, document_id)

# ---- ADMIN: delete a file ----
@router.delete("/files/{file_id}", dependencies=[Depends(require_admin)])
def delete_file(file_id: int, db: Session = Depends(get_db)):
    success = file_service.delete_file(db, file_id)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted successfully"}