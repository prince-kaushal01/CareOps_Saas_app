from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from backend.schemas import BookingCreate, BookingUpdate, BookingResponse, BookingStatus
from backend.database import get_supabase
from backend.auth import get_current_user, require_staff_or_admin
from supabase import Client #type: ignore
import uuid
from datetime import datetime

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking: BookingCreate,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Create a new booking"""
    try:
        booking_data = {
            "id": str(uuid.uuid4()),
            "customer_name": booking.customer_name,
            "customer_email": booking.customer_email,
            "customer_phone": booking.customer_phone,
            "service": booking.service,
            "date": str(booking.date),
            "time": booking.time,
            "duration": booking.duration,
            "location": booking.location,
            "status": BookingStatus.PENDING.value,
            "notes": booking.notes,
            "created_by": current_user["id"],
        }
        
        result = supabase.table("bookings").insert(booking_data).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create booking"
            )
        
        return result.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create booking: {str(e)}"
        )

@router.get("", response_model=List[BookingResponse])
async def get_bookings(
    status_filter: Optional[BookingStatus] = Query(None, alias="status"),
    date_from: Optional[str] = Query(None, alias="from"),
    date_to: Optional[str] = Query(None, alias="to"),
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get all bookings with optional filters"""
    try:
        query = supabase.table("bookings").select("""
            *,
            assigned_staff:users!bookings_assigned_staff_id_fkey(username)
        """)
        
        # Apply filters
        if status_filter:
            query = query.eq("status", status_filter.value)
        
        if date_from:
            query = query.gte("date", date_from)
        
        if date_to:
            query = query.lte("date", date_to)
        
        # Order by date
        query = query.order("date", desc=True).order("time", desc=True)
        
        result = query.execute()
        
        # Format response
        bookings = []
        for booking in result.data:
            staff_data = booking.get("assigned_staff", {})
            
            formatted = {
                **booking,
                "assigned_staff_name": staff_data.get("username") if staff_data else None
            }
            
            formatted.pop("assigned_staff", None)
            bookings.append(formatted)
        
        return bookings
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch bookings: {str(e)}"
        )

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """Get a specific booking"""
    try:
        result = supabase.table("bookings").select("""
            *,
            assigned_staff:users!bookings_assigned_staff_id_fkey(username)
        """).eq("id", booking_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        booking = result.data[0]
        staff_data = booking.get("assigned_staff", {})
        
        formatted = {
            **booking,
            "assigned_staff_name": staff_data.get("username") if staff_data else None
        }
        
        formatted.pop("assigned_staff", None)
        
        return formatted
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch booking: {str(e)}"
        )

@router.patch("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: str,
    update_data: BookingUpdate,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Update a booking"""
    try:
        # Get existing booking
        existing = supabase.table("bookings").select("*").eq("id", booking_id).execute()
        
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Prepare update data
        update_dict = update_data.model_dump(exclude_unset=True)
        
        # Convert date to string if present
        if "date" in update_dict and update_dict["date"]:
            update_dict["date"] = str(update_dict["date"])
        
        # Convert status enum to value
        if "status" in update_dict and update_dict["status"]:
            update_dict["status"] = update_dict["status"].value
        
        update_dict["updated_at"] = datetime.utcnow().isoformat()
        
        # Update booking
        result = supabase.table("bookings").update(update_dict).eq("id", booking_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update booking"
            )
        
        return result.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update booking: {str(e)}"
        )

@router.delete("/{booking_id}")
async def delete_booking(
    booking_id: str,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Delete a booking"""
    try:
        result = supabase.table("bookings").delete().eq("id", booking_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        return {"message": "Booking deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete booking: {str(e)}"
        )

@router.get("/stats/summary")
async def get_booking_stats(
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get booking statistics"""
    try:
        # Get all bookings
        result = supabase.table("bookings").select("*").execute()
        bookings = result.data
        
        # Calculate stats
        total = len(bookings)
        pending = len([b for b in bookings if b["status"] == "pending"])
        confirmed = len([b for b in bookings if b["status"] == "confirmed"])
        completed = len([b for b in bookings if b["status"] == "completed"])
        cancelled = len([b for b in bookings if b["status"] == "cancelled"])
        
        return {
            "total": total,
            "pending": pending,
            "confirmed": confirmed,
            "completed": completed,
            "cancelled": cancelled
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch stats: {str(e)}"
        )
