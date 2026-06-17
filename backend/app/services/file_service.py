import os
import shutil
from sqlalchemy.orm import Session
from fastapi import UploadFile
from app.models.file import File
from app.config import settings

# Use Cloudinary in production, local in dev
USE_CLOUDINARY = bool(settings.CLOUDINARY_CLOUD_NAME)

if USE_CLOUDINARY:
    import cloudinary
    import cloudinary.uploader
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
    )

UPLOAD_DIR = "uploads"

ALLOWED_EXTENSIONS = {
    ".pdf", ".doc", ".docx", ".md", ".txt",
    ".png", ".jpg", ".jpeg", ".gif", ".webp",
    ".zip", ".py", ".js", ".json", ".csv"
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def save_file(db: Session, document_id: int, upload: UploadFile):
    ext = os.path.splitext(upload.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File type '{ext}' not allowed")

    upload.file.seek(0, 2)
    file_size = upload.file.tell()
    upload.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise ValueError("File size exceeds 10MB limit")

    if USE_CLOUDINARY:
        result = cloudinary.uploader.upload(
            upload.file,
            folder=f"docs-platform/doc_{document_id}",
            resource_type="auto",
            public_id=os.path.splitext(upload.filename)[0],
            overwrite=True,
        )
        file_path = result["secure_url"]
    else:
        doc_folder = os.path.join(UPLOAD_DIR, f"doc_{document_id}")
        os.makedirs(doc_folder, exist_ok=True)
        file_path = os.path.join(doc_folder, upload.filename).replace("\\", "/")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload.file, buffer)

    db_file = File(
        document_id=document_id,
        file_name=upload.filename,
        file_path=file_path,
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
    if not USE_CLOUDINARY and os.path.exists(db_file.file_path):
        os.remove(db_file.file_path)
    db.delete(db_file)
    db.commit()
    return True
