from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.cart import AddToCartRequest, UpdateCartRequest, RemoveCartItemRequest
from services.cart_service import add_to_cart, get_cart, update_cart_item, remove_cart_item
from auth import verify_token

router = APIRouter()

@router.post("/cart/add")
def add_item(data: AddToCartRequest, user=Depends(verify_token), db: Session = Depends(get_db)):
    return add_to_cart(
        db,
        user["user_id"],
        data.product_id,
        data.quantity,
        data.price
    )

@router.get("/cart")
def view_cart(user=Depends(verify_token), db: Session = Depends(get_db)):
    return get_cart(db, user["user_id"])

@router.put("/cart/update")
def update_item(
    data: UpdateCartRequest,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    return update_cart_item(
        db,
        user["user_id"],
        data.product_id,
        data.quantity
    )

@router.delete("/cart/item")
def remove_item(
    data: RemoveCartItemRequest,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    return remove_cart_item(
        db,
        user["user_id"],
        data.product_id
    )