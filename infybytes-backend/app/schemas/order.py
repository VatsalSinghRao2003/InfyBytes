from datetime import date
from pydantic import BaseModel

class PlaceOrderSchema(BaseModel):
    customer_id: int
    item_id: str
    quantity: int
    delivery_address: str
    order_date: date