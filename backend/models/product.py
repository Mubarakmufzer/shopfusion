from sqlalchemy import Column, Integer, String, Float, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False, index=True)   # men | women | kids
    brand = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)           # for discount display
    sizes = Column(JSON, default=list)                      # ["XS","S","M","L","XL"]
    colors = Column(JSON, default=list)                     # [{"name":"Black","hex":"#000"}]
    images = Column(JSON, default=list)                     # list of image URLs
    stock = Column(Integer, default=100)
    tags = Column(JSON, default=list)                       # ["casual","summer",...]
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    is_new_arrival = Column(Boolean, default=False)

    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="product")
    wishlist_items = relationship("WishlistItem", back_populates="product")
