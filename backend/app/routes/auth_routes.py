from fastapi import APIRouter, HTTPException, status, Depends
from  schemas import UserCreate, UserLogin, Token, UserResponse
from  database import get_supabase, get_supabase_admin
from  auth import get_password_hash, verify_password, create_access_token, get_current_user
from supabase import Client #type: ignore
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(
    user: UserCreate,
    supabase: Client = Depends(get_supabase_admin)
):
    """Register a new user"""
    try:
        # Check if user already exists
        existing = supabase.table("users").select("*").eq("email", user.email).execute()
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        user_id = str(uuid.uuid4())
        hashed_password = get_password_hash(user.password)
        
        user_data = {
            "id": user_id,
            "email": user.email,
            "password_hash": hashed_password,
            "username": user.username,
            "phone_number": user.phone_number,
            "role": user.role.value,
        }
        
        result = supabase.table("users").insert(user_data).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        created_user = result.data[0]
        
        # Create access token
        access_token = create_access_token(
            data={"sub": created_user["email"], "user_id": created_user["id"]}
        )
        
        # Prepare response
        user_response = UserResponse(
            id=created_user["id"],
            email=created_user["email"],
            username=created_user["username"],
            phone_number=created_user.get("phone_number"),
            role=created_user["role"],
            created_at=created_user.get("created_at")
        )
        
        return Token(access_token=access_token, user=user_response)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    supabase: Client = Depends(get_supabase)
):
    """Login user and return access token"""
    try:
        # Get user by email
        result = supabase.table("users").select("*").eq("email", credentials.email).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        user = result.data[0]
        
        # Verify password
        if not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Update last login
        supabase.table("users").update({
            "last_login": "now()"
        }).eq("id", user["id"]).execute()
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user["email"], "user_id": user["id"]}
        )
        
        # Prepare response
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            username=user["username"],
            phone_number=user.get("phone_number"),
            role=user["role"],
            created_at=user.get("created_at")
        )
        
        return Token(access_token=access_token, user=user_response)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        username=current_user["username"],
        phone_number=current_user.get("phone_number"),
        role=current_user["role"],
        created_at=current_user.get("created_at")
    )

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user (client-side token removal)"""
    return {"message": "Successfully logged out"}
