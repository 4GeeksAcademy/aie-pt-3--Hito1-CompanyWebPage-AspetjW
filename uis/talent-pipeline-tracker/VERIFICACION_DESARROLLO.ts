/**
 * Instrucciones y verificación de desarrollo - Milestone 3: Talent Pipeline Tracker
 * 
 * Este archivo documenta cómo verificar que todas las funcionalidades están implementadas
 * y funcionan correctamente.
 */

// ============================================================================
// 1. CONFIGURACIÓN INICIAL DEL PROYECTO
// ============================================================================

/*
Pasos previos:

1. Crear archivo .env.local en la raíz del proyecto:
   NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1

2. Instalar dependencias:
   npm install

3. Iniciar servidor de desarrollo:
   npm run dev

4. Abrir http://localhost:3000 en el navegador
*/

// ============================================================================
// 2. ESTRUCTURA DE ARCHIVOS VERIFICADA
// ============================================================================

/*
✅ Estructura de archivos completada:

src/
├── types/candidate.ts
│   - Interface Candidate (id, first_name, last_name, email, phone, position, linkedin_url, cv_url, years_of_experience, status, stage, applied_at)
│   - Interface CandidateNote (id, content, created_at)
│   - DTOs: CreateCandidateDTO, UpdateCandidateDTO, CreateCandidateNoteDTO
│   - Enums: CandidateStatus, CandidateStage
│   - Labels y colores: STATUS_LABELS, STAGE_LABELS, STATUS_COLORS

├── lib/api.ts
│   - fetchCandidates(filters?) - GET /records
│   - fetchCandidateById(id) - GET /records/:id
│   - createCandidate(data) - POST /records
│   - updateCandidate(id, data) - PUT /records/:id
│   - updateCandidateStatus(id, status) - PATCH /records/:id
│   - updateCandidateStage(id, stage) - PATCH /records/:id
│   - fetchCandidateNotes(id) - GET /records/:id/notes
│   - createCandidateNote(id, data) - POST /records/:id/notes
│   - deleteCandidateNote(id, noteId) - DELETE /records/:id/notes/:note_id
│   - getErrorMessage(error) - Conversión de errores a mensajes

├── app/candidates/hooks/useCandidates.ts
│   - Hook con caché de 5 minutos
│   - Retorna: candidates[], isLoading, error, errorMessage, refresh()
│   - Detecta cambios en filtros automáticamente

├── components/common/UIElements.tsx
│   - LoadingSkeleton
│   - ErrorMessage
│   - EmptyState
│   - Badge
│   - Button
│   - FormInput
│   - FormSelect
│   - FormTextarea
│   - Modal

├── components/candidates/CandidatesList.tsx
│   - Listado de candidatos
│   - Filtros por status/stage
│   - Búsqueda por nombre/email
│   - Modal para nuevo candidato
│   - Validación de formulario

├── components/candidates/options.ts
│   - STATUS_OPTIONS[]
│   - STAGE_OPTIONS[]

├── app/candidates/components/CandidateDetail.tsx
│   - Vista detalle del candidato
│   - Cambio de status/stage
│   - Gestión de notas (CRUD)
│   - Edición de candidato

├── app/candidates/[id]/page.tsx
│   - Ruta dinámica para detalle

└── app/page.tsx
    - Página principal
*/

// ============================================================================
// 3. FUNCIONALIDADES A VERIFICAR
// ============================================================================

/*
LISTADO DE CANDIDATOS (/):
✅ [ ] Se muestra lista de candidatos desde API
✅ [ ] Se renderiza nombre, puesto, estado y etapa de cada candidato
✅ [ ] Se muestra esqueleto de carga mientras se obtienen datos
✅ [ ] Se muestra mensaje de error si falla la petición
✅ [ ] Se muestra "Sin candidatos" si lista está vacía

FILTROS:
✅ [ ] Selector de status filtra candidatos
✅ [ ] Selector de stage filtra candidatos
✅ [ ] Los filtros se mantienen en la URL (useSearchParams)
✅ [ ] NO hay recarga de página al cambiar filtros
✅ [ ] Se puede combinar status + stage en URL: ?status=applied&stage=initial_review

BÚSQUEDA:
✅ [ ] Input de búsqueda filtra por nombre
✅ [ ] Input de búsqueda filtra por email
✅ [ ] NO hay recarga de página al escribir
✅ [ ] Se busca en tiempo real mientras se escribe

NUEVO CANDIDATO:
✅ [ ] Botón "Agregar Candidato" abre modal
✅ [ ] Modal tiene campos: first_name, last_name, email, phone, position, linkedin_url, cv_url, years_of_experience
✅ [ ] Se valida: nombre, apellido, email, puesto requeridos
✅ [ ] Se valida formato de email
✅ [ ] Se muestra error en campo si falla validación
✅ [ ] Tras crear, se cierra modal y se actualiza lista
✅ [ ] Se muestra mensaje de éxito/error tras crear

NAVEGACIÓN A DETALLE (/candidates/[id]):
✅ [ ] Click en candidato abre página de detalle
✅ [ ] URL cambia a /candidates/:id
✅ [ ] NO hay recarga completa de página

DETALLE DEL CANDIDATO:
✅ [ ] Se muestran todos los campos: nombre, email, teléfono, puesto, LinkedIn, CV, años experiencia, aplicación
✅ [ ] Se muestra estado actual
✅ [ ] Se muestra etapa actual
✅ [ ] Se muestra esqueleto de carga mientras se obtienen datos
✅ [ ] Botón "Volver" regresa al listado
✅ [ ] Botón "Editar" abre modal de edición

CAMBIO DE STATUS:
✅ [ ] Selector de status permite seleccionar nuevo valor
✅ [ ] Tras cambiar, se hace PATCH a la API
✅ [ ] La UI se actualiza inmediatamente
✅ [ ] Se muestra spinner mientras se procesa

CAMBIO DE STAGE:
✅ [ ] Selector de stage permite seleccionar nuevo valor
✅ [ ] Tras cambiar, se hace PATCH a la API
✅ [ ] La UI se actualiza inmediatamente
✅ [ ] Se muestra spinner mientras se procesa

NOTAS INTERNAS:
✅ [ ] Se muestran notas existentes
✅ [ ] Se muestra "Sin notas aún" si no hay
✅ [ ] Botón "+ Agregar Nota" abre modal
✅ [ ] Modal tiene textarea para contenido
✅ [ ] Tras crear, nota aparece en lista sin recarga
✅ [ ] Botón "Eliminar" en cada nota elimina con confirmación
✅ [ ] Tras eliminar, nota desaparece de la lista

EDICIÓN DE CANDIDATO:
✅ [ ] Modal de edición precarga valores actuales
✅ [ ] Se puede cambiar nombre, apellido, email, teléfono, puesto, LinkedIn, CV, años experiencia
✅ [ ] Se valida lo mismo que en creación
✅ [ ] Tras editar, se hace PUT a la API
✅ [ ] La UI se actualiza con nuevos valores
✅ [ ] Se muestra spinner mientras se procesa

MANEJO DE ERRORES:
✅ [ ] Error en GET /records muestra mensaje en listado
✅ [ ] Error en GET /records/:id muestra mensaje en detalle
✅ [ ] Error en POST muestra mensaje en modal
✅ [ ] Error en PUT muestra mensaje en modal
✅ [ ] Error en PATCH muestra mensaje global
✅ [ ] Error en POST/DELETE notas muestra mensaje
*/

// ============================================================================
// 4. VERIFICACIÓN DE CÓDIGO
// ============================================================================

/*
TYPES (types/candidate.ts):
✅ [ ] Todos los tipos tienen tipado explícito (sin "any")
✅ [ ] Interfaces usan PascalCase (Candidate, CandidateNote)
✅ [ ] Tipos de enums usan snake_case (applied, initial_review)
✅ [ ] STATUS_LABELS tiene todas las etiquetas en español
✅ [ ] STAGE_LABELS tiene todas las etiquetas en español
✅ [ ] STATUS_COLORS tiene colores para cada estado

API (lib/api.ts):
✅ [ ] Todas las funciones son puras y async
✅ [ ] Parámetros tienen tipos explícitos
✅ [ ] Valores de retorno tienen tipos explícitos
✅ [ ] Manejo centralizado de errores (try/catch)
✅ [ ] Función getErrorMessage() convierte errores a strings
✅ [ ] API_URL se obtiene de NEXT_PUBLIC_API_URL

HOOKS (app/candidates/hooks/useCandidates.ts):
✅ [ ] Hook implementa caché de 5 minutos
✅ [ ] Detecta cambios en filtros con useEffect
✅ [ ] Retorna estado + función refresh
✅ [ ] Manejo de errores tipado

COMPONENTES:
✅ [ ] Todos son funcionales con TypeScript
✅ [ ] Reciben props tipados
✅ [ ] Implementan 'use client' donde necesitan hooks
✅ [ ] No hay prop drilling innecesario
✅ [ ] Formularios están validados
✅ [ ] Modales usan composición de componentes
✅ [ ] Tablas/listas renderizadas correctamente

ESTILOS (Tailwind CSS):
✅ [ ] Solo clases de Tailwind v4
✅ [ ] Responsive: mobile-first (sm:, md:, lg:)
✅ [ ] Consistencia visual en colores y espaciado
✅ [ ] No hay CSS personalizado extra
✅ [ ] Dark mode no es requerido pero considerado en config
*/

// ============================================================================
// 5. COMANDOS DE VERIFICACIÓN
// ============================================================================

/*
Verificar tipos:
$ npm run typecheck

Verificar linting:
$ npm run lint

Compilar para producción:
$ npm run build

Iniciar servidor:
$ npm start (tras build)

Limpiar cache:
$ rm -rf .next node_modules
$ npm install
*/

// ============================================================================
// 6. ENTREGA FINAL
// ============================================================================

/*
Pasos para entregar:

1. Crear rama feature:
   git checkout -b feat/milestone-3-talent-pipeline-tracker

2. Hacer cambios y commits:
   git add .
   git commit -m "Implementa Talent Pipeline Tracker con listado, detalle, filtros y gestión de notas"

3. Subir rama:
   git push origin feat/milestone-3-talent-pipeline-tracker

4. Crear PR en GitHub:
   - Title: "Milestone 3: Talent Pipeline Tracker"
   - Description: 
     * Implementa frontend Next.js para gestión de candidaturas
     * Incluye: listado con filtros, búsqueda, detalle, cambio status/stage, CRUD de notas
     * Consumo de API REST sin dependencias de state management
     * Validación de formularios y manejo completo de errores
     * TypeScript 100% tipado, Tailwind CSS v4 puro

5. Esperar review y merge a main

6. Entregar enlace del PR en plataforma de 4Geeks
*/

// ============================================================================
// 7. NOTAS DE DESARROLLO
// ============================================================================

/*
DECISIONES ARQUITECTÓNICAS:

1. API Centralizada (lib/api.ts):
   - Todas las llamadas HTTP en un único lugar
   - Facilita cambios en endpoints o manejo de errores
   - Tipos explícitos para parámetros y respuestas

2. Hook useCandidates:
   - Implementa caché para evitar peticiones repetidas
   - Duración: 5 minutos (configurable)
   - Detecta cambios en filtros automáticamente

3. Componentes Funcionales:
   - Todo usa React.FC o solo funciones
   - 'use client' solo donde se necesita (hooks)
   - Props tipadas en TypeScript

4. Estados en URL:
   - Filtros en query parameters para bookmarkability
   - useSearchParams para leer desde URL
   - useRouter para actualizar sin recarga

5. Sin State Management Global:
   - useState para estado local
   - useCallback para funciones memoizadas
   - useEffect para side effects
   - Nada de Redux, Zustand, Jotai, etc.

6. Tailwind CSS v4 Puro:
   - Solo clases utilitarias
   - Variables de color personalizadas en tailwind.config
   - Sin CSS módulos ni CSS-in-JS
   - Responsive mobile-first

POSIBLES EXTENSIONES FUTURAS:

- Paginación del listado
- Exportación a CSV/PDF
- Filtros avanzados (rango de fechas, años experiencia, etc.)
- Bulk actions (cambiar estado de múltiples)
- Búsqueda avanzada
- Historial de cambios en cada candidato
- Comentarios colaborativos en notas
- Integración con calendario (entrevistas programadas)
- Métricas/dashboards (conversion rate, tiempo promedio, etc.)
*/

export {};
