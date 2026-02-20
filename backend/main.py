from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from app.routes import (
    auth_routes,
    booking_routes,
    contact_routes,
    inventory_routes,
    staff_routes,
    form_routes,
    analytics_routes,
    inbox_routes
)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Complete backend API for CareOps SaaS application",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins="https://careops-01.netlify.app/",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(booking_routes.router)
app.include_router(contact_routes.router)
app.include_router(inventory_routes.router)
app.include_router(staff_routes.router)
app.include_router(form_routes.router)
app.include_router(analytics_routes.router)
app.include_router(inbox_routes.router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
