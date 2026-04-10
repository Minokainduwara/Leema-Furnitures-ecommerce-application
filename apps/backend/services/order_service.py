from models.cart import Cart, CartItem
from models.user import User
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy import text

def checkout(db: Session, user_id: int, data):

    # Get active cart
    cart = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.status == "active"
    ).first()

    if not cart:
        raise Exception("Cart is empty")

    items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    if not items:
        raise Exception("Cart has no items")

    # Calculate total
    total = 0
    for item in items:
        total += item.quantity * float(item.price)

    # Create order
    order_data = {
        "user_id": user_id,
        "status": "pending",
        "total": total,
        "created_at": datetime.utcnow()
    }

    result = db.execute(
        text("""
            INSERT INTO orders (user_id, status, total, created_at)
            VALUES (:user_id, :status, :total, :created_at)
        """),
        order_data
    )

    db.commit()

    # Get order id
    order_id = result.lastrowid

    # Insert order items
    for item in items:
        db.execute(
            text("""
            INSERT INTO order_items (order_id, product_id, quantity, price, line_total)
            VALUES (:order_id, :product_id, :quantity, :price, :line_total)
            """),
            {
                "order_id": order_id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price,
                "line_total": item.quantity * float(item.price)
            }
        )

    # Save address
    db.execute(
        text("""
        INSERT INTO addresses (user_id, receiver_name, phone, line1, line2, city, district, postal_code)
        VALUES (:user_id, :name, :phone, :line1, :line2, :city, :district, :postal_code)
        """),
        {
            "user_id": user_id,
            "name": f"{data.first_name} {data.last_name}",
            "phone": data.phone,
            "line1": data.line1,
            "line2": data.line2,
            "city": data.city,
            "district": data.district,
            "postal_code": data.postal_code
        }
    )

    # Clear cart
    db.execute(
        text("DELETE FROM cart_items WHERE cart_id = :cart_id"),
        {"cart_id": cart.id}
    )

    cart.status = "completed"

    db.commit()

    return {
        "message": "Order placed successfully",
        "order_id": order_id
    }

