from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicIntel API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "civicintel-super-secure-production-secret-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database: Supports SQLite for zero-config dev/test, PostgreSQL in production
    DATABASE_URL: str = "sqlite:///./civicintel.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    # Demonstration Mode Flag
    DEMONSTRATION_MODE: bool = True
    TESTING: bool = False

    # LLM Provider Configuration
    # Options: 'auto', 'groq', 'gemini', 'nvidia', 'mistral', 'openai', or 'deterministic'
    LLM_PROVIDER: str = "auto"
    
    # Google Gemini
    GEMINI_API_KEY: Union[str, None] = None
    GEMINI_MODEL: str = "gemini-1.5-pro"
    
    # Groq (Llama 3.3 70B, etc.)
    GROQ_API_KEY: Union[str, None] = None
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # NVIDIA NIM (Llama 3.1 70B, etc.)
    NVIDIA_API_KEY: Union[str, None] = None
    NVIDIA_MODEL: str = "meta/llama-3.1-70b-instruct"
    
    # Mistral AI (Mistral Large, etc.)
    MISTRAL_API_KEY: Union[str, None] = None
    MISTRAL_MODEL: str = "mistral-large-latest"

    # OpenAI (optional fallback)
    OPENAI_API_KEY: Union[str, None] = None
    OPENAI_MODEL: str = "gpt-4o"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()
