from sqlalchemy.orm import Session
from app.models.category import Category

def get_categories(db: Session):
    return db.query(Category).order_by(Category.id).all()

def get_category(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()

def get_category_by_slug(db: Session, slug: str):
    return db.query(Category).filter(Category.slug == slug).first()

def create_category(db: Session, data):
    category = Category(**data.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def update_category(db: Session, category_id: int, data):
    category = get_category(db, category_id)
    if not category:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category

def delete_category(db: Session, category_id: int):
    category = get_category(db, category_id)
    if not category:
        return False
    db.delete(category)
    db.commit()
    return True