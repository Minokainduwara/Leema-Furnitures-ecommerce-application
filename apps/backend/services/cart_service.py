from models.cart import Cart
from models.cart import CartItem

def add_to_cart(db, user_id, product_id, quantity, price):

    cart = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.status == "active"
    ).first()

    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product_id
    ).first()

    if item:
        item.quantity += quantity
    else:
        item = CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity,
            price=price
        )
        db.add(item)

    db.commit()

    return {"message": "Item added to cart"}

def get_cart(db, user_id):
    cart = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.status == "active"
    ).first()

    if not cart:
        return {"items": [], "total": 0}

    items = db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).all()

    cart_items = []
    total = 0

    for item in items:
        line_total = item.quantity * float(item.price)
        total += line_total

        cart_items.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": float(item.price),
            "line_total": line_total
        })

    return {
        "cart_id": cart.id,
        "items": cart_items,
        "total": total
    }

def update_cart_item(db, user_id, product_id, quantity):

    cart = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.status == "active"
    ).first()

    if not cart:
        raise Exception("Cart not found")

    item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product_id
    ).first()

    if not item:
        raise Exception("Item not found")

    if quantity <= 0:
        db.delete(item)
    else:
        item.quantity = quantity

    db.commit()

    return {"message": "Cart updated"}

def remove_cart_item(db, user_id, product_id):

    cart = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.status == "active"
    ).first()

    if not cart:
        raise Exception("Cart not found")

    item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product_id
    ).first()

    if not item:
        raise Exception("Item not found")

    db.delete(item)
    db.commit()

    return {"message": "Item removed from cart"}