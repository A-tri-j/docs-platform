from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.topic import TopicCreate, TopicUpdate, TopicOut
from app.services import topic_service
from app.utils.dependencies import require_admin

router = APIRouter(prefix="/topics", tags=["Topics"])

# ---- PUBLIC: list topics (optionally filter by category) ----
@router.get("/", response_model=List[TopicOut])
def list_topics(category_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    return topic_service.get_topics(db, category_id)

# ---- PUBLIC: get single topic ----
@router.get("/{topic_id}", response_model=TopicOut)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = topic_service.get_topic(db, topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

# ---- ADMIN: create topic ----
@router.post("/", response_model=TopicOut, dependencies=[Depends(require_admin)])
def create_topic(data: TopicCreate, db: Session = Depends(get_db)):
    existing = topic_service.get_topic_by_slug(db, data.slug, data.category_id)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists in this category")
    return topic_service.create_topic(db, data)

# ---- ADMIN: update topic ----
@router.put("/{topic_id}", response_model=TopicOut, dependencies=[Depends(require_admin)])
def update_topic(topic_id: int, data: TopicUpdate, db: Session = Depends(get_db)):
    topic = topic_service.update_topic(db, topic_id, data)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

# ---- ADMIN: delete topic ----
@router.delete("/{topic_id}", dependencies=[Depends(require_admin)])
def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    success = topic_service.delete_topic(db, topic_id)
    if not success:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"message": "Topic deleted successfully"}