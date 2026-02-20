from fastapi import APIRouter, HTTPException, Depends
from typing import List
from backend.schemas import StaffCreate, StaffUpdate, StaffResponse, UserRole, StaffStatus
from backend.database import get_supabase_admin
from backend.auth import require_staff_or_admin, get_password_hash
from supabase import Client #type: ignore
import uuid

router = APIRouter(prefix="/staff", tags=["Staff"])

@router.post("", response_model=StaffResponse, status_code=201)
async def create_staff(
    staff: StaffCreate,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase_admin)
):
    """Create a new staff member"""
    # Check if email exists
    existing = supabase.table("users").select("*").eq("email", staff.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    staff_data = {
        "id": str(uuid.uuid4()),
        "email": staff.email,
        "username": staff.username,
        "password_hash": get_password_hash(staff.password),
        "phone_number": staff.phone_number,
        "role": UserRole.STAFF.value,
        "role_title": staff.role_title,
        "permissions": staff.permissions or [],
        "status": StaffStatus.ACTIVE.value,
        "joined_date": "now()",
    }
    
    result = supabase.table("users").insert(staff_data).execute()
    print(result)
    return result.data[0]

@router.get("", response_model=List[StaffResponse])
async def get_staff(
    active_only: bool = True,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase_admin)
):
    """Get all staff members"""
    query = supabase.table("users").select("*").eq("role", UserRole.STAFF.value)
    if active_only:
        query = query.eq("status", StaffStatus.ACTIVE.value)
        print(query)
    return query.order("username").execute().data

@router.get("/{staff_id}", response_model=StaffResponse)
async def get_staff_member(
    staff_id: str,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase_admin)
):
    """Get staff member by ID"""
    result = supabase.table("users").select("*").eq("id", staff_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return result.data[0]

@router.patch("/{staff_id}", response_model=StaffResponse)
async def update_staff(
    staff_id: str,
    update_data: StaffUpdate,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase_admin)
):
    """Update staff member"""
    update_dict = update_data.model_dump(exclude_unset=True)
    if "status" in update_dict:
        update_dict["status"] = update_dict["status"].value
    
    result = supabase.table("users").update(update_dict).eq("id", staff_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return result.data[0]

@router.delete("/{staff_id}")
async def delete_staff(
    staff_id: str,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase_admin)
):
    """Deactivate staff member"""
    result = supabase.table("users").update({"status": StaffStatus.INACTIVE.value}).eq("id", staff_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return {"message": "Staff member deactivated successfully"}
