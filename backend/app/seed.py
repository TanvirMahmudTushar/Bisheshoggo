"""
Bisheshoggo AI - Database Seeder
Run this to populate the database with sample data
"""
from sqlalchemy.orm import Session
from .database import SessionLocal, init_db
from .models import (
    User, PatientProfile, ProviderProfile, MedicalFacility,
    UserRole, FacilityType
)
from .auth import get_password_hash


def seed_database():
    """Seed the database with sample data"""
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(User).first():
            print("Database already seeded!")
            return
        
        print("🌱 Seeding database...")
        
        # Create sample users
        # Admin/Doctor
        doctor = User(
            email="doctor@bisheshoggo.ai",
            hashed_password=get_password_hash("doctor123"),
            full_name="Dr. Fatima Rahman",
            phone="+8801712345678",
            role=UserRole.doctor
        )
        db.add(doctor)
        db.flush()
        
        doctor_profile = ProviderProfile(
            user_id=doctor.id,
            specialization="General Medicine",
            license_number="BMDC-12345",
            qualification="MBBS, MD",
            years_of_experience=10,
            consultation_fee=500.00,
            available_for_telemedicine=True,
            is_available=True,
            languages=["Bengali", "English", "Chakma"],
            bio="Experienced general physician specializing in rural healthcare."
        )
        db.add(doctor_profile)
        
        # CHW (Community Health Worker)
        chw = User(
            email="chw@bisheshoggo.ai",
            hashed_password=get_password_hash("chw123"),
            full_name="Abdul Karim",
            phone="+8801812345679",
            role=UserRole.community_health_worker
        )
        db.add(chw)
        db.flush()
        
        chw_profile = ProviderProfile(
            user_id=chw.id,
            specialization="Community Health",
            qualification="CHW Certificate",
            years_of_experience=5,
            available_for_telemedicine=True,
            is_available=True,
            languages=["Bengali", "Marma"],
            bio="Community health worker serving Bandarban district."
        )
        db.add(chw_profile)
        
        # Patient
        patient = User(
            email="patient@bisheshoggo.ai",
            hashed_password=get_password_hash("patient123"),
            full_name="Rina Chakma",
            phone="+8801912345680",
            role=UserRole.patient
        )
        db.add(patient)
        db.flush()
        
        patient_profile = PatientProfile(
            user_id=patient.id,
            blood_group="O+",
            gender="Female",
            village="Ruma",
            district="Bandarban",
            division="Chittagong",
            medical_conditions=["Asthma"],
            allergies=["Penicillin"],
            current_medications=["Salbutamol Inhaler"]
        )
        db.add(patient_profile)
        
        # Create sample facilities
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
                name="Hill View Pharmacy",
                facility_type=FacilityType.pharmacy,
                phone="+880361-62456",
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
            )
        ]
        
        for facility in facilities:
            db.add(facility)
        
        db.commit()
        print("✅ Database seeded successfully!")
        print("\n📋 Sample Login Credentials:")
        print("   Doctor: doctor@bisheshoggo.ai / doctor123")
        print("   CHW: chw@bisheshoggo.ai / chw123")
        print("   Patient: patient@bisheshoggo.ai / patient123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    seed_database()

