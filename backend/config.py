from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    
    # CORS
    ALLOWED_ORIGINS: str = "https://careops-01.netlify.app/"
    
    # App
    APP_NAME: str = "CareOps API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    class Config:
        env_file = "C:\\Users\\palya\\Desktop\\CareOps SaaS Web App UI\\backend\\.env"
        case_sensitive = True

settings = Settings()
