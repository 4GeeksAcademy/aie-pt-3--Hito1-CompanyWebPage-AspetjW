/**
 * Componente de detalle de un candidato
 * Muestra información completa, permite editar y gestionar notas
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Candidate, CandidateNote, STATUS_LABELS, STAGE_LABELS, STATUS_COLORS } from '@/types/candidate';
import {
  fetchCandidateById,
  fetchCandidateNotes,
  updateCandidateStatus,
  updateCandidateStage,
  updateCandidate,
  createCandidateNote,
  deleteCandidateNote,
  getErrorMessage,
} from '@/lib/api';
import {
  LoadingSkeleton,
  ErrorMessage,
  Badge,
  Button,
  Modal,
  FormInput,
  FormSelect,
  FormTextarea,
} from '@/components/common/UIElements';
import { STATUS_OPTIONS, STAGE_OPTIONS } from '@/components/candidates/options';

export function CandidateDetail({ id }: { id: string }) {
  const router = useRouter();

  // Estados principales
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal de edición de candidato
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    linkedin_url: '',
    cv_url: '',
    years_of_experience: '',
  });
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Modal de nueva nota
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isNoteSubmitting, setIsNoteSubmitting] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Estados de selectores
  const [statusLoading, setStatusLoading] = useState(false);
  const [stageLoading, setStageLoading] = useState(false);

  // Carga inicial de datos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const candidateData = await fetchCandidateById(id);
        setCandidate(candidateData);

        // Rellena el formulario de edición
        setEditFormData({
          first_name: candidateData.first_name,
          last_name: candidateData.last_name,
          email: candidateData.email,
          phone: candidateData.phone || '',
          position: candidateData.position,
          linkedin_url: candidateData.linkedin_url || '',
          cv_url: candidateData.cv_url || '',
          years_of_experience: candidateData.years_of_experience?.toString() || '',
        });

        // Carga las notas
        const notesData = await fetchCandidateNotes(id);
        setNotes(notesData);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Manejadores de cambio de estado y etapa
  const handleStatusChange = async (newStatus: string) => {
    if (!candidate) return;
    setStatusLoading(true);

    try {
      const updated = await updateCandidateStatus(id, newStatus as any);
      setCandidate(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStatusLoading(false);
    }
  };

  const handleStageChange = async (newStage: string) => {
    if (!candidate) return;
    setStageLoading(true);

    try {
      const updated = await updateCandidateStage(id, newStage as any);
      setCandidate(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStageLoading(false);
    }
  };

  // Edición de candidato
  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (editFormErrors[name]) {
      setEditFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!editFormData.first_name.trim()) errors.first_name = 'El nombre es requerido';
    if (!editFormData.last_name.trim()) errors.last_name = 'El apellido es requerido';
    if (!editFormData.email.trim()) errors.email = 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) errors.email = 'Email inválido';
    if (!editFormData.position.trim()) errors.position = 'El puesto es requerido';

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEditForm() || !candidate) return;

    setIsEditSubmitting(true);

    try {
      const updated = await updateCandidate(id, {
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        email: editFormData.email,
        phone: editFormData.phone || undefined,
        position: editFormData.position,
        linkedin_url: editFormData.linkedin_url || undefined,
        cv_url: editFormData.cv_url || undefined,
        years_of_experience: editFormData.years_of_experience
          ? parseInt(editFormData.years_of_experience)
          : undefined,
      });

      setCandidate(updated);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // Gestión de notas
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setIsNoteSubmitting(true);

    try {
      const newNote = await createCandidateNote(id, {
        content: noteContent,
      });

      setNotes((prev) => [...prev, newNote]);
      setNoteContent('');
      setIsNoteModalOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsNoteSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta nota?')) return;

    setDeletingNoteId(noteId);
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteCandidateNote(id, noteId);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      setSuccessMessage('Nota eliminada correctamente');
      
      // Limpia el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingNoteId(null);
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  if (error || !candidate) {
    return (
      <div className="space-y-4">
        <Button onClick={() => router.back()} variant="secondary">
          ← Volver
        </Button>
        {error && <ErrorMessage message={error} />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button onClick={() => router.back()} variant="secondary" size="sm">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold mt-4">
            {candidate.first_name} {candidate.last_name}
          </h1>
          <p className="text-gray-600 mt-2">{candidate.email}</p>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)} variant="primary">
          Editar
        </Button>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Puesto</label>
            <p className="text-lg text-gray-900">{candidate.position}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Email</label>
            <p className="text-gray-900">{candidate.email}</p>
          </div>

          {candidate.phone && (
            <div>
              <label className="text-sm font-semibold text-gray-600">Teléfono</label>
              <p className="text-gray-900">{candidate.phone}</p>
            </div>
          )}

          {candidate.years_of_experience !== null && (
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Años de Experiencia
              </label>
              <p className="text-gray-900">{candidate.years_of_experience} años</p>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Fecha de Aplicación
            </label>
            <p className="text-gray-900">
              {new Date(candidate.applied_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Enlaces y estado */}
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          {candidate.linkedin_url && (
            <div>
              <label className="text-sm font-semibold text-gray-600">LinkedIn</label>
              <a
                href={candidate.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {candidate.linkedin_url}
              </a>
            </div>
          )}

          {candidate.cv_url && (
            <div>
              <label className="text-sm font-semibold text-gray-600">CV</label>
              <a
                href={candidate.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {candidate.cv_url}
              </a>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-600">Estado</label>
            <div className="mt-2">
              <select
                value={candidate.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Etapa</label>
            <div className="mt-2">
              <select
                value={candidate.stage}
                onChange={(e) => handleStageChange(e.target.value)}
                disabled={stageLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {STAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Notas Internas</h2>
          <Button onClick={() => setIsNoteModalOpen(true)} variant="primary" size="sm">
            + Agregar Nota
          </Button>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {notes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Sin notas aún</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-600">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                  <Button
                    onClick={() => handleDeleteNote(note.id)}
                    variant="danger"
                    size="sm"
                    disabled={deletingNoteId === note.id}
                  >
                    {deletingNoteId === note.id ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </div>
                <p className="text-gray-900">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Candidato"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <FormInput
            label="Nombre"
            name="first_name"
            value={editFormData.first_name}
            onChange={handleEditFormChange}
            required
            error={editFormErrors.first_name}
          />

          <FormInput
            label="Apellido"
            name="last_name"
            value={editFormData.last_name}
            onChange={handleEditFormChange}
            required
            error={editFormErrors.last_name}
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={editFormData.email}
            onChange={handleEditFormChange}
            required
            error={editFormErrors.email}
          />

          <FormInput
            label="Teléfono"
            name="phone"
            value={editFormData.phone}
            onChange={handleEditFormChange}
          />

          <FormInput
            label="Puesto"
            name="position"
            value={editFormData.position}
            onChange={handleEditFormChange}
            required
            error={editFormErrors.position}
          />

          <FormInput
            label="URL LinkedIn"
            name="linkedin_url"
            value={editFormData.linkedin_url}
            onChange={handleEditFormChange}
          />

          <FormInput
            label="URL CV"
            name="cv_url"
            value={editFormData.cv_url}
            onChange={handleEditFormChange}
          />

          <FormInput
            label="Años de Experiencia"
            name="years_of_experience"
            type="number"
            value={editFormData.years_of_experience}
            onChange={handleEditFormChange}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isEditSubmitting}
              className="flex-1"
            >
              {isEditSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de nueva nota */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setNoteContent('');
        }}
        title="Agregar Nota"
      >
        <form onSubmit={handleAddNote} className="space-y-4">
          <FormTextarea
            label="Nota"
            name="note_content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            required
            rows={5}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isNoteSubmitting}
              className="flex-1"
            >
              {isNoteSubmitting ? 'Guardando...' : 'Agregar Nota'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsNoteModalOpen(false);
                setNoteContent('');
              }}
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
