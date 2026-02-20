# CareOps API Reference

Complete API documentation for all endpoints.

Base URL: `http://localhost:8000` (development) or `https://your-domain.com` (production)

---

## Authentication

All protected endpoints require Bearer token in header:
```
Authorization: Bearer <access_token>
```

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "username": "John Doe",
  "phone_number": "555-1234",
  "role": "customer"
}
```

**Response:** 201 Created
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "John Doe",
    "phone_number": "555-1234",
    "role": "customer",
    "created_at": "2026-02-14T12:00:00"
  }
}
```

### POST /auth/login

Login and receive access token.

**Request Body:**
```json
{
  "email": "admin@careops.com",
  "password": "admin123456"
}
```

**Response:** 200 OK
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "admin@careops.com",
    "username": "Admin User",
    "role": "admin"
  }
}
```

### GET /auth/me

Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** 200 OK
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "John Doe",
  "phone_number": "555-1234",
  "role": "customer",
  "created_at": "2026-02-14T12:00:00"
}
```

---

## Bookings

### POST /bookings

Create a new booking.

**Permission:** Any authenticated user

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "555-1234",
  "service": "House Cleaning",
  "date": "2026-02-20",
  "time": "10:00 AM",
  "duration": "90 min",
  "location": "123 Main St, City, State 12345",
  "notes": "Please bring vacuum cleaner"
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "555-1234",
  "service": "House Cleaning",
  "date": "2026-02-20",
  "time": "10:00 AM",
  "duration": "90 min",
  "location": "123 Main St, City, State 12345",
  "status": "pending",
  "assigned_staff_id": null,
  "assigned_staff_name": null,
  "notes": "Please bring vacuum cleaner",
  "created_at": "2026-02-14T12:00:00",
  "updated_at": null
}
```

### GET /bookings

List all bookings with optional filters.

**Permission:** Staff or Admin

**Query Parameters:**
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled, no-show)
- `from` (optional): Filter by date from (YYYY-MM-DD)
- `to` (optional): Filter by date to (YYYY-MM-DD)

**Example:** `GET /bookings?status=pending&from=2026-02-01&to=2026-02-28`

**Response:** 200 OK
```json
[
  {
    "id": "uuid",
    "customer_name": "John Doe",
    "service": "House Cleaning",
    "date": "2026-02-20",
    "time": "10:00 AM",
    "status": "pending",
    "assigned_staff_name": "Jane Smith",
    ...
  }
]
```

### GET /bookings/{booking_id}

Get a specific booking.

**Permission:** Staff or Admin

**Response:** 200 OK
```json
{
  "id": "uuid",
  "customer_name": "John Doe",
  ...
}
```

### PATCH /bookings/{booking_id}

Update a booking.

**Permission:** Staff or Admin

**Request Body:** (all fields optional)
```json
{
  "status": "confirmed",
  "assigned_staff_id": "uuid",
  "date": "2026-02-21",
  "time": "2:00 PM"
}
```

**Response:** 200 OK
```json
{
  "id": "uuid",
  "status": "confirmed",
  "assigned_staff_id": "uuid",
  "assigned_staff_name": "Jane Smith",
  ...
}
```

### DELETE /bookings/{booking_id}

Delete a booking.

**Permission:** Staff or Admin

**Response:** 200 OK
```json
{
  "message": "Booking deleted successfully"
}
```

### GET /bookings/stats/summary

Get booking statistics.

**Permission:** Staff or Admin

**Response:** 200 OK
```json
{
  "total": 150,
  "pending": 23,
  "confirmed": 45,
  "completed": 78,
  "cancelled": 4
}
```

---

## Contacts

### POST /contacts

Create a new contact.

**Permission:** Staff or Admin

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "tags": ["VIP", "Regular"],
  "notes": "Prefers morning appointments"
}
```

**Response:** 201 Created

### GET /contacts

List all contacts.

**Permission:** Staff or Admin

**Query Parameters:**
- `status` (optional): active, inactive

**Response:** 200 OK
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "status": "active",
    "tags": ["VIP", "Regular"],
    "bookings_count": 5,
    "total_revenue": 600.00,
    "last_interaction": "2026-02-14T12:00:00",
    "notes": "Prefers morning appointments",
    "created_at": "2026-01-01T00:00:00",
    "updated_at": "2026-02-14T12:00:00"
  }
]
```

### PATCH /contacts/{contact_id}

Update a contact.

**Permission:** Staff or Admin

**Request Body:** (all fields optional)
```json
{
  "status": "inactive",
  "tags": ["VIP"],
  "notes": "Updated notes"
}
```

### DELETE /contacts/{contact_id}

Delete a contact.

**Permission:** Staff or Admin

---

## Inventory

### POST /inventory

Add inventory item.

**Permission:** Staff or Admin

**Request Body:**
```json
{
  "name": "Cleaning Solution",
  "category": "Chemicals",
  "available": 50,
  "threshold": 20,
  "usage_per_booking": 2.0,
  "supplier": "CleanSupply Co",
  "unit_price": 15.99
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "name": "Cleaning Solution",
  "category": "Chemicals",
  "available": 50,
  "threshold": 20,
  "status": "normal",
  "usage_per_booking": 2.0,
  "supplier": "CleanSupply Co",
  "unit_price": 15.99,
  "last_restocked": null,
  "created_at": "2026-02-14T12:00:00",
  "updated_at": null
}
```

### GET /inventory

List all inventory items.

**Permission:** Staff or Admin

**Query Parameters:**
- `low_stock_only` (optional): true/false

**Response:** 200 OK

### GET /inventory/alerts

Get low stock alerts.

**Permission:** Staff or Admin

**Response:** 200 OK
```json
{
  "count": 2,
  "items": [
    {
      "id": "uuid",
      "name": "Microfiber Cloths",
      "available": 5,
      "threshold": 10,
      "status": "critical"
    }
  ]
}
```

### PATCH /inventory/{item_id}

Update inventory item.

**Request Body:**
```json
{
  "available": 100,
  "last_restocked": "2026-02-14T12:00:00"
}
```

---

## Staff

### POST /staff

Create staff member.

**Permission:** Staff or Admin

**Request Body:**
```json
{
  "email": "staff@example.com",
  "username": "Jane Smith",
  "password": "securepass123",
  "phone_number": "555-5678",
  "role_title": "Senior Cleaner",
  "permissions": ["view_bookings", "update_bookings"]
}
```

**Response:** 201 Created

### GET /staff

List all staff members.

**Permission:** Staff or Admin

**Query Parameters:**
- `active_only` (optional): true/false (default: true)

**Response:** 200 OK
```json
[
  {
    "id": "uuid",
    "email": "staff@example.com",
    "username": "Jane Smith",
    "phone_number": "555-5678",
    "role": "staff",
    "role_title": "Senior Cleaner",
    "permissions": ["view_bookings", "update_bookings"],
    "status": "active",
    "joined_date": "2026-01-01T00:00:00",
    "last_active": "2026-02-14T12:00:00"
  }
]
```

### PATCH /staff/{staff_id}

Update staff member.

**Permission:** Staff or Admin

**Request Body:**
```json
{
  "status": "inactive",
  "role_title": "Team Lead"
}
```

---

## Forms

### POST /forms

Create a form.

**Permission:** Staff or Admin

**Request Body:**
```json
{
  "name": "Customer Satisfaction Survey",
  "customer_name": "John Doe",
  "booking_id": "uuid",
  "fields": 10,
  "template_data": {}
}
```

**Response:** 201 Created

### GET /forms

List all forms.

**Permission:** Staff or Admin

**Query Parameters:**
- `status` (optional): pending, completed, overdue

### PATCH /forms/{form_id}

Update form.

**Permission:** Any authenticated user

**Request Body:**
```json
{
  "status": "completed",
  "completed_fields": 10,
  "submitted_at": "2026-02-14T12:00:00",
  "form_data": {}
}
```

---

## Analytics

### GET /analytics/dashboard

Get dashboard statistics.

**Permission:** Staff or Admin

**Response:** 200 OK
```json
{
  "total_bookings": 150,
  "pending_bookings": 23,
  "completed_bookings": 78,
  "total_revenue": 9360.00,
  "total_contacts": 245,
  "active_staff": 12,
  "low_stock_items": 3,
  "overdue_forms": 5
}
```

### GET /analytics/revenue

Get revenue statistics.

**Permission:** Staff or Admin

**Response:** 200 OK
```json
{
  "total": 45600.00,
  "this_month": 4200.00,
  "last_month": 3800.00,
  "growth_percentage": 10.53
}
```

### GET /analytics/bookings/by-status

Get booking counts by status.

**Response:** 200 OK
```json
{
  "pending": 23,
  "confirmed": 45,
  "completed": 78,
  "cancelled": 4
}
```

### GET /analytics/bookings/by-service

Get booking counts by service.

**Response:** 200 OK
```json
{
  "House Cleaning": 85,
  "Carpet Cleaning": 32,
  "Window Cleaning": 25,
  "Deep Cleaning": 8
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Requires admin role"
}
```

### 404 Not Found
```json
{
  "detail": "Booking not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

All endpoints are rate limited to prevent abuse:
- Authentication endpoints: 5 requests/minute
- Read endpoints: 100 requests/minute
- Write endpoints: 30 requests/minute

---

## Pagination

For endpoints returning lists, use query parameters:
- `limit`: Number of items per page (default: 50, max: 100)
- `offset`: Number of items to skip (default: 0)

Example: `GET /bookings?limit=20&offset=40`

---

## Testing

Use the interactive API documentation at `/docs` to test all endpoints with a built-in UI.

Or use curl:
```bash
# Get token
TOKEN=$(curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@careops.com","password":"admin123456"}' \
  | jq -r '.access_token')

# Use token
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/bookings
```

---

**For full interactive documentation, visit `/docs` when server is running.**
