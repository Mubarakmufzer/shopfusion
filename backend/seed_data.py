"""
Seed the database with sample product data.
Run: python seed_data.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models.product import Product
import models  # registers all ORM models

Base.metadata.create_all(bind=engine)

PRODUCTS = [
    # ──────────────────────────── MEN ────────────────────────────
    {
        "name": "Urban Shield Bomber Jacket",
        "description": "Premium bomber jacket with quilted lining, ribbed cuffs, and a sleek matte finish. Perfect for urban street style.",
        "category": "men", "brand": "UrbanEdge", "price": 129.99, "original_price": 179.99,
        "sizes": ["S","M","L","XL","XXL"], "stock": 45,
        "colors": [{"name":"Black","hex":"#1a1a1a"},{"name":"Olive","hex":"#4a5c3a"},{"name":"Navy","hex":"#1e2b5a"}],
        "images": [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
            "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600"
        ],
        "tags": ["jacket","bomber","outerwear","casual"], "rating": 4.7, "review_count": 128,
        "is_featured": True, "is_new_arrival": False
    },
    {
        "name": "Classic Slim-Fit Chinos",
        "description": "Versatile slim-fit chinos made from stretch cotton blend. Wrinkle-resistant and perfect for office or weekend.",
        "category": "men", "brand": "ClassicThread", "price": 69.99, "original_price": 89.99,
        "sizes": ["28","30","32","34","36"], "stock": 80,
        "colors": [{"name":"Khaki","hex":"#c8ad7f"},{"name":"Navy","hex":"#1e2b5a"},{"name":"Charcoal","hex":"#3d3d3d"}],
        "images": [
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
        ],
        "tags": ["chinos","pants","casual","office"], "rating": 4.5, "review_count": 94,
        "is_featured": False, "is_new_arrival": False
    },
    {
        "name": "Luxe Merino Crew Sweater",
        "description": "Ultra-soft 100% merino wool crew neck sweater. Anti-itch, temperature-regulating, and effortlessly stylish.",
        "category": "men", "brand": "WoolCraft", "price": 109.99, "original_price": None,
        "sizes": ["S","M","L","XL"], "stock": 35,
        "colors": [{"name":"Camel","hex":"#c19a6b"},{"name":"Burgundy","hex":"#800020"},{"name":"Forest","hex":"#2d5a27"}],
        "images": [
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600",
            "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600"
        ],
        "tags": ["sweater","merino","winter","luxury"], "rating": 4.8, "review_count": 67,
        "is_featured": True, "is_new_arrival": True
    },
    {
        "name": "Cargo Street Joggers",
        "description": "Modern cargo joggers with multiple pockets, tapered fit, and elastic waistband. Street-ready comfort.",
        "category": "men", "brand": "UrbanEdge", "price": 79.99, "original_price": None,
        "sizes": ["S","M","L","XL","XXL"], "stock": 60,
        "colors": [{"name":"Stone","hex":"#b2a89d"},{"name":"Black","hex":"#1a1a1a"},{"name":"Army","hex":"#4b5320"}],
        "images": [
            "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600",
            "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600"
        ],
        "tags": ["joggers","cargo","streetwear","casual"], "rating": 4.4, "review_count": 52,
        "is_featured": False, "is_new_arrival": True
    },
    {
        "name": "Premium Oxford Button-Down",
        "description": "Timeless Oxford shirt in breathable cotton. Perfect for smart-casual looks, tucked or untucked.",
        "category": "men", "brand": "ClassicThread", "price": 59.99, "original_price": 79.99,
        "sizes": ["S","M","L","XL","XXL"], "stock": 90,
        "colors": [{"name":"White","hex":"#f5f5f5"},{"name":"Sky Blue","hex":"#87ceeb"},{"name":"Pink","hex":"#ffb6c1"}],
        "images": [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600"
        ],
        "tags": ["shirt","oxford","formal","classic"], "rating": 4.6, "review_count": 115,
        "is_featured": True, "is_new_arrival": False
    },
    {
        "name": "Minimalist Leather Sneakers",
        "description": "Clean, minimalist leather sneakers with cushioned insole and durable rubber outsole.",
        "category": "men", "brand": "SoleCraft", "price": 149.99, "original_price": 189.99,
        "sizes": ["40","41","42","43","44","45"], "stock": 40,
        "colors": [{"name":"White","hex":"#f5f5f5"},{"name":"Black","hex":"#1a1a1a"},{"name":"Tan","hex":"#d2b48c"}],
        "images": [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600"
        ],
        "tags": ["sneakers","shoes","leather","minimal"], "rating": 4.7, "review_count": 203,
        "is_featured": True, "is_new_arrival": False
    },

    # ──────────────────────────── WOMEN ────────────────────────────
    {
        "name": "Floral Wrap Midi Dress",
        "description": "Elegant wrap-style midi dress with a flowing silhouette and vibrant floral print. Perfect for any occasion.",
        "category": "women", "brand": "BloomStyle", "price": 89.99, "original_price": 119.99,
        "sizes": ["XS","S","M","L","XL"], "stock": 55,
        "colors": [{"name":"Rose print","hex":"#ffb7c5"},{"name":"Blue print","hex":"#6db6d4"},{"name":"Sage print","hex":"#8fad7a"}],
        "images": [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"
        ],
        "tags": ["dress","midi","floral","feminine"], "rating": 4.8, "review_count": 186,
        "is_featured": True, "is_new_arrival": False
    },
    {
        "name": "High-Waist Sculpt Leggings",
        "description": "Four-way stretch high-waist leggings with a sculpting waistband. Moisture-wicking for workouts or everyday wear.",
        "category": "women", "brand": "ActiveLux", "price": 64.99, "original_price": None,
        "sizes": ["XS","S","M","L","XL"], "stock": 120,
        "colors": [{"name":"Black","hex":"#1a1a1a"},{"name":"Dusty Rose","hex":"#dcb4b4"},{"name":"Deep Purple","hex":"#5c1f8a"}],
        "images": [
            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600",
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600"
        ],
        "tags": ["leggings","activewear","gym","yoga"], "rating": 4.9, "review_count": 412,
        "is_featured": True, "is_new_arrival": True
    },
    {
        "name": "Cashmere Turtleneck",
        "description": "Luxuriously soft cashmere turtleneck in a relaxed fit. A timeless wardrobe essential.",
        "category": "women", "brand": "WoolCraft", "price": 139.99, "original_price": 169.99,
        "sizes": ["XS","S","M","L"], "stock": 28,
        "colors": [{"name":"Cream","hex":"#fffdd0"},{"name":"Caramel","hex":"#c68642"},{"name":"Slate","hex":"#6e7f80"}],
        "images": [
            "https://images.unsplash.com/photo-1485462537746-965f33f5968d?w=600",
            "https://images.unsplash.com/photo-1578546374433-533e2be3e97d?w=600"
        ],
        "tags": ["cashmere","turtleneck","luxury","winter"], "rating": 4.9, "review_count": 88,
        "is_featured": False, "is_new_arrival": False
    },
    {
        "name": "Tailored Blazer Jacket",
        "description": "Sharp tailored blazer with structured shoulders and a flattering single-button closure. Office to dinner ready.",
        "category": "women", "brand": "BloomStyle", "price": 119.99, "original_price": 159.99,
        "sizes": ["XS","S","M","L","XL"], "stock": 42,
        "colors": [{"name":"Ivory","hex":"#fffff0"},{"name":"Black","hex":"#1a1a1a"},{"name":"Camel","hex":"#c19a6b"}],
        "images": [
            "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600"
        ],
        "tags": ["blazer","jacket","office","smart"], "rating": 4.7, "review_count": 139,
        "is_featured": True, "is_new_arrival": False
    },
    {
        "name": "Boho Maxi Skirt",
        "description": "Flowing bohemian maxi skirt with an elastic waist and beautiful earthy tones. Effortlessly stylish.",
        "category": "women", "brand": "BloomStyle", "price": 54.99, "original_price": None,
        "sizes": ["XS","S","M","L","XL"], "stock": 65,
        "colors": [{"name":"Terracotta","hex":"#e2725b"},{"name":"Indigo","hex":"#4b0082"},{"name":"Sand","hex":"#c2b280"}],
        "images": [
            "https://images.unsplash.com/photo-1583496661160-fb5974f3f8b0?w=600",
            "https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=600"
        ],
        "tags": ["skirt","boho","maxi","casual"], "rating": 4.5, "review_count": 73,
        "is_featured": False, "is_new_arrival": True
    },
    {
        "name": "Strappy Block Heel Sandals",
        "description": "Elegant strappy sandals with a comfortable block heel. Versatile enough for day to night.",
        "category": "women", "brand": "SoleCraft", "price": 84.99, "original_price": 109.99,
        "sizes": ["36","37","38","39","40","41"], "stock": 50,
        "colors": [{"name":"Nude","hex":"#e8c99a"},{"name":"Black","hex":"#1a1a1a"},{"name":"Gold","hex":"#ffd700"}],
        "images": [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600",
            "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600"
        ],
        "tags": ["sandals","heels","shoes","elegant"], "rating": 4.6, "review_count": 94,
        "is_featured": False, "is_new_arrival": False
    },

    # ──────────────────────────── KIDS ────────────────────────────
    {
        "name": "Dino Adventure Hoodie",
        "description": "Super soft fleece hoodie with fun dinosaur print. Machine washable and ultra-durable for active kids.",
        "category": "kids", "brand": "LittleStars", "price": 39.99, "original_price": 49.99,
        "sizes": ["2T","3T","4T","5","6","7","8"], "stock": 75,
        "colors": [{"name":"Green","hex":"#4caf50"},{"name":"Blue","hex":"#2196f3"},{"name":"Orange","hex":"#ff9800"}],
        "images": [
            "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600",
            "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600"
        ],
        "tags": ["hoodie","kids","dinosaur","casual"], "rating": 4.8, "review_count": 215,
        "is_featured": True, "is_new_arrival": False
    },
    {
        "name": "Rainbow Star Dress",
        "description": "Twirl-worthy dress with rainbow star pattern and a comfortable stretchy bodice. Perfect for any occasion.",
        "category": "kids", "brand": "LittleStars", "price": 34.99, "original_price": None,
        "sizes": ["2T","3T","4T","5","6","7","8"], "stock": 60,
        "colors": [{"name":"Multi","hex":"#ff6b9d"},{"name":"Blue","hex":"#7bb3f0"}],
        "images": [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf0?w=600",
            "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600"
        ],
        "tags": ["dress","girls","summer","fun"], "rating": 4.9, "review_count": 182,
        "is_featured": True, "is_new_arrival": True
    },
    {
        "name": "Adventure Trail Joggers",
        "description": "Reinforced knees, elastic waist, and multiple pockets. Built for adventure and everyday play.",
        "category": "kids", "brand": "LittleStars", "price": 29.99, "original_price": 39.99,
        "sizes": ["4","5","6","7","8","10","12"], "stock": 90,
        "colors": [{"name":"Grey","hex":"#9e9e9e"},{"name":"Navy","hex":"#1e2b5a"},{"name":"Khaki","hex":"#c8ad7f"}],
        "images": [
            "https://images.unsplash.com/photo-1544966503-9536aN3fe926?w=600",
            "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600"
        ],
        "tags": ["joggers","boys","outdoor","sport"], "rating": 4.6, "review_count": 97,
        "is_featured": False, "is_new_arrival": False
    },
    {
        "name": "Cozy Bear Pyjama Set",
        "description": "Soft cotton pyjama set with cute bear print. Perfect for bedtime comfort that kids will love.",
        "category": "kids", "brand": "DreamyKids", "price": 27.99, "original_price": None,
        "sizes": ["2T","3T","4T","5","6","7","8"], "stock": 100,
        "colors": [{"name":"Blue","hex":"#87ceeb"},{"name":"Pink","hex":"#ffb6c1"},{"name":"Yellow","hex":"#ffd700"}],
        "images": [
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600",
            "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600"
        ],
        "tags": ["pyjama","sleepwear","cute","kids"], "rating": 4.9, "review_count": 305,
        "is_featured": False, "is_new_arrival": True
    },
    {
        "name": "Sport Flex Sneakers",
        "description": "Lightweight, breathable sneakers with velcro closure for easy on/off. Great for school and sports.",
        "category": "kids", "brand": "SoleCraft", "price": 44.99, "original_price": 59.99,
        "sizes": ["28","29","30","31","32","33","34"], "stock": 55,
        "colors": [{"name":"Blue/White","hex":"#4b9cd3"},{"name":"Pink/White","hex":"#ff69b4"},{"name":"Black/Lime","hex":"#32cd32"}],
        "images": [
            "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=600",
            "https://images.unsplash.com/photo-1607522370275-f6fd0d15d641?w=600"
        ],
        "tags": ["sneakers","kids","school","sport"], "rating": 4.7, "review_count": 143,
        "is_featured": True, "is_new_arrival": False
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Product).count()
        if existing > 0:
            print(f"Database already has {existing} products. Skipping seed.")
            return

        for p in PRODUCTS:
            product = Product(**p)
            db.add(product)
        db.commit()
        print(f"✅ Seeded {len(PRODUCTS)} products successfully!")
    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
