from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database import Base

class Item(Base):
    __tablename__ = "items"

    item_id = Column(String(3), primary_key=True, index=True)
    item_name = Column(String(50), nullable=False)
    price = Column(Float, nullable=False)

    category_id = Column(Integer, ForeignKey("category.category_id"), nullable=False)


