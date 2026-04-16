import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models.user import User
from auth import hash_password
import models

def seed_admin():
    db = SessionLocal()
    try:
        email = "muhammed@gmail.com"
        full_name = "Muhammed Mubarak"
        password = "password123"
        
        # Check if user exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"User {email} already exists. Updating password...")
            existing.hashed_password = hash_password(password)
            existing.is_admin = True
        else:
            print(f"Creating user {email}...")
            user = User(
                email=email,
                full_name=full_name,
                hashed_password=hash_password(password),
                is_admin=True
            )
            db.add(user)
        
        db.commit()
        print("Success: Successfully seeded admin user!")
        print(f"Email: {email}")
        print(f"Password: {password}")
    except Exception as e:
        db.rollback()
        print(f"Error: Seed failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
