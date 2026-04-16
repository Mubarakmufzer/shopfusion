from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.wishlist import WishlistItem
from models.product import Product
from models.user import User
from schemas import WishlistItemOut
from auth import get_current_user

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.get("", response_model=List[WishlistItemOut])
def get_wishlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(WishlistItem).filter(WishlistItem.user_id == current_user.id).all()


@router.post("/{product_id}", response_model=WishlistItemOut)
def add_to_wishlist(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first()
    if existing:
        return existing

    item = WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not in wishlist")
    db.delete(item)
    db.commit()
    return {"message": "Removed from wishlist"}
