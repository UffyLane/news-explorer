from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./news_explorer.db"
    jwt_secret: str = "dev-secret-change-this-later"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7
    news_api_key: str = ""
    anthropic_api_key: str = ""
    summary_model: str = "claude-haiku-4-5-20251001"

    class Config:
        env_file = ".env"


settings = Settings()