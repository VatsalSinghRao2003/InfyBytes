from datetime import date

from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.customer import Customer
from app.models.item import Item


def place_order(
    db: Session,
    customer_id: int,
    item_id: str,
    quantity: int,
    delivery_address: str,
    order_date: date
):
    customer = (
        db.query(Customer)
        .filter(Customer.customer_id == customer_id)
        .first()
    )

    if customer is None:
        return None, "Customer ID does not exist!", -1

    item = (
        db.query(Item)
        .filter(Item.item_id == item_id.upper())
        .first()
    )

    if item is None:
        return None, "Item ID does not exist!", -2

    if quantity <= 0:
        return None, "Quantity must be greater than zero!", -3

    if not delivery_address.strip():
        return None, "Delivery Address cannot be empty!", -4

    if order_date < date.today():
        return None, "Order Date cannot be in the past!", -5

    total_price = float(item.price) * quantity

    order = Order(
        customer_id=customer_id,
        item_id=item.item_id,
        quantity=quantity,
        total_price=total_price,
        delivery_address=delivery_address,
        order_date=order_date,
        delivery_status="NDL"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order, None, 0


def check_delivery_status(db: Session, order_id: int):
    order = (
        db.query(Order)
        .filter(Order.order_id == order_id)
        .first()
    )

    if order is None:
        return {
            "status": -1,
            "message": "Order ID does not exist!"
        }

    if order.delivery_status == "DL":
        return {
            "status": 0,
            "message": "Delivered"
        }

    return {
        "status": 1,
        "message": "Not Delivered!"
    }


def delete_order(db: Session, order_id: int):
    order = (
        db.query(Order)
        .filter(Order.order_id == order_id)
        .first()
    )

    if order is None:
        return None

    db.delete(order)
    db.commit()

    return order


def get_order_details(db: Session, order_id: int):
    result = (
        db.query(
            Order.order_id,
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
        .filter(Order.order_id == order_id)
        .first()
    )

    return result