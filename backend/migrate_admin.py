import os
import sys
from sqlalchemy import create_engine, text
from database import SQLALCHEMY_DATABASE_URL

def migrate():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Update muhammed@gmail.com to be an admin
    admin_email = "muhammed@gmail.com"
    
    with engine.connect() as conn:
        print(f"Checking database for 'is_admin' column...")
        try:
            # Check if column exists
            conn.execute(text("SELECT is_admin FROM users LIMIT 1"))
            print("'is_admin' column already exists.")
        except Exception:
            print("Adding 'is_admin' column to 'users' table...")
            conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0"))
            conn.commit()
            print("Column added successfully.")

        print(f"Promoting {admin_email} to admin status...")
        result = conn.execute(text("UPDATE users SET is_admin = 1 WHERE email = :email"), {"email": admin_email})
        conn.commit()
        
        if result.rowcount > 0:
            print(f"✅ User {admin_email} is now an ADMIN.")
        else:
            print(f"❌ User {admin_email} not found. Please register first, then run this script.")

if __name__ == "__main__":
    migrate()
