from pydantic import BaseModel

class CheckoutRequest(BaseModel):
    first_name: str
    last_name: str
    phone: str
    line1: str
    line2: str | None = None
    city: str
    district: str
    postal_code: str