"""
Bisheshoggo AI - Development Server Runner
"""
import sys
import os

# Fix Windows encoding issues
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    os.environ['PYTHONIOENCODING'] = 'utf-8'

import uvicorn
from app.database import init_db
from app.seed import seed_database

if __name__ == "__main__":
    print("=" * 50)
    print("Bisheshoggo AI - Expert Healthcare Platform")
    print("=" * 50)
    
    # Initialize database
    print("[*] Initializing database...")
    init_db()
    
    # Seed with sample data
    print("[*] Seeding sample data...")
    seed_database()
    
    print("")
    print("[+] Starting server at http://localhost:8000")
    print("[+] API Docs: http://localhost:8000/docs")
    print("=" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
