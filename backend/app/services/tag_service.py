from sqlalchemy.orm import Session
from app.models.extras import Tag
from app.models.document import Document

def get_tags(db: Session):
    return db.query(Tag).order_by(Tag.name).all()

def get_tag_by_slug(db: Session, slug: str):
    return db.query(Tag).filter(Tag.slug == slug).first()

def create_tag(db: Session, data):
    tag = Tag(**data.dict())
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag

def delete_tag(db: Session, tag_id: int):
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        return False
    db.delete(tag)
    db.commit()
    return True

def attach_tag_to_document(db: Session, document_id: int, tag_id: int):
    document = db.query(Document).filter(Document.id == document_id).first()
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not document or not tag:
        return None
    if tag not in document.tags:
        document.tags.append(tag)
        db.commit()
    return document

def remove_tag_from_document(db: Session, document_id: int, tag_id: int):
    document = db.query(Document).filter(Document.id == document_id).first()
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not document or not tag:
        return None
    if tag in document.tags:
        document.tags.remove(tag)
        db.commit()
    return document