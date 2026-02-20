from supabase import create_client, Client
from .config import settings
from fastapi import Depends

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

def get_supabase() -> Client:
    """Dependency to get Supabase client"""
    return supabase

def get_supabase_admin() -> Client:
    """Dependency to get Supabase admin client"""
    return supabase_admin
