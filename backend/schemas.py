from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

# Enums
class UserRole(str, Enum):
    ADMIN = "admin"
    STAFF = "staff"
    CUSTOMER = "customer"

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no-show"

class ContactStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class FormStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    OVERDUE = "overdue"

class InventoryStatus(str, Enum):
    NORMAL = "normal"
    LOW = "low"
    CRITICAL = "critical"

class StaffStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    username: str = Field(..., min_length=3)
    phone_number: Optional[str] = None
    role: UserRole = UserRole.CUSTOMER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    phone_number: Optional[str]
    role: str
    created_at: Optional[str]

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

# Booking Schemas
class BookingCreate(BaseModel):
    customer_name: str
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None
    service: str
    date: date
    time: str
    duration: str = "60 min"
    location: str
    notes: Optional[str] = None

class BookingUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None
    service: Optional[str] = None
    date: Optional[date] = None
    time: Optional[str] = None
    duration: Optional[str] = None
    location: Optional[str] = None
    status: Optional[BookingStatus] = None
    assigned_staff_id: Optional[str] = None
    notes: Optional[str] = None

class BookingResponse(BaseModel):
    id: str
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    service: str
    date: str
    time: str
    duration: Optional[str] = None
    location: Optional[str] = None
    status: str

    assigned_staff_id: Optional[str] = None
    assigned_staff_name: Optional[str] = None   # ✅ FIX

    notes: Optional[str] = None
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Contact Schemas
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    tags: Optional[List[str]] = []
    notes: Optional[str] = None

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    status: Optional[ContactStatus] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    status: str
    tags: List[str]
    bookings_count: int
    total_revenue: float
    last_interaction: Optional[str]
    notes: Optional[str]
    created_at: str
    updated_at: Optional[str]

# Form Schemas
class FormCreate(BaseModel):
    name: str
    customer_name: str
    booking_id: Optional[str] = None

class FormUpdate(BaseModel):
    status: Optional[FormStatus] = None
    completed_fields: Optional[int] = None
    submitted_at: Optional[datetime] = None
    form_data: Optional[dict] = None

class FormResponse(BaseModel):
    id: str
    name: str
    customer_name: str
    booking_id: Optional[str]
    status: str
    progress: int
    fields: int
    completed_fields: int
    submitted_at: Optional[str]
    created_at: str
    updated_at: Optional[str]

# Inventory Schemas
class InventoryItemCreate(BaseModel):
    name: str
    category: str
    available: int = 0
    threshold: int = 10
    usage_per_booking: float = 1.0
    supplier: Optional[str] = None
    unit_price: Optional[float] = None

class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    available: Optional[int] = None
    threshold: Optional[int] = None
    usage_per_booking: Optional[float] = None
    supplier: Optional[str] = None
    unit_price: Optional[float] = None
    last_restocked: Optional[datetime] = None

class InventoryItemResponse(BaseModel):
    id: str
    name: str
    category: str
    available: int
    threshold: int
    status: str
    usage_per_booking: float
    supplier: Optional[str]
    unit_price: Optional[float]
    last_restocked: Optional[str]
    created_at: str
    updated_at: Optional[str]

# Staff Schemas
class StaffCreate(BaseModel):
    email: EmailStr
    username: str
    password: str = Field(..., min_length=8)
    phone_number: Optional[str] = None
    role_title: str = "Staff Member"
    permissions: Optional[List[str]] = []

class StaffUpdate(BaseModel):
    username: Optional[str] = None
    phone_number: Optional[str] = None
    role_title: Optional[str] = None
    permissions: Optional[List[str]] = None
    status: Optional[StaffStatus] = None

class StaffResponse(BaseModel):
    id: str
    email: str
    username: str
    phone_number: Optional[str]
    role: str
    role_title: str
    permissions: List[str]
    status: str
    joined_date: str
    last_active: Optional[str]

# Message Schemas
# class MessageCreate(BaseModel):
#     conversation_id: str
#     text: str

# class MessageResponse(BaseModel):
#     id: str
#     conversation_id: str
#     sender_id: str
#     sender_name: str
#     text: str
#     is_me: bool
#     created_at: str

# class ConversationResponse(BaseModel):
#     id: str
#     name: str
#     last_message: str
#     time: str
#     unread: int
#     status: str
#     participants: List[str]

# Analytics/Stats Schemas
class DashboardStats(BaseModel):
    total_bookings: int
    pending_bookings: int
    completed_bookings: int
    total_revenue: float
    total_contacts: int
    active_staff: int
    low_stock_items: int
    overdue_forms: int

class RevenueStats(BaseModel):
    total: float
    this_month: float
    last_month: float
    growth_percentage: float
# ---------------- CONVERSATION ---------------- #

class ConversationResponse(BaseModel):
    id: str
    name: str
    participants: List[str]
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    status: Optional[str] = None
    unread: Optional[int] = 0   # ✅ FIX

    class Config:
        from_attributes = True


# ---------------- MESSAGE ---------------- #

class MessageResponse(BaseModel):
    id: str
    conversation_id: Optional[str] = None
    sender_id: Optional[str] = None
    sender_name: Optional[str] = None
    text: str
    is_me: Optional[bool] = True   # ✅ FIX
    is_read: Optional[bool] = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    conversation_id: str
    text: str