from sqlalchemy.orm import Session
from app.models.extras import Comment

def get_comments(db: Session, document_id: int):
    return db.query(Comment).filter(
        Comment.document_id == document_id
    ).order_by(Comment.created_at.desc()).all()

def create_comment(db: Session, document_id: int, user_id: int, comment_text: str):
    comment = Comment(document_id=document_id, user_id=user_id, comment=comment_text)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def delete_comment(db: Session, comment_id: int):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        return False
    db.delete(comment)
    db.commit()
    return True