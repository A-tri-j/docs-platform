from sqlalchemy.orm import Session
from app.models.extras import View

def record_view(db: Session, document_id: int, user_id: int = None, ip_address: str = None):
    view = View(document_id=document_id, user_id=user_id, ip_address=ip_address)
    db.add(view)
    db.commit()
    db.refresh(view)
    return view

def get_view_count(db: Session, document_id: int):
    return db.query(View).filter(View.document_id == document_id).count()

def get_total_views(db: Session):
    return db.query(View).count()

def get_unique_views(db: Session, document_id: int):
    return db.query(View.ip_address).filter(
        View.document_id == document_id
    ).distinct().count()