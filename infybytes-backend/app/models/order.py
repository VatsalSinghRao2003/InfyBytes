from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from app.database import Base
from datetime import date

class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id"), nullable=False)
    item_id = Column(String(3), ForeignKey("items.item_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    delivery_address = Column(String(255), nullable=False)
    order_date = Column(Date, default=date.today, nullable=False)
    delivery_status = Column(String(20), default="NDL", nullable=False)