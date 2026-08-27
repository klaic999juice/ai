#!/usr/bin/env python
"""Setup script for Retired AI"""

import os
import sys
from pathlib import Path

def setup():
    """Setup the application"""
    print("🚀 Setting up Retired AI...")
    
    # Check Python version
    if sys.version_info < (3, 9):
        print("❌ Python 3.9+ required")
        sys.exit(1)
    
    print("✅ Python version OK")
    
    # Check if .env exists
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  .env file not found")
        env_example = Path(".env.example")
        if env_example.exists():
            import shutil
            shutil.copy(env_example, env_file)
            print("📋 Created .env from .env.example")
            print("⚠️  Please edit .env and add your OpenAI API key")
        else:
            print("❌ .env.example not found")
            sys.exit(1)
    else:
        print("✅ .env file found")
    
    # Create directories
    Path("backend").mkdir(exist_ok=True)
    Path("frontend").mkdir(exist_ok=True)
    Path("frontend/css").mkdir(exist_ok=True)
    Path("frontend/js").mkdir(exist_ok=True)
    print("✅ Directory structure OK")
    
    print("\n✨ Setup complete!")
    print("\nNext steps:")
    print("1. Edit .env and add your OpenAI API key")
    print("2. Install dependencies: pip install -r requirements.txt")
    print("3. Run the app: python backend/main.py")
    print("4. Open http://localhost:8000/static/index.html")

if __name__ == "__main__":
    setup()
