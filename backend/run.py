"""
Bisheshoggo AI - Development Server Runner
"""
import uvicorn
from app.database import init_db
from app.seed import seed_database

if __name__ == "__main__":
    print("🏥 Bisheshoggo AI - বিশেষজ্ঞ AI")
    print("=" * 50)
    
    # Initialize database
    print("📦 Initializing database...")
    init_db()
    
    # Seed with sample data
    print("🌱 Seeding sample data...")
    seed_database()
    
    print("\n🚀 Starting server at http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("=" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

