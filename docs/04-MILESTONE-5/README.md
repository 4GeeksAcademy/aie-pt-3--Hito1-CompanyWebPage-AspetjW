# 🎯 Milestone 5 — Backend Services (FastAPI)

**Estado:** 🚀 En planificación  
**Inicio previsto:** Diciembre 2024  
**Fin esperado:** Febrero 2025  
**Responsable:** Equipo de Desarrollo

---

## 📋 Descripción del Hito

**Objetivo:** Construir la API centralizada FastAPI para gestión integral de operaciones clínicas de HealthCore, integrando todas las utilidades de M2 y consumida por el frontend de M3.

**Importancia:** Este es el último hito que completa la arquitectura completa del monorepo (5/5 milestones) y permite la integración full-stack.

---

## 📌 Requerimientos Funcionales

### **Modelos de Datos**

- [ ] **Patient** — Pacientes registrados en el sistema
  - ID, nombre, apellido, DNI, email, teléfono, dirección
  - Historial médico, alergias, notas
  
- [ ] **Appointment** — Citas médicas
  - ID, patient_id, doctor_id, fecha, hora, duración
  - Estatus (programada, completada, cancelada)
  - Notas de la cita
  
- [ ] **Staff** — Personal médico y administrativo
  - ID, nombre, apellido, rol, especialidad
  - Email, teléfono, disponibilidad
  
- [ ] **MedicalRecord** — Registros médicos
  - ID, patient_id, fecha, diagnóstico, tratamiento
  - Medicinas prescritas, notas médicas

### **Endpoints CRUD Base**

- [ ] `GET /patients` — Listar pacientes (con filtros)
- [ ] `GET /patients/{id}` — Detalle del paciente
- [ ] `POST /patients` — Crear paciente
- [ ] `PUT /patients/{id}` — Actualizar paciente
- [ ] `DELETE /patients/{id}` — Eliminar paciente

- [ ] `GET /appointments` — Listar citas
- [ ] `GET /appointments/{id}` — Detalle de cita
- [ ] `POST /appointments` — Crear cita
- [ ] `PATCH /appointments/{id}` — Cambiar estado/horario
- [ ] `DELETE /appointments/{id}` — Cancelar cita

- [ ] `GET /staff` — Listar personal
- [ ] `POST /staff` — Registrar personal
- [ ] `PUT /staff/{id}` — Actualizar datos

- [ ] `GET /records` — Listar registros médicos
- [ ] `POST /records/{patient_id}` — Crear registro

### **Funcionalidades Avanzadas**

- [ ] **Autenticación JWT** — Login y tokens
- [ ] **RBAC (Role-Based Access Control)** — Permisos por rol
- [ ] **Validaciones con Pydantic** — Type-safe request bodies
- [ ] **Búsqueda y filtrado** — Reutilizar utilidades de M2
- [ ] **Paginación** — Para listados grandes
- [ ] **Reportes** — Agregaciones (citas por doctor, etc.)

---

## 🛠️ Stack Técnico

| Componente | Tecnología | Razón |
|-----------|-----------|-------|
| Framework | FastAPI | Async, validaciones automáticas, docs |
| ORM | SQLAlchemy | Type-safe, flexible, migraciones |
| DB | PostgreSQL | Relacional, production-grade |
| Auth | JWT (PyJWT) | Stateless, RESTful |
| Validación | Pydantic | Type hints, automatización |
| Testing | pytest | Fixtures, mocking, coverage |
| Docs | Swagger/OpenAPI | Auto-generada por FastAPI |

---

## 📁 Estructura de Carpetas (Esperada)

```
services/
├── README.md
├── app/
│   ├── main.py                 # Punto de entrada FastAPI
│   ├── config.py               # Configuración (env, DB, etc.)
│   ├── dependencies.py         # Inyección de dependencias
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── patient.py
│   │   ├── appointment.py
│   │   ├── staff.py
│   │   └── medical_record.py
│   ├── schemas/                # Pydantic DTOs
│   │   ├── __init__.py
│   │   ├── patient.py
│   │   ├── appointment.py
│   │   └── medical_record.py
│   ├── routers/                # API endpoints por dominio
│   │   ├── __init__.py
│   │   ├── patients.py
│   │   ├── appointments.py
│   │   ├── staff.py
│   │   ├── records.py
│   │   └── reports.py
│   ├── services/               # Lógica de negocio
│   │   ├── __init__.py
│   │   ├── patient_service.py
│   │   ├── appointment_service.py
│   │   └── report_service.py
│   ├── database.py             # Sesiones DB, migraciones
│   └── security.py             # JWT, hashing, auth
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # Fixtures pytest
│   ├── test_patients.py        # Tests de pacientes
│   ├── test_appointments.py    # Tests de citas
│   └── test_reports.py         # Tests de reportes
├── migrations/                 # Alembic migrations
├── requirements.txt            # Dependencias Python
├── .env.example                # Variables de entorno
├── Dockerfile                  # Para deployment
└── docker-compose.yml          # Dev stack local
```

---

## 🔄 Integración con Milestones Anteriores

### **M2 → M5 (TypeScript Utilities)**
- Reutilizar lógica de validaciones en `services/patient_service.py`
- Traducir utilidades de búsqueda/filtrado a Python

### **M3 → M5 (Talent Pipeline)**
- El frontend de M3 consumirá `/records` (candidatos/pacientes)
- Status/stage mapeados a estados clínicos

### **M4 → M5 (Gobernanza)**
- M5 estará bajo el protocolo de agentes (AGENTS.md)
- Memory Bank documentará la API

---

## ✅ Criterios de Aceptación

### **Código**
- [ ] 0 errores de compilación Python
- [ ] 100% type hints (mypy strict)
- [ ] 90%+ test coverage
- [ ] 0 vulnerabilidades (pip audit)
- [ ] Código limpio (black, flake8, isort)

### **Funcionalidad**
- [ ] Todos los CRUD base funcionan
- [ ] Autenticación JWT implementada
- [ ] RBAC básico (admin, doctor, staff)
- [ ] Validaciones Pydantic en todos los DTOs
- [ ] Paginación en listados

### **Documentación**
- [ ] Swagger docs auto-generadas
- [ ] README con setup e instalación
- [ ] Ejemplos de requests/responses
- [ ] Guía de desarrollo
- [ ] Notas de despliegue

### **Testing**
- [ ] 45+ tests unitarios
- [ ] 10+ tests de integración
- [ ] All tests passing
- [ ] Coverage report generado

### **Performance**
- [ ] Response time < 500ms (95th percentile)
- [ ] Queries optimizadas (no N+1)
- [ ] Índices en DB
- [ ] Connection pooling configurado

---

## 🚀 Plan de Implementación

### **Fase 1: Setup (Semana 1)**
- [ ] Crear estructura FastAPI
- [ ] Configurar DB y ORM (SQLAlchemy)
- [ ] Setup migraciones (Alembic)
- [ ] Configurar testing (pytest)

### **Fase 2: Modelos y CRUD (Semana 2)**
- [ ] Definir modelos (Patient, Appointment, etc.)
- [ ] Crear schemas Pydantic
- [ ] Implementar CRUD endpoints
- [ ] Tests unitarios

### **Fase 3: Autenticación y Validaciones (Semana 3)**
- [ ] JWT auth
- [ ] RBAC
- [ ] Validaciones de negocio
- [ ] Tests de seguridad

### **Fase 4: Reportes y Optimizaciones (Semana 4)**
- [ ] Endpoints de reportes
- [ ] Paginación
- [ ] Optimizaciones DB
- [ ] Tests de performance

### **Fase 5: Documentación e Integración (Semana 5-6)**
- [ ] Docs Swagger
- [ ] README completo
- [ ] Integración con M3
- [ ] Deployment setup

---

## 📊 Métricas de Éxito

| Métrica | Target | Status |
|---------|--------|--------|
| Test coverage | 90%+ | — |
| Endpoints CRUD | 20+ | — |
| Performance | <500ms | — |
| Uptime | 99.9% | — |
| API docs | 100% | — |
| Type coverage | 100% | — |

---

## 🔗 Enlaces de Referencia

| Recurso | Enlace |
|---------|--------|
| **FastAPI Docs** | https://fastapi.tiangolo.com |
| **SQLAlchemy** | https://sqlalchemy.org |
| **Pydantic** | https://pydantic-ai.jina.ai |
| **pytest** | https://pytest.org |
| **M2 Utilities** | [docs/01-MILESTONE-2/](../01-MILESTONE-2/) |
| **M3 Frontend** | [uis/talent-pipeline-tracker/](../../uis/talent-pipeline-tracker/) |
| **Memory Bank** | [memory-bank/](../../memory-bank/) |

---

## 📝 Notas

- **Reutilizar validaciones de M2** — Traducir funciones de `src/utils/validations.ts` a Python
- **Consumir desde M3** — El frontend de Talent Pipeline consumirá los endpoints
- **Gobernanza M4** — Este hito estará bajo el protocolo AGENTS.md
- **Full-stack ready** — Una vez completado, el sistema será totalmente funcional

---

**Documento generado por:** Copilot AI  
**Responsable:** Equipo de Desarrollo HealthCore  
**Última revisión:** Noviembre 21, 2024

