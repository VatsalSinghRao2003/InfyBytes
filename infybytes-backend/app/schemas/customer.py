from pydantic import BaseModel

class CustomerSchema(BaseModel):
    customer_id: int
    customer_name: str
    address: str
    email_id: str
    phone_number: str

