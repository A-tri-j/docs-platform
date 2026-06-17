from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryOut
from app.services import category_service
from app.utils.dependencies import require_admin

router = APIRouter(prefix="/categories", tags=["Categories"])

# ---- PUBLIC: list all categories ----
@router.get("/", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return category_service.get_categories(db)

# ---- PUBLIC: get single category by id ----
@router.get("/{category_id}", response_model=CategoryOut)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = category_service.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# ---- ADMIN: create category ----
@router.post("/", response_model=CategoryOut, dependencies=[Depends(require_admin)])
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    existing = category_service.get_category_by_slug(db, data.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    return category_service.create_category(db, data)

# ---- ADMIN: update category ----
@router.put("/{category_id}", response_model=CategoryOut, dependencies=[Depends(require_admin)])
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    category = category_service.update_category(db, category_id, data)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# ---- ADMIN: delete category ----
@router.delete("/{category_id}", dependencies=[Depends(require_admin)])
def delete_category(category_id: int, db: Session = Depends(get_db)):
    success = category_service.delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}