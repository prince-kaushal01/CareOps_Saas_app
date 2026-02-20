# 🚀 CareOps Backend - Complete Setup Guide

**Welcome!** This guide will walk you through setting up the complete CareOps backend from scratch.

## 📋 What You're Building

A production-ready FastAPI backend with:
- ✅ Complete CRUD operations for Bookings, Contacts, Inventory, Staff, Forms
- ✅ JWT Authentication with role-based access
- ✅ Supabase PostgreSQL database
- ✅ Auto-generated API documentation
- ✅ Sample data included

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Python

**Check if you have Python 3.9+:**
```bash
python3 --version
```

**If not installed:**
- **Mac**: `brew install python3`
- **Ubuntu**: `sudo apt install python3 python3-pip`
- **Windows**: Download from [python.org](https://python.org)

### Step 2: Run Setup Script

```bash
# Make script executable (Mac/Linux)
chmod +x setup.sh

# Run setup
./setup.sh
```

This will:
- Create virtual environment
- Install all dependencies
- Create .env file

### Step 3: Setup Supabase (2 Minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: `careops-backend`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait 2-3 minutes for setup

**Get your credentials:**
1. Go to Settings → API
2. Copy:
   - Project URL
   - anon/public key
   - service_role key (secret!)

### Step 4: Configure Environment

Edit `.env` file:
```bash
nano .env  # or use any text editor
```

Add your Supabase credentials:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
SECRET_KEY=use-openssl-rand-hex-32-to-generate
```

**Generate SECRET_KEY:**
```bash
openssl rand -hex 32
```

### Step 5: Create Database Tables

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Click "New Query"
4. Copy entire contents of `database/migrations/001_initial_schema.sql`
5. Paste and click "Run"

You should see: ✅ Success. No rows returned

**Verify tables created:**
1. Go to "Database" → "Tables"
2. You should see: users, bookings, contacts, inventory, forms

### Step 6: Start Server

```bash
# Activate virtual environment
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate  # Windows

# Start server
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Step 7: Test API

Open browser to: http://localhost:8000/docs

You should see interactive API documentation!

**Try it out:**
1. Scroll to `POST /auth/login`
2. Click "Try it out"
3. Use credentials:
   ```json
   {
     "email": "admin@careops.com",
     "password": "admin123456"
   }
   ```
4. Click "Execute"
5. You should get an access token!

---

## 🎯 Connect to Frontend

### Update Frontend API URL

In your frontend code, set API URL to:
```typescript
const API_URL = "http://localhost:8000";
```

### Enable CORS

Already configured! Your .env has:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Add your frontend URL if different.

### Test Connection

```bash
# From frontend, try:
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)

# Should return: {status: "healthy"}
```

---

## 📊 Explore the Data

### Sample Data Included

The migration creates:
- **1 Admin user**
  - Email: admin@careops.com
  - Password: admin123456
- **3 Sample bookings**
- **3 Sample contacts**
- **4 Inventory items**

### View in Supabase

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select table (users, bookings, etc.)
4. See your data!

### Add More Data

Use the API docs at `/docs` to:
- Create new bookings
- Add contacts
- Register users
- Update inventory

---

## 🔐 Security Setup

### Change Admin Password

**Important!** Change the default admin password:

```bash
# Using API
curl -X PATCH http://localhost:8000/users/admin-id \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"password": "new-secure-password"}'
```

Or create a new admin account and delete the default one.

### Rotate SECRET_KEY

```bash
# Generate new key
openssl rand -hex 32

# Update in .env
SECRET_KEY=your-new-key-here

# Restart server
```

---

## 🧪 Testing Endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@careops.com","password":"admin123456"}'

# Create booking (replace TOKEN)
curl -X POST http://localhost:8000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "customer_name": "John Doe",
    "service": "House Cleaning",
    "date": "2026-02-20",
    "time": "10:00 AM",
    "location": "123 Main St"
  }'

# Get all bookings
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/bookings
```

### Using Python Requests

```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/auth/login",
    json={
        "email": "admin@careops.com",
        "password": "admin123456"
    }
)
token = response.json()["access_token"]

# Use token
headers = {"Authorization": f"Bearer {token}"}
bookings = requests.get(
    "http://localhost:8000/bookings",
    headers=headers
).json()
print(bookings)
```

---

## 📱 API Endpoints Reference

### Quick Reference

| Endpoint | Method | Permission | Description |
|----------|--------|------------|-------------|
| `/auth/register` | POST | Public | Register user |
| `/auth/login` | POST | Public | Login |
| `/auth/me` | GET | Any | Get profile |
| `/bookings` | GET | Staff/Admin | List bookings |
| `/bookings` | POST | Any | Create booking |
| `/bookings/{id}` | PATCH | Staff/Admin | Update booking |
| `/bookings/{id}` | DELETE | Staff/Admin | Delete booking |
| `/contacts` | GET/POST | Staff/Admin | Manage contacts |
| `/inventory` | GET/POST | Staff/Admin | Manage inventory |
| `/inventory/alerts` | GET | Staff/Admin | Low stock alerts |
| `/staff` | GET/POST | Staff/Admin | Manage staff |
| `/forms` | GET/POST | Staff/Admin | Manage forms |
| `/analytics/dashboard` | GET | Staff/Admin | Dashboard stats |

**Full API Reference:** See `API_REFERENCE.md`

---

## 🐛 Troubleshooting

### "Module not found" Error

```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### "Database connection failed"

```bash
# Check SUPABASE_URL in .env
# Make sure it starts with https://

# Verify project is not paused in Supabase dashboard
```

### "Authentication failed"

```bash
# Check SECRET_KEY is set in .env
# Verify migrations ran successfully
# Try logging in with default admin credentials
```

### "CORS error from frontend"

```bash
# Add frontend URL to .env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,YOUR_URL

# Restart server
```

### Port 8000 already in use

```bash
# Use different port
uvicorn app.main:app --reload --port 8001

# Update frontend API URL accordingly
```

---

## 📈 Next Steps

### 1. Customize for Your Needs

**Add new fields to bookings:**
```sql
-- In Supabase SQL Editor
ALTER TABLE bookings ADD COLUMN priority VARCHAR(20);
```

**Update schema in code:**
```python
# In app/schemas.py
class BookingCreate(BaseModel):
    # ... existing fields ...
    priority: Optional[str] = None
```

### 2. Add More Features

- Email notifications
- SMS reminders
- File uploads
- Payment processing
- Reporting

### 3. Deploy to Production

See `DEPLOYMENT.md` for detailed deployment guides for:
- Railway
- Render
- Docker
- Vercel

---

## 📚 Documentation

- **README.md** - Project overview
- **API_REFERENCE.md** - Complete API documentation
- **DEPLOYMENT.md** - Deployment guides
- **Interactive Docs** - http://localhost:8000/docs

---

## 🤝 Support

**Something not working?**

1. Check logs for errors
2. Verify environment variables
3. Test database connection
4. Review this guide again

**Common commands:**
```bash
# View logs
tail -f logs/api.log

# Test database
python -c "from app.database import supabase; print(supabase.table('users').select('count').execute())"

# Restart server
# Press Ctrl+C, then
uvicorn app.main:app --reload
```

---

## ✅ Checklist

Before going to production:

- [ ] Changed default admin password
- [ ] Generated new SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Configured CORS properly
- [ ] Set up database backups
- [ ] Tested all endpoints
- [ ] Added monitoring
- [ ] Secured API keys
- [ ] Reviewed security settings

---

## 🎉 Congratulations!

You now have a fully functional CareOps backend!

**What you can do:**
- ✅ User authentication and authorization
- ✅ Manage bookings, contacts, inventory
- ✅ Staff and form management
- ✅ Real-time analytics
- ✅ Auto-generated API docs

**Next:** Connect your frontend and start building! 🚀

---

**Questions?** Review the documentation files or open an issue.

**Happy coding!** 💻
