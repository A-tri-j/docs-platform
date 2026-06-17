import os
import shutil
from sqlalchemy.orm import Session
from fastapi import UploadFile
from app.models.file import File

UPLOAD_DIR = "uploads"

ALLOWED_EXTENSIONS = {
    ".pdf", ".doc", ".docx", ".md", ".txt",
    ".png", ".jpg", ".jpeg", ".gif", ".webp",
    ".zip", ".py", ".js", ".json", ".csv"
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def save_file(db: Session, document_id: int, upload: UploadFile):
    ext = os.path.splitext(upload.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File type '{ext}' not allowed")

    # create per-document folder
    doc_folder = os.path.join(UPLOAD_DIR, f"doc_{document_id}")
    os.makedirs(doc_folder, exist_ok=True)

    file_path = os.path.join(doc_folder, upload.filename)

    # save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload.file, buffer)

    file_size = os.path.getsize(file_path)
    if file_size > MAX_FILE_SIZE:
        os.remove(file_path)
        raise ValueError("File size exceeds 10MB limit")

    db_file = File(
        document_id=document_id,
        file_name=upload.filename,
        file_path=file_path.replace("\\", "/"),
        file_type=ext.replace(".", ""),
        file_size=file_size,
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def get_files_by_document(db: Session, document_id: int):
    return db.query(File).filter(File.document_id == document_id).all()

def get_file(db: Session, file_id: int):
    return db.query(File).filter(File.id == file_id).first()

def delete_file(db: Session, file_id: int):
    db_file = get_file(db, file_id)
    if not db_file:
        return False
    if os.path.exists(db_file.file_path):
        os.remove(db_file.file_path)
    db.delete(db_file)
    db.commit()
    return True