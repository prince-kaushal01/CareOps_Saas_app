# CareOps Backend API

Complete FastAPI backend with Supabase integration for the CareOps SaaS application.

## Features

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Admin, Staff, Customer)
- Secure password hashing with bcrypt

✅ **Complete CRUD Operations**
- Bookings management
- Contact management
- Inventory tracking
- Staff management
- Forms handling
- Analytics & reporting

✅ **Database**
- Supabase (PostgreSQL) integration
- Row Level Security (RLS)
- Automatic timestamps
- Database migrations

✅ **API Features**
- RESTful API design
- Auto-generated OpenAPI docs
- CORS support
- Request validation with Pydantic
- Comprehensive error handling

## Tech Stack

- **Framework**: FastAPI 0.110.0
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **Validation**: Pydantic v2
- **Python**: 3.9+

## Quick Start

### 1. Prerequisites

- Python 3.9 or higher
- Supabase account (free tier works)
- Git

### 2. Clone & Setup

```bash
# Clone the repository
cd careops-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to initialize (2-3 minutes)
3. Go to **Project Settings** → **API**
4. Copy:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

5. Go to **SQL Editor** in Supabase dashboard
6. Copy the contents of `database/migrations/001_initial_schema.sql`
7. Paste and run it in the SQL editor

### 4. Environment Configuration

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
nano .env  # or use any text editor
```

**Required configuration:**

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=your-anon-public-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# JWT Configuration
SECRET_KEY=your-super-secret-key-min-32-chars-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS (add your frontend URLs)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# App Configuration
APP_NAME=CareOps API
APP_VERSION=1.0.0
DEBUG=True
```

**Generate SECRET_KEY:**
```bash
# On Mac/Linux:
openssl rand -hex 32

# On Windows (PowerShell):
python -c "import secrets; print(secrets.token_hex(32))"
```

### 5. Run the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Default Credentials

**Admin Account** (created by migration):
- Email: `admin@careops.com`
- Password: `admin123456`

⚠️ **IMPORTANT**: Change this password immediately in production!

## API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication

All protected endpoints require a Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints Overview

#### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get token
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout (client-side)

#### Bookings (`/bookings`)
- `POST /bookings` - Create booking
- `GET /bookings` - List all bookings
- `GET /bookings/{id}` - Get specific booking
- `PATCH /bookings/{id}` - Update booking
- `DELETE /bookings/{id}` - Delete booking
- `GET /bookings/stats/summary` - Get booking statistics

#### Contacts (`/contacts`)
- `POST /contacts` - Create contact
- `GET /contacts` - List all contacts
- `GET /contacts/{id}` - Get specific contact
- `PATCH /contacts/{id}` - Update contact
- `DELETE /contacts/{id}` - Delete contact

#### Inventory (`/inventory`)
- `POST /inventory` - Add item
- `GET /inventory` - List items
- `GET /inventory/alerts` - Get low stock alerts
- `PATCH /inventory/{id}` - Update item
- `DELETE /inventory/{id}` - Delete item

#### Staff (`/staff`)
- `POST /staff` - Create staff member
- `GET /staff` - List all staff
- `GET /staff/{id}` - Get staff member
- `PATCH /staff/{id}` - Update staff member
- `DELETE /staff/{id}` - Deactivate staff

#### Forms (`/forms`)
- `POST /forms` - Create form
- `GET /forms` - List all forms
- `PATCH /forms/{id}` - Update form
- `DELETE /forms/{id}` - Delete form

#### Analytics (`/analytics`)
- `GET /analytics/dashboard` - Dashboard statistics
- `GET /analytics/revenue` - Revenue statistics
- `GET /analytics/bookings/by-status` - Bookings by status
- `GET /analytics/bookings/by-service` - Bookings by service

## Example Requests

### Register User

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "username": "John Doe",
    "phone_number": "555-1234",
    "role": "customer"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@careops.com",
    "password": "admin123456"
  }'
```

### Create Booking

```bash
curl -X POST http://localhost:8000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "555-1234",
    "service": "House Cleaning",
    "date": "2026-02-20",
    "time": "10:00 AM",
    "duration": "90 min",
    "location": "123 Main St",
    "notes": "Please bring vacuum"
  }'
```

### Get Dashboard Stats

```bash
curl -X GET http://localhost:8000/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Schema

### Tables

- **users** - User accounts with roles
- **bookings** - Service bookings
- **contacts** - Customer contacts
- **inventory** - Inventory items
- **forms** - Custom forms
- **conversations** - Message conversations
- **messages** - Individual messages

### Relationships

- Bookings → Users (assigned staff)
- Bookings → Users (created by)
- Forms → Bookings
- Messages → Conversations
- Messages → Users (sender)

## Testing

```bash
# Install pytest
pip install pytest httpx

# Run tests (create tests/ directory first)
pytest tests/

# Run with coverage
pytest --cov=app tests/
```

## Deployment

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build
docker build -t careops-api .

# Run
docker run -p 8000:8000 --env-file .env careops-api
```

### Production Checklist

- [ ] Change default admin password
- [ ] Use strong SECRET_KEY (32+ chars)
- [ ] Set DEBUG=False
- [ ] Use environment variables (never commit .env)
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Monitor API logs
- [ ] Rate limiting
- [ ] API versioning

## Project Structure

```
careops-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app
│   ├── config.py               # Configuration
│   ├── database.py             # Database connection
│   ├── auth.py                 # Authentication utilities
│   ├── schemas.py              # Pydantic models
│   └── routes/
│       ├── __init__.py
│       ├── auth_routes.py      # Auth endpoints
│       ├── booking_routes.py   # Booking endpoints
│       ├── contact_routes.py   # Contact endpoints
│       ├── inventory_routes.py # Inventory endpoints
│       ├── staff_routes.py     # Staff endpoints
│       ├── form_routes.py      # Form endpoints
│       └── analytics_routes.py # Analytics endpoints
├── database/
│   └── migrations/
│       └── 001_initial_schema.sql
├── requirements.txt
├── .env.example
└── README.md
```

## Troubleshooting

### Common Issues

**1. Database connection error**
```
Solution: Verify SUPABASE_URL and SUPABASE_KEY in .env
```

**2. Authentication fails**
```
Solution: Check if migrations ran successfully
Check if SECRET_KEY is set
```

**3. CORS errors**
```
Solution: Add your frontend URL to ALLOWED_ORIGINS in .env
```

**4. Import errors**
```
Solution: Make sure you're in the virtual environment
Run: pip install -r requirements.txt
```

## Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Review the database schema
3. Check logs for error details

## License

MIT License - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Built with ❤️ for CareOps SaaS Platform**
