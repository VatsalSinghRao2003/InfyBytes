from sqlalchemy.orm import Session
from app.models.item import Item
from app.models.category import Category

def get_all_items(db:Session):
    items = db.query(Item).all()
    return [
        {
            "ItemId": item.item_id,
            "ItemName": item.item_name,
            "CategoryId": item.category_id,
            "Price": item.price,
        }
        for item in items
    ]

def get_items_by_category_name(db:Session, category_name: str):
    category = (db.query(Category)
                .filter(Category.category_name.ilike(category_name))
                .first())
    if category is None:
        return []

    items = (
        db.query(Item)
        .filter(Item.category_id == category.category_id)
        .all()
    )
    return [
        {
            "ItemId": item.item_id,
            "ItemName": item.item_name,
            "CategoryId": item.category_id,
            "Price": item.price,
        }
        for item in items
    ]

def get_item_price(db: Session, item_id: str):
    item = (
        db.query(Item)
        .filter(Item.item_id == item_id.upper())
        .first()
    )
    if item is None:
        return 0.0
        
    return float(item.price)