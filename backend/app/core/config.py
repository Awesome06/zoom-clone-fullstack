from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./zoom_clone.db"
    DEFAULT_HOST_NAME: str = "Arjun Bhatnagar"
    DEFAULT_HOST_EMAIL: str = "arjun@zoomclone.dev"

    class Config:
        env_file = ".env"


settings = Settings()
