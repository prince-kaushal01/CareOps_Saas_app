from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from backend.schemas import FormCreate, FormUpdate, FormResponse, FormStatus
from backend.database import get_supabase
from backend.auth import get_current_user, require_staff_or_admin
from supabase import Client #type: ignore
import uuid
from datetime import datetime

router = APIRouter(prefix="/forms", tags=["Forms"])

@router.post("", response_model=FormResponse, status_code=201)
async def create_form(
    form: FormCreate,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    form_data = {
        "id": str(uuid.uuid4()),
        "name": form.name,
        "customer_name": form.customer_name,
        "booking_id": form.booking_id,
        "status": FormStatus.PENDING.value,
        "progress": 0,
        "fields": 0,
        "completed_fields": 0,
        "created_by": current_user["id"],
    }

    result = supabase.table("forms").insert(form_data).execute()

    return result.data[0]

@router.get("", response_model=List[FormResponse])
async def get_forms(
    status_filter: Optional[FormStatus] = None,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get all forms"""
    query = supabase.table("forms").select("*")
    if status_filter:
        query = query.eq("status", status_filter.value)
    return query.order("created_at", desc=True).execute().data

@router.patch("/{form_id}", response_model=FormResponse)
async def update_form(
    form_id: str,
    update_data: FormUpdate,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Update a form"""
    update_dict = update_data.model_dump(exclude_unset=True)
    
    if "status" in update_dict:
        update_dict["status"] = update_dict["status"].value
    
    # Calculate progress if completed_fields updated
    if "completed_fields" in update_dict:
        existing = supabase.table("forms").select("fields").eq("id", form_id).execute()
        if existing.data:
            total_fields = existing.data[0]["fields"]
            update_dict["progress"] = int((update_dict["completed_fields"] / total_fields) * 100)
    
    update_dict["updated_at"] = datetime.utcnow().isoformat()
    
    result = supabase.table("forms").update(update_dict).eq("id", form_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Form not found")
    return result.data[0]

@router.delete("/{form_id}")
async def delete_form(
    form_id: str,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Delete a form"""
    result = supabase.table("forms").delete().eq("id", form_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"message": "Form deleted successfully"}
