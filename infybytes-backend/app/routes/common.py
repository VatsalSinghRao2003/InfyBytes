from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services import order_service
from app.models.category import Category


router = APIRouter(
    prefix="/api/Common",
    tags=["Common"]
)


@router.get("/GetCategories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return [
        {
            "CategoryId": category.category_id,
            "CategoryName": category.category_name,
        }
        for category in categories
    ]


@router.get("/CheckDeliveryStatus")
def check_delivery_status(
    orderId: int,
    db: Session = Depends(get_db)
):
    return order_service.check_delivery_status(
        db=db,
        order_id=orderId
    )


@router.delete("/DeleteOrderDetails")
def delete_order_details(
    orderId: int,
    db: Session = Depends(get_db)
):
    order = order_service.delete_order(
        db=db,
        order_id=orderId
    )

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Order ID not found!"
        )

    return {
        "message": "Order Cancelled!"
    }


@router.get("/GetAllOrderDetails")
def get_all_order_details(
    orderId: int,
    db: Session = Depends(get_db)
):
    result = order_service.get_order_details(
        db=db,
        order_id=orderId
    )

    if result is None:
        return []

    return {
        "orderId": result.order_id,
        "customerId": result.customer_id,
        "customerName": result.customer_name,
        "itemId": result.item_id,
        "itemName": result.item_name,
        "quantity": result.quantity,
        "totalPrice": result.total_price,
        "deliveryAddress": result.delivery_address,
        "orderDate": result.order_date,
        "deliveryStatus": (
            "Delivered"
            if result.delivery_status == "DL"
            else "Not Delivered"
        )
    }