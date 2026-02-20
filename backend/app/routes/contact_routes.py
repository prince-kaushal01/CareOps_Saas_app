from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from backend.schemas import ContactCreate, ContactUpdate, ContactResponse, ContactStatus
from backend.database import get_supabase
from backend.auth import get_current_user, require_staff_or_admin
from supabase import Client #type: ignore
import uuid
from datetime import datetime

router = APIRouter(prefix="/contacts", tags=["Contacts"])

@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(
    contact: ContactCreate,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Create a new contact"""
    try:
        contact_data = {
            "id": str(uuid.uuid4()),
            **contact.model_dump(),
            "status": ContactStatus.ACTIVE.value,
            "bookings_count": 0,
            "total_revenue": 0.0,
        }
        
        result = supabase.table("contacts").insert(contact_data).execute()
        return result.data[0] if result.data else None
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[ContactResponse])
async def get_contacts(
    status_filter: Optional[ContactStatus] = None,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get all contacts"""
    query = supabase.table("contacts").select("*")
    if status_filter:
        query = query.eq("status", status_filter.value)
    return query.order("created_at", desc=True).execute().data

@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(
    contact_id: str,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get a specific contact"""
    result = supabase.table("contacts").select("*").eq("id", contact_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    return result.data[0]

@router.patch("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: str,
    update_data: ContactUpdate,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Update a contact"""
    update_dict = update_data.model_dump(exclude_unset=True)
    if "status" in update_dict:
        update_dict["status"] = update_dict["status"].value
    update_dict["updated_at"] = datetime.utcnow().isoformat()
    
    result = supabase.table("contacts").update(update_dict).eq("id", contact_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    return result.data[0]

@router.delete("/{contact_id}")
async def delete_contact(
    contact_id: str,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Delete a contact"""
    result = supabase.table("contacts").delete().eq("id", contact_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}
