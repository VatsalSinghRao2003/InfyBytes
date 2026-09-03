from sqlalchemy import Integer, String, Column
from app.database import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    email_id = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String(20), nullable=True)
    address = Column(String(255), nullable= True)
    