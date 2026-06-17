from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.document import Document
from app.models.topic import Topic
from app.models.category import Category
from app.models.extras import Tag

def search_documents(db: Session, query: str, status: str = "published"):
    q = f"%{query}%"
    results = db.query(Document).filter(
        Document.status == status,
        or_(
            Document.title.ilike(q),
            Document.content.ilike(q),
        )
    ).all()

    # also search by tag name
    tag_results = db.query(Document).join(Document.tags).filter(
        Document.status == status,
        Tag.name.ilike(q)
    ).all()

    # merge unique results
    combined = {doc.id: doc for doc in results}
    for doc in tag_results:
        combined[doc.id] = doc

    return list(combined.values())