from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from database import get_db
from models.user import User
from models.product import Product
from schemas import ProductOut, ProductCreate
from auth import get_current_admin

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[ProductOut])
def get_products(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    size: Optional[str] = Query(None),
    color: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[str] = Query("newest"),   # newest | price_asc | price_desc | rating
    featured: Optional[bool] = Query(None),
    new_arrival: Optional[bool] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
):
    q = db.query(Product)

    if category:
        q = q.filter(Product.category == category.lower())
    if brand:
        q = q.filter(Product.brand == brand)
    if min_price is not None:
        q = q.filter(Product.price >= min_price)
    if max_price is not None:
        q = q.filter(Product.price <= max_price)
    if search:
        q = q.filter(
            Product.name.ilike(f"%{search}%") | Product.description.ilike(f"%{search}%")
        )
    if featured is not None:
        q = q.filter(Product.is_featured == featured)
    if new_arrival is not None:
        q = q.filter(Product.is_new_arrival == new_arrival)

    if sort == "price_asc":
        q = q.order_by(Product.price.asc())
    elif sort == "price_desc":
        q = q.order_by(Product.price.desc())
    elif sort == "rating":
        q = q.order_by(Product.rating.desc())
    else:
        q = q.order_by(Product.id.desc())

    products = q.offset(offset).limit(limit).all()

    # Client-side size/color filter (stored as JSON)
    if size:
        products = [p for p in products if size in (p.sizes or [])]
    if color:
        products = [p for p in products if any(c.get("name", "").lower() == color.lower() for c in (p.colors or []))]

    return products


@router.get("/brands", response_model=List[str])
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(Product.brand).distinct().all()
    return [b[0] for b in brands]


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductOut)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
