"""Tests for supplier management endpoints."""

import pytest


class TestSuppliersCRUD:
    """Supplier CRUD operations and filtering"""
    
    def test_get_suppliers_happy_path(self, client, sample_supplier):
        """List suppliers (public endpoint)"""
        response = client.get("/api/suppliers")
        
        assert response.status_code == 200
        suppliers = response.json()
        assert isinstance(suppliers, list)
        assert len(suppliers) >= 1
        assert suppliers[0]["id"] == "supp-001"
    
    def test_get_suppliers_empty_list(self, client):
        """Empty suppliers list"""
        response = client.get("/api/suppliers")
        
        assert response.status_code == 200
        assert response.json() == []
    
    def test_get_suppliers_filter_by_country(self, client, sample_supplier):
        """Filter suppliers by country"""
        response = client.get("/api/suppliers?country=CO")
        
        assert response.status_code == 200
        suppliers = response.json()
        assert len(suppliers) >= 1
        assert all(s["country"] == "CO" for s in suppliers)
    
    def test_get_suppliers_filter_by_type(self, client, sample_supplier):
        """Filter suppliers by type"""
        response = client.get("/api/suppliers?type=LABORATORIO")
        
        assert response.status_code == 200
        suppliers = response.json()
        assert len(suppliers) >= 1
        assert all(s["type"] == "LABORATORIO" for s in suppliers)
    
    def test_get_suppliers_filter_nonexistent(self, client, sample_supplier):
        """Filter with no matches → empty list"""
        response = client.get("/api/suppliers?country=XX")
        
        assert response.status_code == 200
        assert response.json() == []
    
    def test_get_supplier_by_id_happy_path(self, client, sample_supplier):
        """Get supplier by ID"""
        response = client.get("/api/suppliers/supp-001")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "supp-001"
        assert data["name"] == "Medical Supplier Inc"
    
    def test_get_supplier_by_id_not_found(self, client):
        """Non-existent supplier → 404"""
        response = client.get("/api/suppliers/nonexistent")
        
        assert response.status_code == 404
        assert "encontrado" in response.json()["detail"].lower()
    
    def test_create_supplier_happy_path(self, client):
        """Create new supplier"""
        response = client.post("/api/suppliers", json={
            "name": "New Lab",
            "type": "LABORATORIO",
            "country": "MX",
            "category": "Análisis Clínico",
            "rate": 85.00,
            "npi": "9876543210",
        })
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "New Lab"
        assert data["rate"] == 85.00
        assert data["status"] == "active"  # Default status
    
    def test_create_supplier_rate_zero(self, client):
        """Rate = 0 → 422 validation error"""
        response = client.post("/api/suppliers", json={
            "name": "Invalid Lab",
            "type": "LABORATORIO",
            "country": "CO",
            "category": "Análisis",
            "rate": 0,  # Invalid
            "npi": "1234567890",
        })
        
        assert response.status_code == 422
        assert "rate" in str(response.json())
    
    def test_create_supplier_negative_rate(self, client):
        """Negative rate → 422 validation error"""
        response = client.post("/api/suppliers", json={
            "name": "Invalid Lab",
            "type": "LABORATORIO",
            "country": "CO",
            "category": "Análisis",
            "rate": -10.0,  # Invalid
            "npi": "1234567890",
        })
        
        assert response.status_code == 422
    
    def test_create_supplier_invalid_type(self, client):
        """Invalid supplier type → 422"""
        response = client.post("/api/suppliers", json={
            "name": "New Lab",
            "type": "INVALID_TYPE",
            "country": "CO",
            "category": "Análisis",
            "rate": 50.0,
            "npi": "1234567890",
        })
        
        assert response.status_code == 422
    
    def test_create_supplier_invalid_npi(self, client):
        """Invalid NPI (not 10 digits) → 422"""
        response = client.post("/api/suppliers", json={
            "name": "New Lab",
            "type": "LABORATORIO",
            "country": "CO",
            "category": "Análisis",
            "rate": 50.0,
            "npi": "12345",  # Too short
        })
        
        assert response.status_code == 422
    
    def test_create_supplier_missing_required_field(self, client):
        """Missing required field → 422"""
        response = client.post("/api/suppliers", json={
            # Missing 'name'
            "type": "LABORATORIO",
            "country": "CO",
            "category": "Análisis",
            "rate": 50.0,
            "npi": "1234567890",
        })
        
        assert response.status_code == 422


class TestSupplierStatusUpdate:
    """Update supplier status (active/suspended)"""
    
    def test_update_supplier_status_happy_path(self, client, sample_supplier):
        """Update supplier status"""
        response = client.patch(
            "/api/suppliers/supp-001/status",
            json={"status": "suspended"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "suspended"
    
    def test_update_supplier_status_invalid_status(self, client, sample_supplier):
        """Invalid status value → 422"""
        response = client.patch(
            "/api/suppliers/supp-001/status",
            json={"status": "invalid_status"}
        )
        
        assert response.status_code == 422
    
    def test_update_supplier_status_not_found(self, client):
        """Non-existent supplier → 404"""
        response = client.patch(
            "/api/suppliers/nonexistent/status",
            json={"status": "suspended"}
        )
        
        assert response.status_code == 404


class TestSupplierRateUpdate:
    """Update supplier rate"""
    
    def test_update_supplier_rate_happy_path(self, client, sample_supplier):
        """Update supplier rate"""
        response = client.patch(
            "/api/suppliers/supp-001/rate",
            json={"rate": 120.00}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["rate"] == 120.00
    
    def test_update_supplier_rate_zero(self, client, sample_supplier):
        """Rate = 0 → 422"""
        response = client.patch(
            "/api/suppliers/supp-001/rate",
            json={"rate": 0}
        )
        
        assert response.status_code == 422
    
    def test_update_supplier_rate_negative(self, client, sample_supplier):
        """Negative rate → 422"""
        response = client.patch(
            "/api/suppliers/supp-001/rate",
            json={"rate": -50.0}
        )
        
        assert response.status_code == 422


class TestSupplierDelete:
    """Delete supplier"""
    
    def test_delete_supplier_happy_path(self, client, sample_supplier):
        """Delete supplier (soft delete)"""
        response = client.delete("/api/suppliers/supp-001")
        
        assert response.status_code == 200
    
    def test_delete_supplier_not_found(self, client):
        """Delete non-existent supplier → 404"""
        response = client.delete("/api/suppliers/nonexistent")
        
        assert response.status_code == 404
