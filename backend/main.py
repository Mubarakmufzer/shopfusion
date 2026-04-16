from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
import models  # registers all models

from routers import auth, products, cart, wishlist, orders, reviews, uploads

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ShopFusion API",
    description="Premium Clothing E-Commerce Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(wishlist.router)
app.include_router(orders.router)
app.include_router(reviews.router)
app.include_router(uploads.router)

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def root():
    return {"message": "Welcome to ShopFusion API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
