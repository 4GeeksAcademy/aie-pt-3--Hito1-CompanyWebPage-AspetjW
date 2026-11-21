"""
Idempotent seeder script for supplier initial data.
Loads suppliers from BRIEFING.md without creating duplicates.
Execute: uv run seed.py
"""

import sys
from datetime import datetime
from tinydb import TinyDB, Query
from pathlib import Path

# Add parent directories to path
sys.path.insert(0, str(Path(__file__).parent))

from database import DB_PATH, db


def seed_suppliers() -> dict:
    """
    Load suppliers from BRIEFING.md into TinyDB.
    Returns dict with counts (inserted, skipped).
    """
    suppliers_table = db.table("suppliers")

    # Initial supplier data aligned with BRIEFING.md
    suppliers_data = [
        {
            "name": "Hospital Central HealthCore",
            "supplier_type": "HOSPITAL",
            "country": "USA",
            "category": "General",
            "npi": "1234567890",
            "specialties": ["Cardiology", "Emergency", "Orthopedics"],
            "rate": 250.00,
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        },
        {
            "name": "Clínica Pérez",
            "supplier_type": "CLINICA",
            "country": "Mexico",
            "category": "Specialty",
            "npi": "1234567891",
            "specialties": ["Neurology", "Psychiatry"],
            "rate": 150.00,
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        },
        {
            "name": "Laboratory DiagnosMed",
            "supplier_type": "LABORATORIO",
            "country": "USA",
            "category": "Diagnostics",
            "npi": "1234567892",
            "specialties": ["Blood Tests", "Imaging", "Pathology"],
            "rate": 75.50,
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        },
        {
            "name": "Pharma Solutions Inc.",
            "supplier_type": "FARMACIA",
            "country": "USA",
            "category": "Pharmacy",
            "npi": "1234567893",
            "specialties": ["Prescription", "Generic", "Specialty Drugs"],
            "rate": 25.75,
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        },
        {
            "name": "Dr. Especialista López",
            "supplier_type": "ESPECIALISTA",
            "country": "Mexico",
            "category": "Consultation",
            "npi": "1234567894",
            "specialties": ["Cardiology", "Internal Medicine"],
            "rate": 120.00,
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        },
    ]

    # Idempotent insert: check for duplicates by NPI before inserting
    Supplier = Query()
    inserted_count = 0
    skipped_count = 0

    for supplier in suppliers_data:
        existing = suppliers_table.search(Supplier.npi == supplier["npi"])
        if not existing:
            suppliers_table.insert(supplier)
            inserted_count += 1
            print(f"✅ Inserted: {supplier['name']} (NPI: {supplier['npi']})")
        else:
            skipped_count += 1
            print(f"⏭️  Skipped (exists): {supplier['name']} (NPI: {supplier['npi']})")

    return {
        "inserted": inserted_count,
        "skipped": skipped_count,
        "total": len(suppliers_data),
    }


def main():
    """Main entry point for seed script."""
    print("\n📋 HealthCore Supplier Seeder\n")
    print(f"Database path: {DB_PATH}\n")

    try:
        results = seed_suppliers()
        print("\n" + "=" * 50)
        print(f"✅ Seed completed successfully!")
        print(f"   Inserted: {results['inserted']}")
        print(f"   Skipped:  {results['skipped']}")
        print(f"   Total:    {results['total']}")
        print("=" * 50 + "\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Seed failed: {str(e)}\n", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
