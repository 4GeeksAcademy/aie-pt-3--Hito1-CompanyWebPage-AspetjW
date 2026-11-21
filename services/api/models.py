"""
Pydantic models and validation schemas for Supplier Directory.
Defines Enums, DTOs, and business rule validators.
"""

from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, validator


class SupplierStatus(str, Enum):
    """Allowed supplier status values."""
    ACTIVE = "active"
    SUSPENDED = "suspended"


class SupplierType(str, Enum):
    """Allowed supplier types from BRIEFING.md."""
    HOSPITAL = "HOSPITAL"
    CLINICA = "CLINICA"
    LABORATORIO = "LABORATORIO"
    FARMACIA = "FARMACIA"
    ESPECIALISTA = "ESPECIALISTA"


class SupplierCreate(BaseModel):
    """Schema for creating a supplier."""
    name: str = Field(..., min_length=1, max_length=200)
    supplier_type: SupplierType
    country: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=100)
    npi: str = Field(..., min_length=10, max_length=10)
    specialties: list[str] = Field(..., min_items=1)
    rate: float = Field(..., gt=0)
    status: SupplierStatus = SupplierStatus.ACTIVE

    @validator("npi")
    def validate_npi(cls, v):
        """Validate NPI is numeric and exactly 10 digits."""
        if not v.isdigit() or len(v) != 10:
            raise ValueError("NPI must be exactly 10 numeric digits")
        return v

    @validator("specialties")
    def validate_specialties(cls, v):
        """Validate specialties are non-empty strings."""
        if not all(isinstance(s, str) and len(s) > 0 for s in v):
            raise ValueError("All specialties must be non-empty strings")
        return v


class SupplierUpdate(BaseModel):
    """Schema for updating supplier fields."""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    country: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    specialties: Optional[list[str]] = Field(None, min_items=1)

    @validator("specialties")
    def validate_specialties(cls, v):
        """Validate specialties are non-empty strings."""
        if v and not all(isinstance(s, str) and len(s) > 0 for s in v):
            raise ValueError("All specialties must be non-empty strings")
        return v


class SupplierRateUpdate(BaseModel):
    """Schema for updating supplier rate only."""
    rate: float = Field(..., gt=0, description="Rate must be greater than 0")


class SupplierStatusUpdate(BaseModel):
    """Schema for updating supplier status only."""
    status: SupplierStatus


class SupplierResponse(BaseModel):
    """Schema for supplier response (includes server-generated fields)."""
    id: int
    name: str
    supplier_type: SupplierType
    country: str
    category: str
    npi: str
    specialties: list[str]
    rate: float
    status: SupplierStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Hospital Central",
                "supplier_type": "HOSPITAL",
                "country": "USA",
                "category": "Emergency",
                "npi": "1234567890",
                "specialties": ["Cardiology", "Emergency"],
                "rate": 150.50,
                "status": "active",
                "created_at": "2024-11-21T10:00:00",
                "updated_at": "2024-11-21T10:00:00"
            }
        }
