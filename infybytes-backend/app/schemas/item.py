from pydantic import BaseModel


class AddItemSchema(BaseModel):
    item_id: str
    item_name: str
    category_id: int
    price: float


class UpdatePriceSchema(BaseModel):
    item_id: str
    price: float