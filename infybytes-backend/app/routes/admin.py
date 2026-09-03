from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.item import AddItemSchema, UpdatePriceSchema
from app.services import admin_service


router = APIRouter(
    prefix="/api/Admin",
    tags=["Admin"]
)


@router.post("/AddItem")
def add_item(
    item_data: AddItemSchema,
    db: Session = Depends(get_db)
):
    # Validations
    if len(item_data.item_id) != 3:
        raise HTTPException(
            status_code=400,
            detail="Item ID must be exactly 3 characters!"
        )

    if not 4 <= len(item_data.item_name) <= 50:
        raise HTTPException(
            status_code=400,
            detail="Item Name must be between 4 and 50 characters!"
        )

    if item_data.price <= 0:
        raise HTTPException(
            status_code=400,
            detail="Price must be greater than zero!"
        )

    item = admin_service.add_item(
        db=db,
        item_id=item_data.item_id,
        item_name=item_data.item_name,
        category_id=item_data.category_id,
        price=item_data.price
    )

    if item is None:
        raise HTTPException(
            status_code=400,
            detail="Item ID already exists!"
        )

    return {
        "message": "Item added successfully!"
    }


@router.put("/UpdatePrice")
def update_price(
    item_data: UpdatePriceSchema,
    db: Session = Depends(get_db)
):
    if item_data.price <= 0:
        raise HTTPException(
            status_code=400,
            detail="Price must be greater than zero!"
        )

    item = admin_service.update_price(
        db=db,
        item_id=item_data.item_id,
        price=item_data.price
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Item ID not found!"
        )

    return {
        "message": "Price Updated successfully!"
    }


@router.get("/GetAllCategoryOrderDetails")
def get_category_order_details(
    categoryId: int,
    db: Session = Depends(get_db)
):
    results = admin_service.get_category_order_details(
        db=db,
        category_id=categoryId
    )

    response = []

    for row in results:
        response.append({
            "orderId": row.order_id,
            "customerId": row.customer_id,
            "customerName": row.customer_name,
            "itemId": row.item_id,
            "itemName": row.item_name,
            "quantity": row.quantity,
            "totalPrice": row.total_price,
            "deliveryAddress": row.delivery_address,
            "orderDate": row.order_date,
            "deliveryStatus": (
                "Delivered"
                if row.delivery_status == "DL"
                else "Not Delivered"
            )
        })

    return response