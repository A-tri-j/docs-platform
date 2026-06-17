from sqlalchemy.orm import Session
from app.models.topic import Topic

def get_topics(db: Session, category_id: int = None):
    query = db.query(Topic)
    if category_id:
        query = query.filter(Topic.category_id == category_id)
    return query.order_by(Topic.order, Topic.id).all()

def get_topic(db: Session, topic_id: int):
    return db.query(Topic).filter(Topic.id == topic_id).first()

def get_topic_by_slug(db: Session, slug: str, category_id: int):
    return db.query(Topic).filter(
        Topic.slug == slug, Topic.category_id == category_id
    ).first()

def create_topic(db: Session, data):
    topic = Topic(**data.dict())
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic

def update_topic(db: Session, topic_id: int, data):
    topic = get_topic(db, topic_id)
    if not topic:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(topic, key, value)
    db.commit()
    db.refresh(topic)
    return topic

def delete_topic(db: Session, topic_id: int):
    topic = get_topic(db, topic_id)
    if not topic:
        return False
    db.delete(topic)
    db.commit()
    return True