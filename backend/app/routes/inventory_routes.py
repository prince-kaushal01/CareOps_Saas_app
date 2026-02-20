from fastapi import APIRouter, HTTPException, Depends
from typing import List
from backend.schemas import InventoryItemCreate, InventoryItemUpdate, InventoryItemResponse, InventoryStatus
from backend.database import get_supabase
from backend.auth import require_staff_or_admin
from supabase import Client #type: ignore
import uuid
from datetime import datetime

router = APIRouter(prefix="/inventory", tags=["Inventory"])

def calculate_status(available: int, threshold: int) -> str:
    """Calculate inventory status"""
    if available == 0:
        return InventoryStatus.CRITICAL.value
    elif available <= threshold:
        return InventoryStatus.LOW.value
    return InventoryStatus.NORMAL.value

@router.post("", response_model=InventoryItemResponse, status_code=201)
async def create_item(
    item: InventoryItemCreate,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Create inventory item"""
    status_val = calculate_status(item.available, item.threshold)
    item_data = {
        "id": str(uuid.uuid4()),
        **item.model_dump(),
        "status": status_val,
    }
    result = supabase.table("inventory").insert(item_data).execute()
    return result.data[0]

@router.get("", response_model=List[InventoryItemResponse])
async def get_items(
    low_stock_only: bool = False,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get all inventory items"""
    query = supabase.table("inventory").select("*")
    if low_stock_only:
        query = query.in_("status", ["low", "critical"])
    return query.order("name").execute().data

@router.get("/alerts")
async def get_alerts(
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get low stock alerts"""
    result = supabase.table("inventory").select("*").in_("status", ["low", "critical"]).execute()
    return {"count": len(result.data), "items": result.data}

@router.patch("/{item_id}", response_model=InventoryItemResponse)
async def update_item(
    item_id: str,
    update_data: InventoryItemUpdate,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Update inventory item"""
    update_dict = update_data.model_dump(exclude_unset=True)
    
    # Recalculate status if available or threshold changed
    if "available" in update_dict or "threshold" in update_dict:
        existing = supabase.table("inventory").select("*").eq("id", item_id).execute()
        if existing.data:
            available = update_dict.get("available", existing.data[0]["available"])
            threshold = update_dict.get("threshold", existing.data[0]["threshold"])
            update_dict["status"] = calculate_status(available, threshold)
    
    update_dict["updated_at"] = datetime.utcnow().isoformat()
    result = supabase.table("inventory").update(update_dict).eq("id", item_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Item not found")
    return result.data[0]

@router.delete("/{item_id}")
async def delete_item(
    item_id: str,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Delete inventory item"""
    result = supabase.table("inventory").delete().eq("id", item_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted successfully"}
