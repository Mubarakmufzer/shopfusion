from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── Auth/User ───────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    is_admin: bool
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ─── Address ─────────────────────────────────────────────────
class AddressCreate(BaseModel):
    full_name: str
    phone: str
    street: str
    city: str
    state: str
    zip_code: str
    country: str = "US"
    is_default: bool = False

class AddressOut(AddressCreate):
    id: int
    class Config:
        from_attributes = True

# ─── Product ─────────────────────────────────────────────────
class ColorItem(BaseModel):
    name: str
    hex: str

class ProductBase(BaseModel):
    name: str
    description: str
    category: str
    brand: str
    price: float
    original_price: Optional[float] = None
    sizes: List[str] = []
    colors: List[dict] = []
    images: List[str] = []
    stock: int
    tags: List[str] = []
    is_featured: bool = False
    is_new_arrival: bool = False

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[dict]] = None
    images: Optional[List[str]] = None
    stock: Optional[int] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_new_arrival: Optional[bool] = None

class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    category: str
    brand: str
    price: float
    original_price: Optional[float] = None
    sizes: List[str] = []
    colors: List[dict] = []
    images: List[str] = []
    stock: int
    tags: List[str] = []
    rating: float
    review_count: int
    is_featured: bool
    is_new_arrival: bool
    class Config:
        from_attributes = True

# ─── Review ──────────────────────────────────────────────────
class ReviewCreate(BaseModel):
    rating: float
    title: Optional[str] = None
    comment: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    rating: float
    title: Optional[str] = None
    comment: Optional[str] = None
    created_at: datetime
    user: UserOut
    class Config:
        from_attributes = True

# ─── Cart ────────────────────────────────────────────────────
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    size: Optional[str] = None
    color: Optional[str] = None

class CartItemOut(BaseModel):
    id: int
    quantity: int
    size: Optional[str] = None
    color: Optional[str] = None
    product: ProductOut
    class Config:
        from_attributes = True

# ─── Wishlist ─────────────────────────────────────────────────
class WishlistItemOut(BaseModel):
    id: int
    product: ProductOut
    class Config:
        from_attributes = True

# ─── Order ───────────────────────────────────────────────────
class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_image: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    quantity: int
    price: float
    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    status: str
    subtotal: float
    shipping_cost: float
    total: float
    shipping_address: dict
    shipping_method: str
    payment_method: str
    payment_status: str
    tracking_number: Optional[str] = None
    created_at: datetime
    items: List[OrderItemOut] = []
    class Config:
        from_attributes = True

class CheckoutRequest(BaseModel):
    address: AddressCreate
    shipping_method: str = "standard"
    payment_method: str = "card"
