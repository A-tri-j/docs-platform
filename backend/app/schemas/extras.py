from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ---------- TAGS ----------
class TagBase(BaseModel):
    name: str
    slug: str

class TagCreate(TagBase):
    pass

class TagOut(TagBase):
    id: int

    class Config:
        from_attributes = True

# ---------- COMMENTS ----------
class CommentCreate(BaseModel):
    comment: str

class CommentOut(BaseModel):
    id: int
    document_id: int
    user_id: Optional[int] = None
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True

# ---------- VIEWS ----------
class ViewOut(BaseModel):
    id: int
    document_id: int
    user_id: Optional[int] = None
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentViewStats(BaseModel):
    document_id: int
    total_views: int