from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TopicBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    order: Optional[int] = 0

class TopicCreate(TopicBase):
    category_id: int

class TopicUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None
    category_id: Optional[int] = None

class TopicOut(TopicBase):
    id: int
    category_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True