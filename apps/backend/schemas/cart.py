from pydantic import BaseModel

class AddToCartRequest(BaseModel):
    product_id: int
    quantity: int
    price: float

class UpdateCartRequest(BaseModel):
    product_id: int
    quantity: int

class RemoveCartItemRequest(BaseModel):
    product_id: int