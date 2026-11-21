# 🏥 HealthCore — Monorepo (5 Milestones)

**Estado del Proyecto:** 4/5 Milestones completados ✅ (En progreso 🚀)

---

## 📖 ¿Qué es HealthCore?

HealthCore es una **plataforma integral de gestión sanitaria** que resuelve la fragmentación operativa en clínicas y centros médicos pequeños. Integra coordinación de recursos humanos, automatización de procesos clínicos y análisis de datos en una solución coherente.

**Repositorio:** 4GeeksAcademy/aie-pt-3--Hito1-CompanyWebPage-AspetjW  
**Empresa:** HealthCore Innovators GmbH  
**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Python, FastAPI

---

## 🚀 Comenzar (3 minutos)

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar verificación
npm run build

# 3. Ver documentación
# → README.md (este archivo)
# → docs/QUICKSTART.md para instalación detallada
# → docs/PROGRESS.md para estado actual
```

**Documentación de apoyo:**
- 📄 [BRIEFING.md](BRIEFING.md) — Visión empresarial y contexto
- 📄 [AGENTS.md](AGENTS.md) — Protocolo de agentes de desarrollo (M4)
- 📁 [docs/](docs/) — Documentación detallada por milestone

---

## 📊 Estado Actual del Proyecto

| Hito | Nombre | Estatus | LOC |
|------|--------|--------|-----|
| **M1** | Business Context | ✅ Completado | — |
| **M2** | TypeScript Utilities | ✅ Completado | 1,888 |
| **M3** | Talent Pipeline Tracker | ✅ Completado | 502 |
| **M4** | AI-driven Engineering | ✅ Completado | 1,883 |
| **M5** | Backend Services | 🚀 En desarrollo | — |

**Detalles completos:** [docs/PROGRESS.md](docs/PROGRESS.md)

---

## 🗂️ Estructura del Monorepo

```
📦 HealthCore/
├── 📄 README.md                    ← Estás aquí
├── 📄 BRIEFING.md                  ← M1: Contexto empresarial
├── 📄 AGENTS.md                    ← M4: Protocolo de agentes
│
├── 📁 src/                         ← M2: TypeScript Utilities
│   ├── types/
│   ├── utils/
│   └── __tests__/
│
├── 📁 uis/                         ← M3: Frontend
│   ├── website/                    ← Sitio corporativo (Next.js)
│   ├── backoffice/                 ← Backoffice interna (Next.js)
│   └── talent-pipeline-tracker/    ← Talent Pipeline (Next.js)
│
├── 📁 services/                    ← M5: Backend Services (en desarrollo)
│
├── 📁 memory-bank/                 ← M4: Contexto persistente
│   ├── projectbrief.md
│   ├── techContext.md
│   └── progress.md
│
├── 📁 .agents/                     ← M4: Gobernanza
│   ├── rules/
│   └── skills/
│
└── 📁 docs/                        ← Documentación centralizada
    ├── QUICKSTART.md
    ├── PROGRESS.md
    ├── AUDIT.md
    ├── 00-CONTEXT/
    ├── 01-MILESTONE-2/
    ├── 02-MILESTONE-3/
    ├── 03-MILESTONE-4/
    └── 04-MILESTONE-5/
```

---

## 📚 Guía de Documentación

### **Para Comenzar (5 min)**
→ [docs/QUICKSTART.md](docs/QUICKSTART.md)

### **Ver Estado Actual**
→ [docs/PROGRESS.md](docs/PROGRESS.md)
- Milestones completados
- Timeline
- Próximos pasos

### **Validaciones y Auditoría**
→ [docs/AUDIT.md](docs/AUDIT.md)
- Checklist de validación
- Métricas del proyecto
- Reporte final

### **Detalles por Milestone**

| Hito | Documentación | Contenido |
|------|---------------|----------|
| **M1** | [docs/00-CONTEXT/](docs/00-CONTEXT/) | Contexto empresarial (BRIEFING) |
| **M2** | [docs/01-MILESTONE-2/](docs/01-MILESTONE-2/) | Utilidades TypeScript, testing |
| **M3** | [docs/02-MILESTONE-3/](docs/02-MILESTONE-3/) | Talent Pipeline Tracker, rutas, componentes |
| **M4** | [docs/03-MILESTONE-4/](docs/03-MILESTONE-4/) | Memory Bank, Agents Protocol, gobernanza |
| **M5** | [docs/04-MILESTONE-5/](docs/04-MILESTONE-5/) | Backend Services (planificación) |

---

## 🛠️ Comandos Principales

```bash
# Instalar dependencias
npm install

# Compilar (TypeScript)
npm run build

# Ejecutar tests
npm run test

# Dev servers
npm run dev:website          # Sitio corporativo
npm run dev:backoffice       # Backoffice
npm run dev:talent-tracker   # Talent Pipeline

# Linting
npm run lint
npm run lint:fix
```

---

## 📋 Requisitos de Desarrollo

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **TypeScript** ≥ 5.x
- **Git** (para ramas por milestone)

---

## 🔗 Enlaces Rápidos

| Recurso | Enlace |
|---------|--------|
| **Company Brief** | [BRIEFING.md](BRIEFING.md) |
| **Agent Protocol** | [AGENTS.md](AGENTS.md) |
| **Memory Bank** | [memory-bank/](memory-bank/) |
| **API Docs** | https://playground.4geeks.com/tracker/api/v1/docs |
| **GitHub Org** | https://github.com/4GeeksAcademy |

---

## ✅ Validación Pre-Entrega

```bash
# Script unificado
npm run validate
# → Compilación ✅
# → Tests ✅
# → Linting ✅
# → Auditoría ✅
```

Detalles: [docs/AUDIT.md](docs/AUDIT.md)

---

## 🤝 Contribuir

Cada milestone tiene su propia rama:

```bash
# Para M5 (Backend Services)
git switch -c feature/milestone-5
# → Implementar cambios
# → Crear PR
```

Protocolo de agentes: [AGENTS.md](AGENTS.md)  
Memory Bank: [memory-bank/](memory-bank/)

---

## 📞 Soporte

- 📖 Documentación: [docs/](docs/)
- 🐛 Issues: GitHub Issues
- 💬 Discusiones: GitHub Discussions
- 📧 Contact: (ver BRIEFING.md para datos de contacto)

---

**Versión:** v2.0.0-M4  
**Última actualización:** Noviembre 21, 2024  
**Responsable:** Copilot AI + Equipo de Desarrollo
