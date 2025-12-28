"""
Bisheshoggo AI - Database Seeder
Run this to populate the database with medical facilities only
"""
from sqlalchemy.orm import Session
from .database import SessionLocal, init_db
from .models import MedicalFacility, FacilityType


def seed_database():
    """Seed the database with medical facilities only (no demo users)"""
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(MedicalFacility).first():
            print("[*] Database already seeded!")
            return
        
        print("[*] Seeding database with medical facilities...")
        
        # Create medical facilities
        facilities = [
            MedicalFacility(
                name="Bandarban Sadar Hospital",
                facility_type=FacilityType.hospital,
                phone="+880361-62233",
                address="Hospital Road, Bandarban Sadar",
                district="Bandarban",
                division="Chittagong",
                latitude=22.1953,
                longitude=92.2184,
                operating_hours="24/7",
                services_offered=["Emergency", "General Medicine", "Surgery", "Maternity"],
                has_ambulance=True,
                has_emergency=True,
                is_active=True
            ),
            MedicalFacility(
                name="Thanchi Upazila Health Complex",
                facility_type=FacilityType.clinic,
                phone="+880361-75012",
                address="Thanchi Upazila, Bandarban",
                district="Bandarban",
                division="Chittagong",
                latitude=21.9167,
                longitude=92.4667,
                operating_hours="8:00 AM - 8:00 PM",
                services_offered=["General Medicine", "Vaccination", "Family Planning"],
                has_ambulance=False,
                has_emergency=True,
                is_active=True
            ),
            MedicalFacility(
                name="Ruma Community Clinic",
                facility_type=FacilityType.clinic,
                phone="+880361-76234",
                address="Ruma Sadar, Bandarban",
                district="Bandarban",
                division="Chittagong",
                latitude=22.0167,
                longitude=92.4000,
                operating_hours="9:00 AM - 5:00 PM",
                services_offered=["Primary Care", "First Aid", "Health Education"],
                has_ambulance=False,
                has_emergency=False,
                is_active=True
            ),
            MedicalFacility(
                name="Bandarban Pharmacy",
                facility_type=FacilityType.pharmacy,
                phone="+880361-63000",
                address="Main Road, Bandarban Sadar",
                district="Bandarban",
                division="Chittagong",
                latitude=22.1960,
                longitude=92.2190,
                operating_hours="8:00 AM - 10:00 PM",
                services_offered=["Prescription Medicines", "OTC Medicines", "Medical Supplies"],
                has_ambulance=False,
                has_emergency=False,
                is_active=True
            ),
            MedicalFacility(
                name="Khagrachari District Hospital",
                facility_type=FacilityType.hospital,
                phone="+880371-61234",
                address="Hospital Road, Khagrachari Sadar",
                district="Khagrachari",
                division="Chittagong",
                latitude=23.1193,
                longitude=91.9847,
                operating_hours="24/7",
                services_offered=["Emergency", "General Medicine", "Pediatrics", "Gynecology"],
                has_ambulance=True,
                has_emergency=True,
                is_active=True
            ),
            MedicalFacility(
                name="Rangamati General Hospital",
                facility_type=FacilityType.hospital,
                phone="+880351-62345",
                address="Hospital Road, Rangamati Sadar",
                district="Rangamati",
                division="Chittagong",
                latitude=22.6372,
                longitude=92.2061,
                operating_hours="24/7",
                services_offered=["Emergency", "General Medicine", "Surgery", "Diagnostics"],
                has_ambulance=True,
                has_emergency=True,
                is_active=True
            ),
        ]
        
        db.add_all(facilities)
        db.commit()
        
        print("[+] Database seeded successfully!")
        print(f"[+] Created {len(facilities)} medical facilities")
        print("")
        print("✅ No demo users created")
        print("📝 Please sign up to create your account")
        print("")
        
    except Exception as e:
        db.rollback()
        print(f"[-] Error seeding database: {e}")
    finally:
        db.close()
