# Talent Pipeline Tracker

Herramienta frontend para gestión de candidaturas - Equipo de People & Talent.

## 🎯 Descripción

Aplicación Next.js (App Router) que consume la API REST del Talent Pipeline Tracker para permitir al equipo de People & Talent:

- Visualizar todas las candidaturas en un listado
- Filtrar por estado y etapa
- Buscar por nombre o email en tiempo real
- Ver detalle completo de cada candidato
- Cambiar estado y etapa
- Gestionar notas internas
- Registrar nuevas candidaturas
- Editar datos de candidatos existentes

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Una variable de entorno `NEXT_PUBLIC_API_URL` apuntando a la API del tracker

## 🚀 Instalación y Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
```

Alternativamente, puedes configurar esta variable de entorno en tu plataforma de despliegue.

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Build para Producción

```bash
npm run build
npm start
```

## 🏗️ Estructura del Proyecto

```
├── types/
│   └── candidate.ts           # Tipos TypeScript para Candidate, CandidateNote, DTOs, etc.
├── lib/
│   └── api.ts                 # Funciones centralizadas de acceso a la API
├── app/
│   ├── page.tsx               # Página principal (listado de candidatos)
│   ├── layout.tsx             # Layout global
│   └── candidates/
│       ├── [id]/
│       │   └── page.tsx       # Página de detalle del candidato
│       ├── components/
│       │   └── CandidateDetail.tsx  # Componente de detalle
│       └── hooks/
│           └── useCandidates.ts    # Hook personalizado para cachear candidatos
├── components/
│   ├── candidates/
│   │   ├── CandidatesList.tsx     # Componente principal del listado
│   │   └── options.ts             # Opciones de selectores (STATUS, STAGE)
│   └── common/
│       └── UIElements.tsx         # Componentes UI reutilizables
├── next.config.ts            # Configuración de Next.js
├── tsconfig.json             # Configuración de TypeScript
└── tailwind.config.ts        # Configuración de Tailwind CSS
```

## 🎨 Stack Tecnológico

- **Framework**: Next.js 16+ (App Router)
- **Lenguaje**: TypeScript 5+
- **UI**: Tailwind CSS 4+
- **React**: 19+
- **State Management**: React Hooks (useState, useCallback, useEffect, useRef)
- **HTTP Client**: Fetch API nativa
- **Sin dependencias externas** de state management (Redux, Zustand, etc.)

## 📚 Componentes Principales

### CandidatesList
Componente del listado principal que:
- Renderiza una tabla de candidatos
- Integra filtros de status y stage usando `useSearchParams` sin reload de página
- Implementa búsqueda reactiva por nombre/email
- Incluye modal para registrar nuevos candidatos

### CandidateDetail
Componente de detalle que:
- Muestra todos los campos del candidato
- Permite actualizar status y stage vía selectores
- Gestiona CRUD de notas internas
- Incluye modal para editar datos del candidato

### UIElements
Componentes reutilizables:
- `LoadingSkeleton` - Esqueleto de carga
- `ErrorMessage` - Mensaje de error
- `EmptyState` - Estado vacío
- `Badge` - Etiquetas coloreadas
- `Button` - Botones tipados
- `Modal` - Modales genéricos
- `FormInput`, `FormSelect`, `FormTextarea` - Campos de formulario

## 🔄 Manejo de Estado y Datos

### Hook `useCandidates`
Hook personalizado que:
- Realiza fetch centralizado de candidatos
- Implementa caché de 5 minutos
- Detecta cambios en filtros automáticamente
- Retorna: `candidates[]`, `isLoading`, `error`, `refresh()`

### API Centralizada (`lib/api.ts`)
Todas las llamadas HTTP están centralizadas:
- `fetchCandidates()` - GET /records con filtros opcionales
- `fetchCandidateById()` - GET /records/:id
- `createCandidate()` - POST /records
- `updateCandidate()` - PUT /records/:id
- `updateCandidateStatus()` - PATCH /records/:id
- `updateCandidateStage()` - PATCH /records/:id
- `fetchCandidateNotes()` - GET /records/:id/notes
- `createCandidateNote()` - POST /records/:id/notes
- `deleteCandidateNote()` - DELETE /records/:id/notes/:note_id

Todas las funciones incluyen:
- Tipado explícito (parámetros y retorno)
- Manejo centralizado de errores
- Conversión de errores a mensajes user-friendly

## 🎯 Funcionalidades Implementadas

### ✅ Vistas y Navegación
- [x] Página de listado de candidaturas (/)
- [x] Página de detalle de candidatura (/candidates/[id])
- [x] Navegación sin recargas con Next.js App Router

### ✅ Listado de Candidaturas
- [x] Muestra nombre, puesto, estado y etapa
- [x] Filtro por estado vía query parameter
- [x] Filtro por etapa vía query parameter
- [x] Búsqueda reactiva por nombre o email
- [x] Estados: cargando, éxito, error

### ✅ Detalle de Candidatura
- [x] Muestra todos los campos disponibles
- [x] Control para actualizar status (PATCH)
- [x] Control para actualizar stage (PATCH)
- [x] Listado de notas internas
- [x] Crear notas (POST)
- [x] Eliminar notas (DELETE)

### ✅ Gestión de Candidaturas
- [x] Formulario para registrar nuevas candidaturas (POST)
- [x] Formulario para editar candidaturas (PUT)
- [x] Validación de campos requeridos
- [x] Feedback de éxito/error

### ✅ Manejo Asíncrono
- [x] Todas las llamadas con async/await
- [x] Estados de carga visibles en UI
- [x] Manejo de errores con mensajes descriptivos
- [x] Actualización de UI post PATCH/PUT/POST sin recarga

## 🧪 Testing Local

### Validación de TypeScript
```bash
npm run typecheck
```

### Lint de código
```bash
npm run lint
```

## 🌐 Despliegue

La aplicación está lista para desplegarse en:
- Vercel (recomendado para Next.js)
- Netlify
- AWS Amplify
- Cualquier servidor que soporte Node.js

**Requisito**: Configurar la variable de entorno `NEXT_PUBLIC_API_URL` en tu plataforma.

## 📖 Notas Importantes

### Estructura de Rutas
- La ruta dinámica `/candidates/[id]` captura el ID del candidato desde la URL
- Los filtros se mantienen en la URL mediante `useSearchParams` sin recargas de página
- La navegación usa `next/navigation` para transiciones suaves

### Tipos TypeScript
- Todos los tipos están definidos en `types/candidate.ts`
- Los campos de entrada siguen la estructura exacta de la API del tracker
- Los tipos `CandidateStatus` y `CandidateStage` usan snake_case para coincidir con la API
- Las etiquetas (`STATUS_LABELS`, `STAGE_LABELS`) están en español para la UI

### Validación de Formularios
- Se validan campos requeridos antes de enviar
- Se muestran errores específicos en cada campo
- Tras errores en PATCH/PUT/POST, se muestra un mensaje global

### Caché de Datos
- El hook `useCandidates` cachea los resultados por 5 minutos
- El caché se invalida automáticamente al cambiar filtros
- Función `refresh()` disponible para forzar refetch

## 🤝 Contribuir

Este proyecto es parte del curriculum de 4Geeks Academy. Para cambios, crea una rama feature y abre un Pull Request contra `main`.

## 📄 Licencia

Proyecto educativo de 4Geeks Academy.
