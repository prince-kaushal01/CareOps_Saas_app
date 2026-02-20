# CareOps Backend Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Supabase Configuration](#supabase-configuration)
3. [Production Deployment](#production-deployment)
4. [Environment Variables](#environment-variables)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Local Development

### Prerequisites
- Python 3.9+
- pip
- Virtual environment tool
- Supabase account

### Setup Steps

1. **Clone and navigate to project**
```bash
cd careops-backend
```

2. **Create virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate  # Windows
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your values
```

5. **Run server**
```bash
uvicorn app.main:app --reload
```

---

## Supabase Configuration

### 1. Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization
4. Enter project details:
   - Name: careops-api
   - Database Password: (save this securely)
   - Region: (closest to your users)
5. Wait 2-3 minutes for provisioning

### 2. Get API Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: For client-side
   - **service_role key**: For server-side (keep secret!)

### 3. Run Database Migration

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy contents from `database/migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. Verify tables created: **Database** → **Tables**

Expected tables:
- users
- bookings
- contacts
- inventory
- forms
- conversations
- messages

### 4. Verify Sample Data

Run this query in SQL Editor:
```sql
SELECT * FROM users WHERE email = 'admin@careops.com';
SELECT COUNT(*) FROM bookings;
SELECT COUNT(*) FROM inventory;
```

You should see:
- 1 admin user
- 3 sample bookings
- 4 inventory items

---

## Production Deployment

### Option 1: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and init**
```bash
railway login
railway init
```

3. **Add environment variables**
```bash
railway vars set SUPABASE_URL=https://xxx.supabase.co
railway vars set SUPABASE_KEY=your-key
railway vars set SUPABASE_SERVICE_KEY=your-service-key
railway vars set SECRET_KEY=your-secret-key
railway vars set ALLOWED_ORIGINS=https://yourfrontend.com
```

4. **Deploy**
```bash
railway up
```

5. **Get URL**
```bash
railway domain
```

### Option 2: Render

1. **Create account** at [render.com](https://render.com)

2. **New Web Service**
   - Connect your Git repository
   - Or upload code

3. **Configuration**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**
   - Add all variables from .env.example
   - Set DEBUG=False

5. **Deploy**
   - Click "Create Web Service"

### Option 3: Docker

1. **Create Dockerfile**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Build image**
```bash
docker build -t careops-api .
```

3. **Run container**
```bash
docker run -p 8000:8000 --env-file .env careops-api
```

4. **Deploy to cloud**
   - Push to Docker Hub
   - Deploy to AWS ECS/Fargate
   - Or use Digital Ocean App Platform

### Option 4: Vercel (Serverless)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Create vercel.json**
```json
{
  "builds": [
    {
      "src": "app/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app/main.py"
    }
  ]
}
```

3. **Deploy**
```bash
vercel --prod
```

---

## Environment Variables

### Required Variables

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJxxx...
SUPABASE_SERVICE_KEY=eyJxxx...

# JWT
SECRET_KEY=min-32-chars-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS
ALLOWED_ORIGINS=https://app.example.com,https://www.example.com

# App
APP_NAME=CareOps API
APP_VERSION=1.0.0
DEBUG=False
```

### Security Best Practices

1. **Never commit .env to git**
```bash
echo ".env" >> .gitignore
```

2. **Use different keys per environment**
- Development: test keys
- Staging: staging keys
- Production: production keys

3. **Rotate secrets regularly**
- Change SECRET_KEY quarterly
- Rotate database passwords

4. **Use secrets managers**
- AWS Secrets Manager
- Google Secret Manager
- HashiCorp Vault

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check API status
curl https://your-api.com/health

# Check docs
curl https://your-api.com/docs
```

### Logging

**Structured logging:**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

**Log to file:**
```bash
uvicorn app.main:app --log-config logging.yaml
```

### Database Backups

**Supabase automatic backups:**
- Daily automatic backups (retained 7 days on Free tier)
- Upgrade to Pro for point-in-time recovery

**Manual backup:**
1. Go to Supabase Dashboard
2. Database → Backups
3. Download backup

### Performance Monitoring

**Add middleware:**
```python
import time
from fastapi import Request

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

**Use monitoring services:**
- Sentry for error tracking
- New Relic for APM
- Datadog for metrics

### Rate Limiting

**Install slowapi:**
```bash
pip install slowapi
```

**Add to app:**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/endpoint")
@limiter.limit("5/minute")
async def endpoint():
    return {"message": "Rate limited"}
```

---

## Troubleshooting

### Common Issues

**1. Database connection timeout**
```
Solution: Check Supabase project is not paused
Verify network connectivity
Check SUPABASE_URL is correct
```

**2. Authentication errors**
```
Solution: Verify SECRET_KEY is set
Check token expiration
Ensure SUPABASE_SERVICE_KEY is correct
```

**3. CORS errors in production**
```
Solution: Add production frontend URL to ALLOWED_ORIGINS
Remove trailing slashes
Include both www and non-www versions
```

**4. High memory usage**
```
Solution: Use connection pooling
Limit concurrent workers
Optimize database queries
```

### Debug Mode

**Enable detailed logging:**
```env
DEBUG=True
```

**Check logs:**
```bash
# Railway
railway logs

# Render
Check Logs tab in dashboard

# Docker
docker logs <container-id>
```

---

## Scaling

### Horizontal Scaling

**Load balancer:**
```
Frontend → Load Balancer → [API Instance 1, API Instance 2, ...]
                                    ↓
                              Supabase Database
```

**Auto-scaling configuration:**
- Min instances: 2
- Max instances: 10
- CPU threshold: 70%
- Memory threshold: 80%

### Database Optimization

**Indexes:**
```sql
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
```

**Connection pooling:**
```python
from sqlalchemy import create_engine
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=0
)
```

### Caching

**Redis caching:**
```bash
pip install redis
```

```python
import redis
cache = redis.Redis(host='localhost', port=6379, db=0)

@app.get("/cached-data")
async def get_cached():
    data = cache.get("key")
    if not data:
        data = fetch_from_db()
        cache.setex("key", 3600, data)
    return data
```

---

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong SECRET_KEY (32+ chars)
- [ ] Enable HTTPS only
- [ ] Set DEBUG=False in production
- [ ] Configure CORS properly
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Regular security updates
- [ ] Database backups enabled
- [ ] API key rotation schedule
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using ORM)
- [ ] XSS prevention
- [ ] CSRF protection

---

## Maintenance Schedule

**Daily:**
- Check error logs
- Monitor API response times

**Weekly:**
- Review database performance
- Check disk usage
- Update dependencies if needed

**Monthly:**
- Rotate API keys
- Review access logs
- Database optimization

**Quarterly:**
- Security audit
- Update SECRET_KEY
- Review and update documentation

---

## Support

For deployment issues:
1. Check deployment platform docs
2. Review application logs
3. Verify environment variables
4. Test database connectivity

**Emergency contacts:**
- Supabase Status: https://status.supabase.com
- FastAPI Discord: https://discord.gg/fastapi

---

**Happy Deploying! 🚀**
