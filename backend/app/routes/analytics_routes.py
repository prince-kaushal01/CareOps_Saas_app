from fastapi import APIRouter, Depends
from schemas import DashboardStats, RevenueStats
from database import get_supabase
from auth import require_staff_or_admin
from supabase import Client #type: ignore
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get dashboard statistics"""
    # Get all data
    bookings = supabase.table("bookings").select("*").execute().data
    contacts = supabase.table("contacts").select("*").execute().data
    staff = supabase.table("users").select("*").eq("role", "staff").execute().data
    inventory = supabase.table("inventory").select("*").in_("status", ["low", "critical"]).execute().data
    forms = supabase.table("forms").select("*").eq("status", "overdue").execute().data
    
    # Calculate stats
    total_bookings = len(bookings)
    pending_bookings = len([b for b in bookings if b["status"] == "pending"])
    completed_bookings = len([b for b in bookings if b["status"] == "completed"])
    
    # Mock revenue calculation (120 per completed booking)
    total_revenue = completed_bookings * 120.0
    
    total_contacts = len(contacts)
    active_staff = len([s for s in staff if s.get("status") == "active"])
    low_stock_items = len(inventory)
    overdue_forms = len(forms)
    results=DashboardStats(
        total_bookings=total_bookings,
        pending_bookings=pending_bookings,
        completed_bookings=completed_bookings,
        total_revenue=total_revenue,
        total_contacts=total_contacts,
        active_staff=active_staff,
        low_stock_items=low_stock_items,
        overdue_forms=overdue_forms
    )
    print(results)
    return results

@router.get("/revenue", response_model=RevenueStats)
async def get_revenue_stats(
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get revenue statistics"""
    now = datetime.now()
    this_month_start = now.replace(day=1)
    last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)
    
    # Get bookings
    bookings = supabase.table("bookings").select("*").eq("status", "completed").execute().data
    
    # Calculate revenue (mock: 120 per booking)
    total = len(bookings) * 120.0
    
    this_month = len([b for b in bookings if b.get("created_at", "")[:7] == this_month_start.strftime("%Y-%m")]) * 120.0
    last_month = len([b for b in bookings if b.get("created_at", "")[:7] == last_month_start.strftime("%Y-%m")]) * 120.0
    
    # Calculate growth
    growth_percentage = ((this_month - last_month) / last_month * 100) if last_month > 0 else 0
    
    return RevenueStats(
        total=total,
        this_month=this_month,
        last_month=last_month,
        growth_percentage=growth_percentage
    )

@router.get("/bookings/by-status")
async def get_bookings_by_status(
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get booking counts by status"""
    bookings = supabase.table("bookings").select("status").execute().data
    
    status_counts = {}
    for booking in bookings:
        status = booking["status"]
        status_counts[status] = status_counts.get(status, 0) + 1
    
    return status_counts

@router.get("/bookings/by-service")
async def get_bookings_by_service(
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase)
):
    """Get booking counts by service"""
    bookings = supabase.table("bookings").select("service").execute().data
    
    service_counts = {}
    for booking in bookings:
        service = booking["service"]
        service_counts[service] = service_counts.get(service, 0) + 1
    
    return service_counts
