from app.models.order import Order
from app.models.customer import Customer

from sqlalchemy.orm import Session
from app.models.item import Item

def add_item(db: Session, item_id: str, item_name: str, category_id: int, price: float):
    existing_item = (db.query(Item)
                      .filter(Item.item_id == item_id)
                      .first())
    if existing_item:
        return None

    item = Item(
        item_id = item_id.upper(),
        item_name=item_name,
        category_id = category_id,
        price = price 
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def update_price(db:Session, item_id: str, price: float):
    item = (db.query(Item)
            .filter(Item.item_id == item_id.upper())
            .first())
    
    if item is None:
        return None

    item.price = price
    db.commit()
    db.refresh(item)
    return item    



def get_category_order_details(db: Session, category_id: int):
    results = (db.query(Order.order_id,
                        Order.customer_id,
                        Customer.customer_name,
                        Order.item_id,
                        Item.item_name,
                        Order.quantity,
                        Order.total_price,
                        Order.delivery_address,
                        Order.order_date,
                        Order.delivery_status
                        )
                        .join(Customer, Order.customer_id == Customer.customer_id)
                        .join(Item, Order.item_id == Item.item_id)
                        .filter(Item.category_id == category_id)
                        .all())
    return results
    
