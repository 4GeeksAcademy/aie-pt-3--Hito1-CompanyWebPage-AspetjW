'use client';

import React, { useState, useEffect } from 'react';

// ============================================================================
// SUPPLIER DIRECTORY UI
// Interactive table with filtering, creation, and quick edits for suppliers.
// ============================================================================

interface Supplier {
  id: number;
  name: string;
  supplier_type: 'HOSPITAL' | 'CLINICA' | 'LABORATORIO' | 'FARMACIA' | 'ESPECIALISTA';
  country: string;
  category: string;
  npi: string;
  specialties: string[];
  rate: number;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

export default function SuppliersPage() {
  // State management
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter state
  const [countryFilter, setCountryFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    supplier_type: 'HOSPITAL' as const,
    country: '',
    category: '',
    npi: '',
    specialties: '',
    rate: '',
  });

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingRate, setEditingRate] = useState<number | null>(null);
  const [editingStatus, setEditingStatus] = useState<'active' | 'suspended' | null>(null);

  // Fetch suppliers
  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (countryFilter) params.append('country', countryFilter);
      if (categoryFilter) params.append('category', categoryFilter);

      const response = await fetch(`/api/suppliers?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error loading suppliers: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    fetchSuppliers();
  }, [countryFilter, categoryFilter]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate required fields
    if (!formData.name || !formData.country || !formData.npi || !formData.rate) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate NPI format (10 digits)
    if (!/^\d{10}$/.test(formData.npi)) {
      setError('NPI must be exactly 10 digits');
      return;
    }

    // Validate rate
    if (parseFloat(formData.rate) <= 0) {
      setError('Rate must be greater than 0');
      return;
    }

    const payload = {
      name: formData.name,
      supplier_type: formData.supplier_type,
      country: formData.country,
      category: formData.category,
      npi: formData.npi,
      specialties: formData.specialties
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      rate: parseFloat(formData.rate),
      status: 'active',
    };

    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 422) {
        const errorData = (await response.json()) as ApiError;
        setError(`Validation error: ${errorData.detail || 'Invalid data'}`);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to create supplier');
      }

      setSuccess('✅ Supplier created successfully!');
      setFormData({
        name: '',
        supplier_type: 'HOSPITAL',
        country: '',
        category: '',
        npi: '',
        specialties: '',
        rate: '',
      });
      setShowForm(false);
      await fetchSuppliers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error creating supplier: ${message}`);
    }
  };

  // Update supplier rate
  const updateRate = async (id: number, newRate: number) => {
    setError(null);
    setSuccess(null);

    if (newRate <= 0) {
      setError('Rate must be greater than 0');
      return;
    }

    try {
      const response = await fetch(`/api/suppliers/${id}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: newRate }),
      });

      if (!response.ok) {
        throw new Error('Failed to update rate');
      }

      setSuccess('✅ Rate updated!');
      setEditingId(null);
      setEditingRate(null);
      await fetchSuppliers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error updating rate: ${message}`);
    }
  };

  // Update supplier status
  const updateStatus = async (id: number, newStatus: 'active' | 'suspended') => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/suppliers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setSuccess('✅ Status updated!');
      setEditingId(null);
      setEditingStatus(null);
      await fetchSuppliers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error updating status: ${message}`);
    }
  };

  // Delete supplier
  const deleteSupplier = async (id: number) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete supplier');
      }

      setSuccess('✅ Supplier deleted!');
      await fetchSuppliers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error deleting supplier: ${message}`);
    }
  };

  // =========================================================================
  // RENDER: Alerts
  // =========================================================================
  const renderAlerts = () => (
    <div className="mb-6 space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg" role="alert">
          {success}
        </div>
      )}
    </div>
  );

  // =========================================================================
  // RENDER: Filters and Controls
  // =========================================================================
  const renderControls = () => (
    <div className="mb-6 bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Filter by country..."
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter suppliers by country"
        />
        <input
          type="text"
          placeholder="Filter by category..."
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter suppliers by category"
        />
      </div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        {showForm ? '✕ Cancel' : '+ New Supplier'}
      </button>
    </div>
  );

  // =========================================================================
  // RENDER: Form
  // =========================================================================
  const renderForm = () => (
    <div className="mb-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Create New Supplier</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              value={formData.supplier_type}
              onChange={(e) => setFormData({ ...formData, supplier_type: e.target.value as 'HOSPITAL' | 'CLINICA' | 'LABORATORIO' | 'FARMACIA' | 'ESPECIALISTA' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="HOSPITAL">Hospital</option>
              <option value="CLINICA">Clinica</option>
              <option value="LABORATORIO">Laboratorio</option>
              <option value="FARMACIA">Farmacia</option>
              <option value="ESPECIALISTA">Especialista</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country *</label>
            <input
              type="text"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">NPI (10 digits) *</label>
            <input
              type="text"
              required
              maxLength={10}
              value={formData.npi}
              onChange={(e) => setFormData({ ...formData, npi: e.target.value.replace(/\D/g, '') })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rate (USD) *</label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Specialties (comma-separated) *</label>
          <input
            type="text"
            required
            value={formData.specialties}
            onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
            placeholder="e.g., Cardiology, Emergency, Orthopedics"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Create Supplier
        </button>
      </form>
    </div>
  );

  // =========================================================================
  // RENDER: Table
  // =========================================================================
  const renderTable = () => (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm" role="table" aria-label="Suppliers list">
        <caption className="sr-only">List of all suppliers with their details and actions</caption>
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Type</th>
            <th className="px-4 py-3 text-left font-semibold">Country</th>
            <th className="px-4 py-3 text-left font-semibold">Category</th>
            <th className="px-4 py-3 text-left font-semibold">Rate (USD)</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{supplier.name}</td>
              <td className="px-4 py-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {supplier.supplier_type}
                </span>
              </td>
              <td className="px-4 py-3">{supplier.country}</td>
              <td className="px-4 py-3">{supplier.category}</td>
              <td className="px-4 py-3">
                {editingId === supplier.id && editingRate !== null ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingRate}
                      onChange={(e) => setEditingRate(parseFloat(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => updateRate(supplier.id, editingRate)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(supplier.id);
                      setEditingRate(supplier.rate);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    ${supplier.rate.toFixed(2)}
                  </button>
                )}
              </td>
              <td className="px-4 py-3">
                {editingId === supplier.id && editingStatus !== null ? (
                  <div className="flex gap-2">
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value as 'active' | 'suspended')}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <button
                      onClick={() => updateStatus(supplier.id, editingStatus)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(supplier.id);
                      setEditingStatus(supplier.status);
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      supplier.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                  </button>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => deleteSupplier(supplier.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // =========================================================================
  // MAIN RENDER
  // =========================================================================
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Supplier Directory</h1>

        {renderAlerts()}
        {renderControls()}
        {showForm && renderForm()}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading suppliers...</p>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No suppliers found. {!showForm && <p onClick={() => setShowForm(true)} className="text-blue-600 cursor-pointer hover:underline mt-2">Create one now</p>}
          </div>
        ) : (
          renderTable()
        )}
      </div>
    </main>
  );
}
