# 🛠️ Contexto Técnico - HealthCore Engineering

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript 5.3+
- **CSS**: Tailwind CSS v4
- **Gestión de Estado**: React Hooks (sin Redux/Zustand)
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint, Prettier

### Backend & Servicios
- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5.3+
- **API REST**: Express.js / Fastify
- **Base de Datos**: PostgreSQL 14+
- **IA/ML**: Python 3.11+ con FastAPI (modelos predictivos)
- **Caching**: Redis (opcional, para escalabilidad)

### Infraestructura
- **Containerización**: Docker + Docker Compose
- **Orquestación**: Kubernetes (opcional, para prod)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend) / AWS ECS o similar (backend)
- **Monitoreo**: Prometheus + Grafana (futuro)

### Herramientas de Desarrollo
- **Control de Versiones**: Git
- **Repositorio**: GitHub
- **Gestor de Paquetes**: npm
- **Build Tool**: tsc (TypeScript compiler)
- **Documentación**: Markdown en `/docs`

---

## 📂 Mapeo del Monorepo

```
HealthCore/
├── BRIEFING.md                           ← Contexto empresarial (M4)
├── AGENTS.md                             ← Protocolo de agentes (M4)
│
├── memory-bank/                          ← Memory Bank para agentes (M4)
│   ├── projectbrief.md                   ← Visión y problemas de negocio
│   ├── techContext.md                    ← Este archivo
│   └── progress.md                       ← Estado de hitos y roadmap
│
├── .agents/                              ← Configuración de agentes (M4)
│   ├── rules/
│   │   └── git-workflow.md              ← Reglas de desarrollo
│   └── skills/
│       └── prepare-feature-pr/
│           └── SKILL.md                  ← Skill de preparación de PR
│
├── docs/                                 ← Documentación centralizada
│   ├── README.md                         ← Índice maestro
│   ├── QUICKSTART.md                     ← Setup en 5 minutos
│   │
│   ├── 00-CONTEXT/
│   │   ├── README.md
│   │   └── BRIEFING.md                   ← Briefing contextual
│   │
│   ├── 01-MILESTONE-2/                   ← M2: TypeScript Utilities
│   │   ├── README.md
│   │   ├── IMPLEMENTATION.md
│   │   └── CHECKLIST.md
│   │
│   └── 02-MILESTONE-3/                   ← M3: Talent Pipeline Tracker
│       ├── README.md
│       ├── SETUP.md
│       ├── ARCHITECTURE.md
│       ├── COMPONENTS.md
│       ├── API-ROUTES.md
│       ├── TESTING.md
│       ├── DEPLOYMENT.md
│       └── TROUBLESHOOTING.md
│
├── src/                                  ← M2: Utilidades TypeScript
│   ├── types/
│   │   └── models.ts                     ← Interfaces HealthCore
│   ├── utils/
│   │   ├── search.ts                     ← Búsqueda lineal/binaria
│   │   ├── collections.ts                ← Filtros, ordenamiento, agrupación
│   │   ├── transformations.ts            ← Agregaciones y reportes
│   │   └── validations.ts                ← Validación de reglas de negocio
│   ├── index.ts                          ← Exportaciones barrel
│   └── tsconfig.json
│
├── uis/                                  ← Interfaces de Usuario
│   ├── website/                          ← Sitio corporativo público (futuro)
│   │   └── ...
│   │
│   └── talent-pipeline-tracker/          ← M3: Gestión de candidatos
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       │
│       ├── types/
│       │   └── candidate.ts              ← Tipos de candidatos
│       │
│       ├── lib/
│       │   └── api.ts                    ← Funciones de API
│       │
│       ├── app/
│       │   ├── layout.tsx                ← Layout principal
│       │   ├── page.tsx                  ← Listado de candidatos
│       │   ├── loading.tsx               ← Estados de carga
│       │   └── candidates/
│       │       └── [id]/
│       │           ├── page.tsx          ← Detalle de candidato
│       │           └── loading.tsx
│       │
│       ├── components/
│       │   ├── CandidateTable.tsx
│       │   ├── CandidateCard.tsx
│       │   ├── CandidateForm.tsx
│       │   ├── NotesList.tsx
│       │   ├── Filter.tsx
│       │   ├── SearchBar.tsx
│       │   └── ...
│       │
│       ├── public/
│       │   └── favicon.ico
│       │
│       └── .env.local                    ← Configuración local
│
├── services/                             ← Backend (APIs)
│   ├── claims-processor/                 ← Procesador de reclamaciones (futuro)
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── ai-predictor/                     ← Modelos de IA (futuro)
│       ├── src/
│       ├── requirements.txt
│       └── Dockerfile
│
├── infra/                                ← Configuración de infraestructura
│   ├── docker-compose.yml
│   ├── k8s/                              ← Manifiestos Kubernetes (futuro)
│   └── terraform/                        ← IaC (futuro)
│
├── workflows/                            ← GitHub Actions
│   ├── ci.yml                            ← CI/CD pipeline
│   └── deploy.yml                        ← Deploy automático
│
├── package.json                          ← Dependencias raíz (workspace)
├── tsconfig.json                         ← Configuración TypeScript
├── .eslintrc.json                        ← Configuración ESLint
├── prettier.config.js                    ← Configuración Prettier
│
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE/
    └── workflows/
```

---

## 🔐 Convenciones de Desarrollo

### TypeScript
- **Strict Mode**: `"strict": true` en tsconfig.json
- **Sin `any`**: Excepción solo con comentario `@ts-ignore`
- **Tipos Genéricos**: Reutilizables, naming claro (T, U, R)
- **Namespaces**: Evitar, usar módulos ES6

### Funciones
- **Puras e inmutables**: No modifican inputs
- **Responsabilidad única**: Una tarea por función
- **Naming**: camelCase para funciones, PascalCase para tipos
- **JSDoc**: Documentación de público API

### Variables y Constantes
- **const** por defecto, **let** si muta
- **camelCase** para variables locales
- **UPPER_SNAKE_CASE** para constantes globales
- **Descriptivas**: nombres largos pero claros

### Commits
```
type(scope): descripción breve

Descripción más detallada (opcional).
Pueden ser varias líneas.

BREAKING CHANGE: descripción si aplica
Closes #123

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

**Tipos válidos**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato/indentación (sin cambio lógico)
- `refactor`: Reorganización de código
- `perf`: Mejora de rendimiento
- `test`: Adición/modificación de tests
- `chore`: Dependencias, configuración

### Ramas
- **Feature**: `feat/milestone-X-{nombre}`
- **Fix**: `fix/{nombre-corto}`
- **Docs**: `docs/{nombre-corto}`

**Nunca** commit directo a `main`, siempre vía PR con revisión

---

## 🎯 Estándares de Código

### Formato
- **Indentación**: 2 espacios (Prettier enforced)
- **Línea máxima**: 100 caracteres
- **Punto y coma**: Obligatorio
- **Quotes**: Dobles ("") por defecto

### Organización de Archivos
```typescript
// 1. Imports
import { type } from "external";
import { type } from "./internal";

// 2. Types/Interfaces
interface MyInterface { }

// 3. Constantes
const CONSTANT = "value";

// 4. Funciones
export function myFunction() { }

// 5. Exportación por defecto (si aplica)
export default MyClass;
```

### Comentarios
- **Español obligatorio**
- Solo para lógica compleja, no obvio
- Formato: `// Breve explicación`
- Bloques: `/** JSDoc */`

---

## 📦 Dependencias Críticas

### M2 (TypeScript Utilities)
```json
{
  "typescript": "^5.3.3",
  "jest": "^29.7.0"
}
```

### M3 (Talent Pipeline Tracker)
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "typescript": "^5.3.3",
  "tailwindcss": "^3.4.0"
}
```

**Prohibido agregar sin aprobación**:
- Redux, Zustand, Jotai (gestión de estado)
- Axios, node-fetch (use fetch nativo)
- UI frameworks (Material-UI, Chakra, etc.)

---

## 🧪 Testing & Calidad

### Cobertura Mínima
- **M2 (TypeScript)**: 80% de coverage
- **M3 (React)**: 60% de coverage
- **Global**: 0 errores TypeScript

### Herramientas
```bash
# Type checking
npx tsc --noEmit

# Linting
npx eslint src/ uis/

# Formatting check
npx prettier --check .

# Testing
npm run test
npm run test:coverage
```

---

## 🚀 Despliegue

### Local (Desarrollo)
```bash
# M2: Compilar utilidades
cd /
npm run build

# M3: Dev server
cd uis/talent-pipeline-tracker
npm run dev
```

### Staging/Producción
- **Frontend**: Vercel
- **Backend**: AWS ECS / GCP Cloud Run
- **Base de Datos**: AWS RDS PostgreSQL
- **DNS**: Route 53

---

## 🔄 CI/CD Pipeline

### Triggers
- Push a `main`, `develop`, `feat/*`
- Pull Request

### Pasos Obligatorios
1. **Install**: Instalar dependencias
2. **Type Check**: `tsc --noEmit`
3. **Lint**: `eslint`
4. **Test**: `jest`
5. **Build**: `npm run build`
6. **Deploy** (solo main): Deploy a staging/prod

---

## 🔐 Zonas Restringidas

**Archivos que NO deben ser modificados sin autorización de PM**:
- `/BRIEFING.md` (usar `memory-bank/projectbrief.md` para actualizar)
- `/docs/README.md` (es el índice maestro)
- `/package.json` root (contactar antes de agregar dependencia)
- `/.github/workflows/` (cambios en CI/CD)
- `/uis/*/next.config.js` (configuración crítica)

---

## 📞 Contacto y Escalación

**Preguntas técnicas**: Revisar `/docs` primero  
**Decisiones de arquitectura**: Crear issue de discusión  
**Bugs críticos**: Crear issue con etiqueta `critical`  
**Cambios a BRIEFING**: Coordinar con PM

---

**Versión**: 1.0.0  
**Última actualización**: 21 de noviembre de 2026  
**Responsable**: HealthCore Engineering Team
