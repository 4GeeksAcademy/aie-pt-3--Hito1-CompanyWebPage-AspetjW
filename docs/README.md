# 📚 Documentación del Proyecto

Bienvenido a la documentación centralizada del proyecto transversal de 4Geeks Academy. Este documento es tu punto de entrada para entender la estructura, el contexto y el progreso de cada milestone.

---

## 🚀 Comenzar Rápido

Nuevo en el proyecto? Empieza aquí:

- **[QUICKSTART.md](./QUICKSTART.md)** — Configuración inicial y primeros pasos
- **[00-CONTEXT](./00-CONTEXT/README.md)** — Briefing y contexto de la empresa

---

## 📋 Índice de Milestones

### **Milestone 1: Página Web Pública** ✅
Desarrollo de la identidad visual y sitio web público de la empresa.

- **Status**: Completado
- **Stack**: HTML5, CSS3, Tailwind CSS v4, JavaScript vanilla
- **Ver**: [CONTEXT.md](./00-CONTEXT/README.md)

---

### **Milestone 2: Utilidades TypeScript** ✅
Implementación de funcionalidades internas: búsqueda, filtrado, ordenamiento, agregaciones y validaciones.

- **Status**: Completado
- **Stack**: TypeScript, funciones puras
- **Ubicación**: `src/utils/` y `src/types/`
- **Documentación completa**:
  - [📖 Resumen del Hito](./01-MILESTONE-2/README.md)
  - [🛠️ Implementación Técnica](./01-MILESTONE-2/IMPLEMENTATION.md)
  - [✅ Checklist de Verificación](./01-MILESTONE-2/CHECKLIST.md)
  - [📚 Referencia de API](./01-MILESTONE-2/API-REFERENCE.md)
  - [💡 Ejemplos de Uso](./01-MILESTONE-2/EXAMPLES.md)

---

### **Milestone 3: Talent Pipeline Tracker** 🔄
Frontend Next.js para gestión del pipeline de candidatos.

- **Status**: En desarrollo
- **Stack**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Ubicación**: `uis/talent-pipeline-tracker/`
- **API**: https://playground.4geeks.com/tracker/api/v1/docs
- **Documentación completa**:
  - [📖 Resumen del Hito](./02-MILESTONE-3/README.md)
  - [⚙️ Setup e Instalación](./02-MILESTONE-3/SETUP.md)
  - [🏗️ Arquitectura](./02-MILESTONE-3/ARCHITECTURE.md)
  - [🧩 Componentes](./02-MILESTONE-3/COMPONENTS.md)
  - [🔌 Rutas y API](./02-MILESTONE-3/API-ROUTES.md)
  - [🧪 Testing y Verificación](./02-MILESTONE-3/TESTING.md)
  - [🚢 Despliegue](./02-MILESTONE-3/DEPLOYMENT.md)
  - [🔧 Troubleshooting](./02-MILESTONE-3/TROUBLESHOOTING.md)

---

## 📁 Estructura del Proyecto

```
aie-pt-3--Hito1-CompanyWebPage-AspetjW/
│
├── 📚 docs/                          ← 👈 Toda la documentación centralizada
│   ├── README.md                     ← Estás aquí
│   ├── QUICKSTART.md
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   │
│   ├── 00-CONTEXT/
│   │   └── README.md                 ← Briefing y contexto de empresa
│   │
│   ├── 01-MILESTONE-2/
│   │   ├── README.md
│   │   ├── IMPLEMENTATION.md
│   │   ├── CHECKLIST.md
│   │   ├── API-REFERENCE.md
│   │   └── EXAMPLES.md
│   │
│   └── 02-MILESTONE-3/
│       ├── README.md
│       ├── SETUP.md
│       ├── ARCHITECTURE.md
│       ├── COMPONENTS.md
│       ├── API-ROUTES.md
│       ├── TESTING.md
│       ├── DEPLOYMENT.md
│       └── TROUBLESHOOTING.md
│
├── 📂 src/                           ← Lógica TypeScript (M2)
│   ├── types/
│   ├── utils/
│   └── index.ts
│
├── 📂 uis/                           ← Aplicaciones frontend
│   └── talent-pipeline-tracker/      ← Next.js App (M3)
│       ├── app/
│       ├── components/
│       ├── types/
│       ├── lib/
│       └── docs/
│
├── 🔧 package.json
├── 📄 tsconfig.json
├── 🚫 .gitignore
└── 📖 README.md                      ← Raíz (apunta a docs/)
```

---

## 🎯 Funcionalidades Principales

### **Por Milestone**

| Milestone | Qué Implementa | Validación |
|-----------|---|---|
| **M1** | Sitio web público (landing page) | Publicado en producción |
| **M2** | Funciones TypeScript reutilizables | Tests de lógica |
| **M3** | UI interna: Pipeline de candidatos | Funcionalidad end-to-end |

### **Checklist Global**

- [x] Milestone 1: Web pública ✅
- [x] Milestone 2: Utilities TypeScript ✅
- [ ] Milestone 3: Talent Pipeline Tracker (en progreso)
  - [ ] Setup inicial del proyecto Next.js
  - [ ] Integración con API del tracker
  - [ ] Listado de candidatos con filtros
  - [ ] Detalle de candidato con gestión de notas
  - [ ] Formularios de creación/edición
  - [ ] Despliegue en producción

---

## 🛠️ Stack Tecnológico

```
Frontend (M1)
├── HTML5 Semántico
├── CSS3 + Tailwind CSS v4
└── JavaScript Vanilla

Backend / Lógica (M2)
├── TypeScript
├── Funciones Puras
└── Sin frameworks externos

Frontend Avanzado (M3)
├── Next.js (App Router)
├── React 18+
├── TypeScript
└── Tailwind CSS v4
```

---

## 🔗 Enlaces Útiles

### **Documentación de Referencia**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **API Externa**
- [Playground Tracker API](https://playground.4geeks.com/tracker/api/v1/docs)

### **Recursos del Curso**
- [4Geeks Academy](https://4geeks.com)
- [Syllabus](https://learn.4geeks.com)
- [Repositorio Monorepo Template](https://github.com/4GeeksAcademy/ai-engineering-company-project-monorepo)

---

## 📝 Notas de Desarrollo

### **Convenciones de Código**

- **Nombres en camelCase** para funciones/variables
- **PascalCase** para tipos, interfaces y componentes
- **Kebab-case** para nombres de archivos y carpetas
- **Español** para comentarios y documentación
- **Sin `any` en TypeScript** — tipado explícito siempre

### **Git Workflow**

```bash
# 1. Crear rama por milestone
git switch -c feature/milestone-X

# 2. Commits descriptivos
git commit -m "Implementa [funcionalidad] para [contexto]"

# 3. Push a remoto
git push origin feature/milestone-X

# 4. Abrir PR
# → Merge a main cuando esté aprobado
```

---

## 👥 Autores

- **Estudiante**: [Tu nombre]
- **Empresa**: [Tu empresa del briefing]
- **Bootcamp**: 4Geeks Academy AI Engineering
- **Período**: 2024-2025

---

## 📞 Soporte

¿Problemas o dudas?

1. Revisa el **[TROUBLESHOOTING.md](./02-MILESTONE-3/TROUBLESHOOTING.md)** del milestone específico
2. Consulta la **[ARCHITECTURE.md](./ARCHITECTURE.md)** para entender la estructura general
3. Lee el **[CONTRIBUTING.md](./CONTRIBUTING.md)** para convenciones del proyecto

---

## 📊 Progreso General

```
Milestone 1: ████████████████████ 100% ✅
Milestone 2: ████████████████████ 100% ✅
Milestone 3: ████████░░░░░░░░░░░░  40% 🔄
```

**Próximas tareas**: Implementación de M3, testing y despliegue.

---

**Última actualización**: 21 de noviembre de 2024

Generado por tu asistente de Copilot SDK. ✨
