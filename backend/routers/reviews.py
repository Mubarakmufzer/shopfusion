from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.review import Review
from models.product import Product
from models.user import User
from schemas import ReviewCreate, ReviewOut
from auth import get_current_user

router = APIRouter(tags=["reviews"])


@router.get("/products/{product_id}/reviews", response_model=List[ReviewOut])
def get_reviews(product_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.product_id == product_id).all()


@router.post("/products/{product_id}/reviews", response_model=ReviewOut)
def add_review(
    product_id: int,
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(Review).filter(
        Review.product_id == product_id, Review.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already reviewed")

    review = Review(user_id=current_user.id, product_id=product_id, **data.model_dump())
    db.add(review)
    db.flush()

    # Update product rating
    all_reviews = db.query(Review).filter(Review.product_id == product_id).all()
    product.rating = sum(r.rating for r in all_reviews) / len(all_reviews)
    product.review_count = len(all_reviews)

    db.commit()
    db.refresh(review)
    return review
