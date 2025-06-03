import os
import secrets

class Config:
    DEBUG = False
    DEVELOPMENT = False
    
    @staticmethod
    def generate_secret_key():
        """Generate a secure random secret key."""
        return secrets.token_hex(32)
    
    # Use environment variable if set, otherwise generate a new key
    # In production, ALWAYS set FLASK_SECRET_KEY environment variable
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', generate_secret_key.__func__())

class ProductionConfig(Config):
    # Production should always use environment variable
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY')
    if not SECRET_KEY:
        raise ValueError("FLASK_SECRET_KEY environment variable must be set in production!")

class DevelopmentConfig(Config):
    DEBUG = True
    DEVELOPMENT = True