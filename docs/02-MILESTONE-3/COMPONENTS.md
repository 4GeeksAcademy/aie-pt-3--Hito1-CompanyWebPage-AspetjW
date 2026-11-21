# 🧩 Componentes - Milestone 3

## 📦 Inventario de Componentes

### **Nivel de Página**

#### **app/page.tsx** (Listado Principal)
Página raíz que renderiza el listado de candidatos.

```typescript
export default function CandidatesPage() {
  const { candidates, isLoading, error, refresh } = useCandidates()
  const searchParams = useSearchParams()
  
  return (
    <main>
      <header>
        <h1>Pipeline de Candidatos</h1>
        <button onClick={() => openModal()}>+ Nuevo Candidato</button>
      </header>
      {isLoading && <LoadingSkeleton />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && candidates.length === 0 && <EmptyState />}
      {!isLoading && candidates.length > 0 && (
        <CandidatesList candidates={filteredCandidates} />
      )}
      <NewCandidateModal />
    </main>
  )
}
```

**Responsabilidades:**
- Renderizar layout principal
- Gestionar modal de nuevo candidato
- Orquestar el flujo de datos

---

#### **app/candidates/[id]/page.tsx** (Detalle)
Página dinámica para ver/editar un candidato específico.

```typescript
export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  const { candidate, isLoading, error } = useCandidateDetail(params.id)
  
  return (
    <main>
      {isLoading && <LoadingSkeleton />}
      {error && <ErrorMessage message={error} />}
      {candidate && <CandidateDetail candidate={candidate} />}
    </main>
  )
}
```

**Responsabilidades:**
- Capturar ID de URL
- Renderizar componente de detalle
- Gestionar navegación

---

### **Componentes Presentacionales**

#### **components/candidates/CandidatesList.tsx**
Tabla/Grid que muestra todos los candidatos.

```typescript
interface CandidatesListProps {
  candidates: Candidate[]
  isLoading: boolean
  error?: string
  onFilterChange?: (filters: FilterOptions) => void
  onSearch?: (query: string) => void
  onCreateNew?: () => void
}

export default function CandidatesList({
  candidates,
  isLoading,
  error,
  onFilterChange,
  onSearch,
  onCreateNew,
}: CandidatesListProps) {
  // ... implementación
}
```

**Funcionalidades:**
- ✅ Renderizar tabla/grid de candidatos
- ✅ Filtros por status y stage
- ✅ Búsqueda reactiva por nombre/email
- ✅ Botón para crear candidato nuevo
- ✅ Navegación a detalle al click

**Estado:**
- `searchQuery` — Búsqueda actual
- `filters` — Filtros aplicados
- `sortBy` — Campo a ordenar

---

#### **app/candidates/components/CandidateDetail.tsx**
Componente que muestra todos los detalles de un candidato.

```typescript
interface CandidateDetailProps {
  candidate: Candidate
  onStatusChange?: (newStatus: CandidateStatus) => Promise<void>
  onStageChange?: (newStage: CandidateStage) => Promise<void>
  onUpdate?: (data: UpdateCandidateDTO) => Promise<void>
  onNoteCreate?: (content: string) => Promise<void>
  onNoteDelete?: (noteId: string) => Promise<void>
}

export default function CandidateDetail({
  candidate,
  onStatusChange,
  onStageChange,
  onUpdate,
  onNoteCreate,
  onNoteDelete,
}: CandidateDetailProps) {
  // ... implementación
}
```

**Secciones:**
1. **Información Personal**
   - Nombre, email, teléfono
   - LinkedIn, CV (links)
   - Años de experiencia

2. **Información de Candidatura**
   - Puesto aplicado
   - Status (dropdown editable)
   - Etapa (dropdown editable)
   - Fecha de aplicación

3. **Notas Internas**
   - Listado de notas existentes
   - Formulario para agregar nota
   - Botones de eliminar

4. **Acciones**
   - Editar candidato (modal)
   - Cambiar status (dropdown inline)
   - Cambiar etapa (dropdown inline)

---

### **Componentes Comunes (UI)**

#### **components/common/UIElements.tsx**
Componentes reutilizables para toda la aplicación.

```typescript
// Badge para estados
interface BadgeProps {
  label: string
  variant: 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
}
export function Badge({ label, variant, size }: BadgeProps) { /* ... */ }

// Botones tipados
interface ButtonProps {
  children: React.ReactNode
  variant: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void | Promise<void>
  isLoading?: boolean
}
export function Button({ children, variant, ...props }: ButtonProps) { /* ... */ }

// Skeleton de carga
export function LoadingSkeleton() { /* ... */ }

// Mensaje de error
interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) { /* ... */ }

// Estado vacío
interface EmptyStateProps {
  title?: string
  message?: string
  action?: { label: string; onClick: () => void }
}
export function EmptyState(props: EmptyStateProps) { /* ... */ }

// Modal genérico
interface ModalProps {
  isOpen: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  onConfirm?: () => Promise<void>
  confirmLabel?: string
  isLoading?: boolean
}
export function Modal(props: ModalProps) { /* ... */ }

// Campos de formulario
interface FormInputProps {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string
  value: string
  onChange: (value: string) => void
}
export function FormInput(props: FormInputProps) { /* ... */ }

interface FormSelectProps {
  label: string
  name: string
  options: Array<{ value: string; label: string }>
  required?: boolean
  error?: string
  value: string
  onChange: (value: string) => void
}
export function FormSelect(props: FormSelectProps) { /* ... */ }
```

**Variantes disponibles:**
- Colores según empresa (en Tailwind)
- Tamaños consistentes
- Estados (hover, active, disabled)
- Accessibilidad (labels, ARIA)

---

### **Hooks Personalizados**

#### **hooks/useCandidates.ts**
Hook para gestionar candidatos con caché.

```typescript
interface UseCandidatesOptions {
  filters?: {
    status?: CandidateStatus
    stage?: CandidateStage
  }
  search?: string
  cacheTime?: number // ms, default 5 min
}

interface UseCandidatesReturn {
  candidates: Candidate[]
  isLoading: boolean
  error?: string
  refresh: () => Promise<void>
  total: number
}

export function useCandidates(options?: UseCandidatesOptions): UseCandidatesReturn {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()
  const cacheRef = useRef<{ data: Candidate[]; time: number }>()

  useEffect(() => {
    const now = Date.now()
    const cacheValid = cacheRef.current && (now - cacheRef.current.time) < (options?.cacheTime ?? 5 * 60 * 1000)

    if (cacheValid && cacheRef.current) {
      setCandidates(cacheRef.current.data)
      setIsLoading(false)
      return
    }

    const fetch = async () => {
      try {
        const data = await api.fetchCandidates(options?.filters, options?.search)
        setCandidates(data)
        cacheRef.current = { data, time: Date.now() }
        setError(undefined)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [options?.filters?.status, options?.filters?.stage, options?.search])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await api.fetchCandidates(options?.filters, options?.search)
      setCandidates(data)
      cacheRef.current = { data, time: Date.now() }
      setError(undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }, [options?.filters, options?.search])

  return { candidates, isLoading, error, refresh, total: candidates.length }
}
```

**Características:**
- ✅ Caché automático (5 min)
- ✅ Invalidación de caché al cambiar filtros
- ✅ Función `refresh()` para refetch manual
- ✅ Manejo de loading y error

---

#### **hooks/useCandidateDetail.ts**
Hook para un candidato individual.

```typescript
interface UseCandidateDetailReturn {
  candidate?: Candidate
  isLoading: boolean
  error?: string
  updateStatus: (status: CandidateStatus) => Promise<void>
  updateStage: (stage: CandidateStage) => Promise<void>
  updateData: (data: UpdateCandidateDTO) => Promise<void>
  refresh: () => Promise<void>
}

export function useCandidateDetail(candidateId: string): UseCandidateDetailReturn {
  // ... implementación similar a useCandidates pero para un candidato
}
```

---

#### **hooks/useCandidateNotes.ts**
Hook para gestionar notas de un candidato.

```typescript
interface UseCandidateNotesReturn {
  notes: CandidateNote[]
  isLoading: boolean
  error?: string
  createNote: (content: string) => Promise<void>
  deleteNote: (noteId: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useCandidateNotes(candidateId: string): UseCandidateNotesReturn {
  // ... implementación
}
```

---

## 🎨 Convenciones de Componentes

### **Nombres**
- Archivo: `PascalCase.tsx` (ej: `CandidatesList.tsx`)
- Componente: `PascalCase` (ej: `export default function CandidatesList()`)
- Props interface: `${ComponentName}Props` (ej: `CandidatesListProps`)

### **Estructura**
```typescript
import React, { useState, useEffect, useCallback } from 'react'
import { Candidate } from '@/types/candidate'

interface CandidateListProps {
  candidates: Candidate[]
  onSelect?: (candidate: Candidate) => void
}

export default function CandidateList({ candidates, onSelect }: CandidateListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = useCallback((candidate: Candidate) => {
    setSelectedId(candidate.id)
    onSelect?.(candidate)
  }, [onSelect])

  return (
    <div className="space-y-4">
      {candidates.map(candidate => (
        <div
          key={candidate.id}
          onClick={() => handleSelect(candidate)}
          className="p-4 border rounded cursor-pointer hover:bg-gray-50"
        >
          <h3>{candidate.full_name}</h3>
          <p className="text-sm text-gray-600">{candidate.email}</p>
        </div>
      ))}
    </div>
  )
}
```

---

**Última actualización**: 21 de noviembre de 2024
