from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.schemas.order import PlaceOrderSchema
from app.services import order_service
from app.database import SessionLocal
from app.services import customer_service


router = APIRouter(
    prefix="/api/Customer",
    tags=["Customer"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/GetAllItems")
def get_all_items(db: Session = Depends(get_db)):
    return customer_service.get_all_items(db)


@router.get("/GetAllItemsByCategoryNames")
def get_items_by_category_name(
    categoryName: str,
    db: Session = Depends(get_db)
):
    return customer_service.get_items_by_category_name(
        db,
        categoryName
    )


@router.get("/GetItemPrice")
def get_item_price(
    itemId: str,
    db: Session = Depends(get_db)
):
    return customer_service.get_item_price(
        db,
        itemId
    )

@router.post("/PlaceOrder")
def place_order(
    order_data: PlaceOrderSchema,
    db: Session = Depends(get_db)
):
    order, message, error_code = order_service.place_order(
        db=db,
        customer_id=order_data.customer_id,
        item_id=order_data.item_id,
        quantity=order_data.quantity,
        delivery_address=order_data.delivery_address,
        order_date=order_data.order_date
    )

    if error_code == -1:
        raise HTTPException(
            status_code=400,
            detail={
                "message": message,
                "errorCode": -1
            }
        )

    if error_code == -2:
        raise HTTPException(
            status_code=400,
            detail={
                "message": message,
                "errorCode": -2
            }
        )

    if error_code == -3:
        raise HTTPException(
            status_code=400,
            detail={
                "message": message,
                "errorCode": -3
            }
        )

    if error_code == -4:
        raise HTTPException(
            status_code=400,
            detail={
                "message": message,
                "errorCode": -4
            }
        )

    if error_code == -5:
        raise HTTPException(
            status_code=400,
            detail={
                "message": message,
                "errorCode": -5
            }
        )

    return {
        "orderId": order.order_id,
        "totalPrice": order.total_price,
        "message": "Order placed successfully!"
    }