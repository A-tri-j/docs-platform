from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentBase(BaseModel):
    title: str
    slug: str
    content: Optional[str] = None
    status: Optional[str] = "draft"  # draft / published

class DocumentCreate(DocumentBase):
    topic_id: int

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    status: Optional[str] = None
    topic_id: Optional[int] = None

class FileOut(BaseModel):
    id: int
    file_name: str
    file_path: str
    file_type: str
    file_size: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentOut(DocumentBase):
    id: int
    topic_id: int
    created_at: datetime
    updated_at: datetime
    files: List[FileOut] = []

    class Config:
        from_attributes = True

class DocumentListOut(BaseModel):
    id: int
    title: str
    slug: str
    status: str
    topic_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True