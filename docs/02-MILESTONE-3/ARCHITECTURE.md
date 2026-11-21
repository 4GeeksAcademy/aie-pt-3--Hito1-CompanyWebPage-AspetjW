# 🏗️ Arquitectura - Milestone 3

## 📐 Visión General

```
┌─────────────────────────────────────────────────────────────┐
│                      Navegador (Cliente)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          app/page.tsx (Listado Principal)            │   │
│  │  - Renderiza CandidatesList                          │   │
│  │  - Maneja useSearchParams para filtros               │   │
│  │  - Usa hook useCandidates para datos                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      components/candidates/CandidatesList.tsx        │   │
│  │  - Tabla/Grid de candidatos                          │   │
│  │  - Filtros reactivos (status, stage)                 │   │
│  │  - Búsqueda por nombre/email                         │   │
│  │  - Modal para crear candidato                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   app/candidates/[id]/page.tsx (Detalle)             │   │
│  │  - Renderiza CandidateDetail                         │   │
│  │  - Parámetro [id] captura el candidato               │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   app/candidates/components/CandidateDetail.tsx      │   │
│  │  - Muestra todos los campos                          │   │
│  │  - Selectores para status/stage                      │   │
│  │  - Gestión de notas (CRUD)                           │   │
│  │  - Formulario de edición                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      lib/api.ts (Capa de Servicios)                  │   │
│  │  - Funciones async para toda la API                  │   │
│  │  - Manejo centralizado de errores                    │   │
│  │  - Tipado explícito con tipos.ts                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
           ┌───────────────────────────────┐
           │  API REST (Playground)        │
           │  https://playground.4geeks... │
           │                               │
           │  GET /records                 │
           │  GET /records/:id             │
           │  POST /records                │
           │  PUT /records/:id             │
           │  PATCH /records/:id           │
           │  DELETE /records/:id          │
           │  GET /records/:id/notes       │
           │  POST /records/:id/notes      │
           │  DELETE /records/:id/notes/:note_id  │
           └───────────────────────────────┘
```

---

## 🧩 Capas de la Aplicación

### **1. Capa de Presentación (UI)**

**Componentes:**
- `app/page.tsx` — Página raíz (listado)
- `app/candidates/[id]/page.tsx` — Página dinámica (detalle)
- `components/candidates/CandidatesList.tsx` — Componente del listado
- `components/candidates/components/CandidateDetail.tsx` — Componente del detalle
- `components/common/UIElements.tsx` — Componentes reutilizables

**Responsabilidades:**
- Renderizar UI
- Capturar interacciones del usuario
- Mostrar estados (loading, error, vacío)
- No contienen lógica de negocio

### **2. Capa de Hooks (Estado)**

**Hooks personalizados:**
- `hooks/useCandidates.ts` — Gestiona fetch y caché de candidatos

**Responsabilidades:**
- Gestionar estado local (candidates, isLoading, error)
- Llamar a funciones de API
- Implementar caché
- Revalidar datos según necesidad

### **3. Capa de Servicios (API)**

**Archivo:**
- `lib/api.ts` — Funciones centralizadas de API

**Responsabilidades:**
- Encapsular todas las llamadas HTTP
- Implementar async/await
- Manejar errores de forma centralizada
- Transformar respuestas a tipos TypeScript
- Construir URLs correctamente

### **4. Capa de Tipos (Datos)**

**Archivo:**
- `types/candidate.ts` — Interfaces TypeScript

**Responsabilidades:**
- Definir estructuras de datos
- Validar datos recibidos de la API
- Proporcionar autocomplete en IDE

---

## 🔄 Flujo de Datos

### **Listar Candidatos (GET /records)**

```
Usuario abre / 
   ↓
app/page.tsx monta
   ↓
Hook useCandidates() ejecuta
   ↓
Llama a api.fetchCandidates()
   ↓
Realiza fetch a https://...../records
   ↓
Convierte JSON a tipos Candidate[]
   ↓
Retorna {candidates, isLoading, error}
   ↓
Componente renderiza tabla/grid
   ↓
Usuario ve listado de candidatos
```

### **Ver Detalle (GET /records/:id)**

```
Usuario click en candidato
   ↓
Navega a /candidates/[id]
   ↓
app/candidates/[id]/page.tsx recibe params
   ↓
Llama a api.fetchCandidateById(id)
   ↓
Realiza fetch a https://...../records/:id
   ↓
Convierte JSON a tipo Candidate
   ↓
CandidateDetail renderiza campos
   ↓
Usuario ve detalle completo
```

### **Cambiar Status (PATCH /records/:id)**

```
Usuario selecciona nuevo status
   ↓
CandidateDetail llama a api.updateCandidateStatus(id, newStatus)
   ↓
Realiza PATCH a https://...../records/:id
   ↓
Envía { status: newStatus }
   ↓
API retorna candidato actualizado
   ↓
Hook invalida caché o refetch
   ↓
UI se actualiza sin recarga
   ↓
Usuario ve status actualizado
```

### **Crear Nota (POST /records/:id/notes)**

```
Usuario escribe nota y submit
   ↓
CandidateDetail valida contenido
   ↓
Llama a api.createCandidateNote(id, content)
   ↓
Realiza POST a https://...../records/:id/notes
   ↓
Envía { content: "..." }
   ↓
API retorna nota creada
   ↓
Hook refetch de notas
   ↓
Componente renderiza nueva nota
   ↓
Usuario ve nota en listado
```

---

## 🎯 Decisiones Arquitectónicas

### **1. Sin Redux/Zustand**
✅ **Por qué**: React Hooks es suficiente para este nivel de complejidad
- `useState` para estado local
- `useEffect` para efectos
- `useCallback` para memoización
- Pasar props es claro y predecible

### **2. API Centralizada en `lib/api.ts`**
✅ **Por qué**: Facilita testing, cambios y mantenimiento
- Un lugar para cambiar endpoints
- Tipado consistente
- Manejo de errores unificado
- Reutilización desde cualquier componente

### **3. Hook `useCandidates` para Caché**
✅ **Por qué**: Evita requests innecesarias
- Cachea por 5 minutos
- Invalidación automática al cambiar filtros
- Función `refresh()` para refetch manual

### **4. App Router de Next.js**
✅ **Por qué**: Enrutamiento moderno y performante
- Rutas dinámicas con `[id]`
- Componentes Server-Side (opcional)
- Mejor splitting de código
- Mejor performance

### **5. TypeScript Strict**
✅ **Por qué**: Previene bugs antes del runtime
- `noImplicitAny: true`
- `strictNullChecks: true`
- Autocomplete en el IDE
- Documentación implícita

---

## 📂 Estructura de Carpetas Detallada

```
talent-pipeline-tracker/
│
├── app/                                    # App Router de Next.js
│   ├── layout.tsx                          # Layout global
│   ├── page.tsx                            # Ruta / (Listado)
│   ├── globals.css                         # Estilos globales
│   │
│   └── candidates/                         # Rutas de /candidates
│       ├── [id]/                           # Ruta dinámica
│       │   └── page.tsx                    # Detalle por ID
│       │
│       └── components/                     # Componentes de candidatos
│           └── CandidateDetail.tsx         # Componente detalle
│
├── components/                             # Componentes reutilizables
│   ├── candidates/
│   │   └── CandidatesList.tsx              # Tabla/Grid principal
│   │
│   └── common/
│       └── UIElements.tsx                  # Badge, Button, Modal, etc.
│
├── lib/                                    # Funciones utilitarias
│   └── api.ts                              # Capa de API centralizada
│
├── hooks/                                  # React Hooks personalizados
│   └── useCandidates.ts                    # Hook para candidatos con caché
│
├── types/                                  # Tipos TypeScript
│   └── candidate.ts                        # Interfaces Candidate, Note, DTOs
│
├── docs/                                   # Documentación del módulo
│   ├── SETUP.md
│   ├── ARCHITECTURE.md                     # Estás aquí
│   ├── COMPONENTS.md
│   ├── API-ROUTES.md
│   ├── TESTING.md
│   └── DEPLOYMENT.md
│
├── .env.local                              # Variables de entorno
├── package.json                            # Dependencias
├── tsconfig.json                           # Config TypeScript
├── next.config.ts                          # Config Next.js
├── tailwind.config.ts                      # Config Tailwind
├── eslint.config.js                        # Config ESLint
└── README.md                               # README específico del módulo
```

---

## 🔌 Interfaz de Componentes

### **Componente: CandidatesList**
```typescript
interface CandidatesList {
  candidatos: Candidate[]
  isLoading: boolean
  error?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onCreateNew?: () => void
}
```

### **Componente: CandidateDetail**
```typescript
interface CandidateDetail {
  candidateId: string
  candidate?: Candidate
  isLoading: boolean
  error?: string
  onStatusChange?: (newStatus: string) => void
  onStageChange?: (newStage: string) => void
  onNoteCreate?: (content: string) => void
  onNoteDelete?: (noteId: string) => void
}
```

---

## ♻️ Ciclo de Vida de una Solicitud

```
1. INICIO
   ├─ Usuario interactúa con UI
   └─ Hook o componente ejecuta función de API

2. LOADING
   ├─ Mostrar spinner/skeleton
   └─ Deshabilitar botones

3. FETCHING
   ├─ lib/api.ts realiza request
   └─ Espera respuesta

4. PROCESAMIENTO
   ├─ Validar respuesta
   ├─ Convertir a tipos
   └─ Actualizar estado

5. RENDERING
   ├─ Componente se re-renderiza
   └─ Usuario ve nuevos datos

6. FINALIZACIÓN
   ├─ Si exitoso: mostrar datos + botones habilitados
   ├─ Si error: mostrar mensaje de error
   └─ Si vacío: mostrar estado vacío
```

---

## 🛡️ Principios de Diseño

| Principio | Implementación |
|-----------|---|
| **SRP** | Cada componente tiene una sola responsabilidad |
| **DRY** | Funciones API centralizadas en `lib/api.ts` |
| **KISS** | UI simple, sin complejidad innecesaria |
| **Inmutabilidad** | No mutar estado directamente |
| **Tipado Fuerte** | Interfaz explícita en cada capa |
| **Manejo de Errores** | Try/catch centralizado en API |
| **UX Clara** | Loading, error y estados vacíos siempre visibles |

---

**Última actualización**: 21 de noviembre de 2024
