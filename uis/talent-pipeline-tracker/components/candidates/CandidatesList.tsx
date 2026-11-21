/**
 * Componente principal del listado de candidatos
 * Muestra tabla de candidatos con filtros y búsqueda
 */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';

import { Candidate, CandidateStatus, CandidateStage, STATUS_LABELS, STAGE_LABELS, STATUS_COLORS } from '@/types/candidate';
import { useCandidates } from '@/app/candidates/hooks/useCandidates';
import { LoadingSkeleton, ErrorMessage, EmptyState, Button, Badge, Modal, FormInput, FormSelect } from '@/components/common/UIElements';
import { createCandidate, getErrorMessage } from '@/lib/api';
import { STAGE_OPTIONS, STATUS_OPTIONS } from './options';

export function CandidatesList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parámetros de filtrado desde URL
  const statusFilter = (searchParams.get('status') as CandidateStatus) || undefined;
  const stageFilter = (searchParams.get('stage') as CandidateStage) || undefined;
  const searchQuery = searchParams.get('search') || '';

  // Estados de formulario de nuevo candidato
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    linkedin_url: '',
    cv_url: '',
    years_of_experience: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch de candidatos con filtros
  const { candidates, isLoading, error, errorMessage, refresh } = useCandidates({
    status: statusFilter,
    stage: stageFilter,
    search: searchQuery || undefined,
  });

  // Funciones de filtrado
  const handleStatusFilter = useCallback(
    (status: CandidateStatus | '') => {
      const params = new URLSearchParams(searchParams);
      if (status) {
        params.set('status', status);
      } else {
        params.delete('status');
      }
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleStageFilter = useCallback(
    (stage: CandidateStage | '') => {
      const params = new URLSearchParams(searchParams);
      if (stage) {
        params.set('stage', stage);
      } else {
        params.delete('stage');
      }
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      const params = new URLSearchParams(searchParams);
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  // Manejo de formulario
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpia el error del campo
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.first_name.trim()) errors.first_name = 'El nombre es requerido';
    if (!formData.last_name.trim()) errors.last_name = 'El apellido es requerido';
    if (!formData.email.trim()) errors.email = 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
    if (!formData.position.trim()) errors.position = 'El puesto es requerido';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const newCandidate = await createCandidate({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || undefined,
        position: formData.position,
        linkedin_url: formData.linkedin_url || undefined,
        cv_url: formData.cv_url || undefined,
        years_of_experience: formData.years_of_experience
          ? parseInt(formData.years_of_experience)
          : undefined,
      });

      // Reset del formulario
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        linkedin_url: '',
        cv_url: '',
        years_of_experience: '',
      });
      setIsModalOpen(false);

      // Refresca la lista de candidatos
      await refresh();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pipeline de Candidatos</h1>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          + Nuevo Candidato
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            defaultValue={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter || ''}
            onChange={(e) => handleStatusFilter(e.target.value as CandidateStatus | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={stageFilter || ''}
            onChange={(e) => handleStageFilter(e.target.value as CandidateStage | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las etapas</option>
            {STAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenido principal */}
      {isLoading && <LoadingSkeleton />}

      {error && errorMessage && <ErrorMessage message={errorMessage} />}

      {!isLoading && !error && candidates.length === 0 && (
        <EmptyState message="No se encontraron candidatos" />
      )}

      {!isLoading && !error && candidates.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Puesto
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Etapa
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {candidate.first_name} {candidate.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{candidate.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {candidate.position}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      label={STATUS_LABELS[candidate.status]}
                      color={STATUS_COLORS[candidate.status]}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      label={STAGE_LABELS[candidate.stage]}
                      color="bg-gray-100 text-gray-800"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/candidates/${candidate.id}`}>
                      <Button variant="secondary" size="sm">
                        Ver Detalle
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de nuevo candidato */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            position: '',
            linkedin_url: '',
            cv_url: '',
            years_of_experience: '',
          });
          setFormErrors({});
          setSubmitError(null);
        }}
        title="Registrar Nuevo Candidato"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {submitError && <ErrorMessage message={submitError} />}

          <FormInput
            label="Nombre"
            name="first_name"
            value={formData.first_name}
            onChange={handleFormChange}
            required
            error={formErrors.first_name}
          />

          <FormInput
            label="Apellido"
            name="last_name"
            value={formData.last_name}
            onChange={handleFormChange}
            required
            error={formErrors.last_name}
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleFormChange}
            required
            error={formErrors.email}
          />

          <FormInput
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
          />

          <FormInput
            label="Puesto"
            name="position"
            value={formData.position}
            onChange={handleFormChange}
            required
            error={formErrors.position}
          />

          <FormInput
            label="URL LinkedIn"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleFormChange}
          />

          <FormInput
            label="URL CV"
            name="cv_url"
            value={formData.cv_url}
            onChange={handleFormChange}
          />

          <FormInput
            label="Años de Experiencia"
            name="years_of_experience"
            type="number"
            value={formData.years_of_experience}
            onChange={handleFormChange}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Candidato'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
