import os

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key")
