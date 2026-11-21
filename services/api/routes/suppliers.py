"""
FastAPI routes for Supplier CRUD operations.
Endpoints: GET, POST, PATCH, DELETE with filtering and validation.
"""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from tinydb import Query

from database import get_db
from models import (
    SupplierCreate,
    SupplierUpdate,
    SupplierRateUpdate,
    SupplierStatusUpdate,
    SupplierResponse,
)

router = APIRouter(prefix="/suppliers", tags=["suppliers"])


@router.post("", response_model=SupplierResponse, status_code=201)
def create_supplier(supplier: SupplierCreate) -> SupplierResponse:
    """
    Create a new supplier.
    Returns 201 on success, 422 on validation error.
    """
    db = get_db()
    suppliers_table = db.table("suppliers")

    # Create supplier document
    supplier_doc = {
        "name": supplier.name,
        "supplier_type": supplier.supplier_type.value,
        "country": supplier.country,
        "category": supplier.category,
        "npi": supplier.npi,
        "specialties": supplier.specialties,
        "rate": supplier.rate,
        "status": supplier.status.value,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

    supplier_id = suppliers_table.insert(supplier_doc)

    return SupplierResponse(id=supplier_id, **supplier_doc)


@router.get("", response_model=list[SupplierResponse])
def list_suppliers(
    country: Optional[str] = Query(None, description="Filter by country"),
    category: Optional[str] = Query(None, description="Filter by category"),
) -> list[SupplierResponse]:
    """
    List all suppliers with optional filters.
    Query params: country, category
    """
    db = get_db()
    suppliers_table = db.table("suppliers")

    # Fetch all suppliers
    all_suppliers = suppliers_table.all()

    # Apply filters
    if country:
        all_suppliers = [s for s in all_suppliers if s.get("country") == country]
    if category:
        all_suppliers = [s for s in all_suppliers if s.get("category") == category]

    # Convert to SupplierResponse
    return [
        SupplierResponse(id=doc.doc_id, **doc) for doc in all_suppliers
    ]


@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier(supplier_id: int) -> SupplierResponse:
    """
    Get a specific supplier by ID.
    Returns 404 if not found.
    """
    db = get_db()
    suppliers_table = db.table("suppliers")

    supplier = suppliers_table.get(doc_id=supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    return SupplierResponse(id=supplier_id, **supplier)


@router.patch("/{supplier_id}", response_model=SupplierResponse)
def update_supplier(
    supplier_id: int, update_data: SupplierUpdate
) -> SupplierResponse:
    """
    Update supplier fields.
    Only provided fields are updated.
    """
    db = get_db()
    suppliers_table = db.table("suppliers")

    supplier = suppliers_table.get(doc_id=supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    # Build update dict (only non-None fields)
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.now().isoformat()

    suppliers_table.update(update_dict, doc_ids=[supplier_id])

    # Fetch updated supplier
    updated = suppliers_table.get(doc_id=supplier_id)
    return SupplierResponse(id=supplier_id, **updated)


@router.patch("/{supplier_id}/rate", response_model=SupplierResponse)
def update_supplier_rate(
    supplier_id: int, rate_update: SupplierRateUpdate
) -> SupplierResponse:
    """
    Update supplier rate only.
    Rate must be > 0 (validated by Pydantic).
    """
    db = get_db()
    suppliers_table = db.table("suppliers")

    supplier = suppliers_table.get(doc_id=supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    update_dict = {
        "rate": rate_update.rate,
        "updated_at": datetime.now().isoformat(),
    }

    suppliers_table.update(update_dict, doc_ids=[supplier_id])
    updated = suppliers_table.get(doc_id=supplier_id)

    return SupplierResponse(id=supplier_id, **updated)


@router.patch("/{supplier_id}/status", response_model=SupplierResponse)
def update_supplier_status(
    supplier_id: int, status_update: SupplierStatusUpdate
) -> SupplierResponse:
    """
    Update supplier status (active/suspended).
    """
    db = get_db()
    suppliers_table = db.table("suppliers")

    supplier = suppliers_table.get(doc_id=supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    update_dict = {
        "status": status_update.status.value,
        "updated_at": datetime.now().isoformat(),
    }

    suppliers_table.update(update_dict, doc_ids=[supplier_id])
    updated = suppliers_table.get(doc_id=supplier_id)

    return SupplierResponse(id=supplier_id, **updated)


@router.delete("/{supplier_id}", status_code=204)
def delete_supplier(supplier_id: int) -> None:
    """
    Delete a supplier by ID.
    Returns 204 on success, 404 if not found.
    """
    db = get_db()
    suppliers_table = db.table("suppliers")

    supplier = suppliers_table.get(doc_id=supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    suppliers_table.remove(doc_ids=[supplier_id])
