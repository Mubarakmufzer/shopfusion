from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random, string
from database import get_db
from models.order import Order, OrderItem
from models.cart import CartItem
from models.user import User
from schemas import OrderOut, CheckoutRequest
from auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


def gen_tracking():
    return "SV" + "".join(random.choices(string.ascii_uppercase + string.digits, k=10))


@router.post("/checkout", response_model=OrderOut)
def checkout(data: CheckoutRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    subtotal = sum(item.product.price * item.quantity for item in cart_items)
    shipping_cost = 0.0 if subtotal >= 100 else (5.99 if data.shipping_method == "standard" else 15.99)
    total = subtotal + shipping_cost

    order = Order(
        user_id=current_user.id,
        status="processing",
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        total=total,
        shipping_address=data.address.model_dump(),
        shipping_method=data.shipping_method,
        payment_method=data.payment_method,
        payment_status="paid",
        tracking_number=gen_tracking(),
    )
    db.add(order)
    db.flush()

    for ci in cart_items:
        oi = OrderItem(
            order_id=order.id,
            product_id=ci.product_id,
            product_name=ci.product.name,
            product_image=ci.product.images[0] if ci.product.images else None,
            size=ci.size,
            color=ci.color,
            quantity=ci.quantity,
            price=ci.product.price,
        )
        db.add(oi)

    # Clear cart
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=List[OrderOut])
def get_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
