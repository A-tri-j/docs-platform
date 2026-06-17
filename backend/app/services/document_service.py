from sqlalchemy.orm import Session
from app.models.document import Document

def get_documents(db: Session, topic_id: int = None, status: str = None):
    query = db.query(Document)
    if topic_id:
        query = query.filter(Document.topic_id == topic_id)
    if status:
        query = query.filter(Document.status == status)
    return query.order_by(Document.id).all()

def get_document(db: Session, document_id: int):
    return db.query(Document).filter(Document.id == document_id).first()

def get_document_by_slug(db: Session, slug: str, topic_id: int):
    return db.query(Document).filter(
        Document.slug == slug, Document.topic_id == topic_id
    ).first()

def create_document(db: Session, data):
    document = Document(**data.dict())
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

def update_document(db: Session, document_id: int, data):
    document = get_document(db, document_id)
    if not document:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(document, key, value)
    db.commit()
    db.refresh(document)
    return document

def delete_document(db: Session, document_id: int):
    document = get_document(db, document_id)
    if not document:
        return False
    db.delete(document)
    db.commit()
    return True