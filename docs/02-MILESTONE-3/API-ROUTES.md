# 🔌 Rutas y API - Milestone 3

## 📋 Endpoints de la API

### **Base URL**
```
https://playground.4geeks.com/tracker/api/v1
```

Configurada en `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
```

---

## 🔄 Operaciones CRUD

### **1. Listar Candidatos**

```
GET /records
```

**Parámetros de Query (opcionales):**
```typescript
{
  status?: string         // Filtrar por estado
  stage?: string          // Filtrar por etapa
  search?: string         // Búsqueda por nombre/email
  page?: number           // Paginación (si aplica)
  limit?: number          // Registros por página
}
```

**Respuesta (200 OK):**
```typescript
Candidate[]
```

**Ejemplo de solicitud:**
```typescript
// lib/api.ts
export async function fetchCandidates(
  filters?: { status?: string; stage?: string },
  search?: string
): Promise<Candidate[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.append('status', filters.status)
  if (filters?.stage) params.append('stage', filters.stage)
  if (search) params.append('search', search)

  const url = `${API_URL}/records?${params.toString()}`
  const response = await fetch(url)
  
  if (!response.ok) throw new Error('Error al obtener candidatos')
  return response.json() as Promise<Candidate[]>
}
```

---

### **2. Obtener Candidato por ID**

```
GET /records/:id
```

**Parámetros:**
```typescript
{
  id: string              // ID del candidato (UUID)
}
```

**Respuesta (200 OK):**
```typescript
Candidate
```

**Ejemplo de solicitud:**
```typescript
export async function fetchCandidateById(id: string): Promise<Candidate> {
  const url = `${API_URL}/records/${id}`
  const response = await fetch(url)
  
  if (!response.ok) throw new Error(`No se encontró candidato ${id}`)
  return response.json() as Promise<Candidate>
}
```

---

### **3. Crear Candidato**

```
POST /records
```

**Body (JSON):**
```typescript
interface CreateCandidateDTO {
  full_name: string         // Requerido
  email: string             // Requerido
  phone?: string            // Opcional
  position: string          // Requerido (puesto)
  linkedin_url?: string     // Opcional
  cv_url?: string           // Opcional
  years_experience?: number // Opcional
  status?: CandidateStatus  // Default según API
  stage?: CandidateStage    // Default según API
}
```

**Respuesta (201 Created):**
```typescript
Candidate                   // Candidato creado con ID
```

**Ejemplo de solicitud:**
```typescript
export async function createCandidate(
  data: CreateCandidateDTO
): Promise<Candidate> {
  const url = `${API_URL}/records`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) throw new Error('Error al crear candidato')
  return response.json() as Promise<Candidate>
}
```

---

### **4. Actualizar Candidato**

```
PUT /records/:id
```

**Parámetros:**
```typescript
{
  id: string              // ID del candidato
}
```

**Body (JSON):**
```typescript
interface UpdateCandidateDTO {
  full_name?: string
  email?: string
  phone?: string
  position?: string
  linkedin_url?: string
  cv_url?: string
  years_experience?: number
}
```

**Respuesta (200 OK):**
```typescript
Candidate               // Candidato actualizado
```

**Ejemplo de solicitud:**
```typescript
export async function updateCandidate(
  id: string,
  data: UpdateCandidateDTO
): Promise<Candidate> {
  const url = `${API_URL}/records/${id}`
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) throw new Error('Error al actualizar candidato')
  return response.json() as Promise<Candidate>
}
```

---

### **5. Cambiar Status**

```
PATCH /records/:id
```

**Body (JSON):**
```typescript
{
  status: CandidateStatus    // Nuevo estado
}
```

**Respuesta (200 OK):**
```typescript
Candidate               // Candidato con status actualizado
```

**Ejemplo de solicitud:**
```typescript
export async function updateCandidateStatus(
  id: string,
  status: CandidateStatus
): Promise<Candidate> {
  const url = `${API_URL}/records/${id}`
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  
  if (!response.ok) throw new Error('Error al actualizar status')
  return response.json() as Promise<Candidate>
}
```

---

### **6. Cambiar Etapa**

```
PATCH /records/:id
```

**Body (JSON):**
```typescript
{
  stage: CandidateStage      // Nueva etapa
}
```

**Respuesta (200 OK):**
```typescript
Candidate               // Candidato con stage actualizado
```

**Ejemplo de solicitud:**
```typescript
export async function updateCandidateStage(
  id: string,
  stage: CandidateStage
): Promise<Candidate> {
  const url = `${API_URL}/records/${id}`
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage }),
  })
  
  if (!response.ok) throw new Error('Error al actualizar etapa')
  return response.json() as Promise<Candidate>
}
```

---

### **7. Eliminar Candidato**

```
DELETE /records/:id
```

**Parámetros:**
```typescript
{
  id: string              // ID del candidato
}
```

**Respuesta (204 No Content o 200 OK):**
```typescript
{} | void               // Sin contenido
```

**Ejemplo de solicitud:**
```typescript
export async function deleteCandidate(id: string): Promise<void> {
  const url = `${API_URL}/records/${id}`
  const response = await fetch(url, { method: 'DELETE' })
  
  if (!response.ok) throw new Error('Error al eliminar candidato')
}
```

---

## 📝 Notas (CRUD)

### **8. Listar Notas de Candidato**

```
GET /records/:id/notes
```

**Respuesta (200 OK):**
```typescript
CandidateNote[]
```

**Ejemplo:**
```typescript
export async function fetchCandidateNotes(
  candidateId: string
): Promise<CandidateNote[]> {
  const url = `${API_URL}/records/${candidateId}/notes`
  const response = await fetch(url)
  
  if (!response.ok) throw new Error('Error al obtener notas')
  return response.json() as Promise<CandidateNote[]>
}
```

---

### **9. Crear Nota**

```
POST /records/:id/notes
```

**Body (JSON):**
```typescript
{
  content: string         // Contenido de la nota (requerido)
}
```

**Respuesta (201 Created):**
```typescript
CandidateNote           // Nota creada con ID y timestamp
```

**Ejemplo:**
```typescript
export async function createCandidateNote(
  candidateId: string,
  content: string
): Promise<CandidateNote> {
  const url = `${API_URL}/records/${candidateId}/notes`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  
  if (!response.ok) throw new Error('Error al crear nota')
  return response.json() as Promise<CandidateNote>
}
```

---

### **10. Eliminar Nota**

```
DELETE /records/:id/notes/:note_id
```

**Parámetros:**
```typescript
{
  id: string              // ID del candidato
  note_id: string         // ID de la nota
}
```

**Respuesta (204 No Content):**
```typescript
{} | void
```

**Ejemplo:**
```typescript
export async function deleteCandidateNote(
  candidateId: string,
  noteId: string
): Promise<void> {
  const url = `${API_URL}/records/${candidateId}/notes/${noteId}`
  const response = await fetch(url, { method: 'DELETE' })
  
  if (!response.ok) throw new Error('Error al eliminar nota')
}
```

---

## 🛡️ Manejo de Errores

Todos los métodos de API deben implementar try/catch centralizado:

```typescript
// Clase personalizada para errores de API
class ApiError extends Error {
  constructor(
    public status: number,
    public endpoint: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Función auxiliar para manejo consistente
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>
  }

  const error = await response.json().catch(() => ({}))
  throw new ApiError(
    response.status,
    response.url,
    error.message || 'Error en la API'
  )
}
```

---

## 🔐 Convenciones

### **Headers HTTP**
```typescript
const headers = {
  'Content-Type': 'application/json',
  // Agregar si se requiere autenticación:
  // 'Authorization': `Bearer ${token}`
}
```

### **Tipado de Respuestas**
Todas las funciones deben especificar el tipo de retorno:

```typescript
// ✅ Correcto
export async function fetchCandidates(): Promise<Candidate[]> { }

// ❌ Incorrecto
export async function fetchCandidates(): Promise<any> { }
export async function fetchCandidates() { }
```

### **Validación de Entrada**
```typescript
export async function fetchCandidateById(id: string): Promise<Candidate> {
  if (!id || typeof id !== 'string') {
    throw new Error('ID debe ser un string no vacío')
  }
  // ... resto del código
}
```

---

## 📚 Referencia Rápida

| Operación | Método | Endpoint | Función |
|-----------|--------|----------|---------|
| Listar | GET | `/records` | `fetchCandidates()` |
| Obtener | GET | `/records/:id` | `fetchCandidateById()` |
| Crear | POST | `/records` | `createCandidate()` |
| Actualizar | PUT | `/records/:id` | `updateCandidate()` |
| Status | PATCH | `/records/:id` | `updateCandidateStatus()` |
| Etapa | PATCH | `/records/:id` | `updateCandidateStage()` |
| Eliminar | DELETE | `/records/:id` | `deleteCandidate()` |
| Notas | GET | `/records/:id/notes` | `fetchCandidateNotes()` |
| Crear Nota | POST | `/records/:id/notes` | `createCandidateNote()` |
| Eliminar Nota | DELETE | `/records/:id/notes/:note_id` | `deleteCandidateNote()` |

---

**Última actualización**: 21 de noviembre de 2024
