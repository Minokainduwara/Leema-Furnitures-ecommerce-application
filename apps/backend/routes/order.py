from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.order import CheckoutRequest
from services.order_service import checkout
from auth import verify_token, require_role
from sqlalchemy import text

router = APIRouter()

@router.post("/checkout")
def place_order(
    data: CheckoutRequest,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        return checkout(db, user["user_id"], data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/orders")
def get_orders(user=Depends(verify_token), db: Session = Depends(get_db)):

    # Get all orders of user
    orders = db.execute(
        text("""
            SELECT * FROM orders
            WHERE user_id = :user_id
            ORDER BY created_at DESC
        """),
        {"user_id": user["user_id"]}
    ).mappings().all()

    result = []

    for order in orders:

        # Get items for each order
        items = db.execute(
            text("""
                SELECT * FROM order_items
                WHERE order_id = :order_id
            """),
            {"order_id": order["id"]}
        ).mappings().all()

        result.append({
            "order_id": order["id"],
            "total": float(order["total"]),
            "status": order["status"],
            "created_at": str(order["created_at"]),
            "items": [
                {
                    "product_id": item["product_id"],
                    "quantity": item["quantity"],
                    "price": float(item["price"]),
                    "line_total": float(item["line_total"])
                }
                for item in items
            ]
        })

    return result

@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    from sqlalchemy import text

    valid_status = ["pending", "confirmed", "shipped", "delivered"]

    if status not in valid_status:
        raise HTTPException(status_code=400, detail="Invalid status")

    db.execute(
        text("""
            UPDATE orders
            SET status = :status
            WHERE id = :order_id
        """),
        {
            "status": status,
            "order_id": order_id
        }
    )

    db.commit()

    return {"message": "Order status updated"}