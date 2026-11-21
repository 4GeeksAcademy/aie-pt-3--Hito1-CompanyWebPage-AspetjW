# ARCHITECTURE_PROPOSAL.md — Backend & Infrastructure Design

**HealthCore Healthcare Technology Platform**

**Documento Técnico para CTO**  
**Versión**: 1.0  
**Fecha**: 21 de Noviembre de 2026  
**Responsable**: Principal Software Architect + Engineering Team

---

## 📑 Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Selección y Justificación del Patrón Arquitectónico](#2-selección-y-justificación-del-patrón-arquitectónico)
3. [Estructura de Módulos FastAPI](#3-estructura-de-módulos-fastapi)
4. [Mapa de Routers y Endpoints por Dominio](#4-mapa-de-routers-y-endpoints-por-dominio)
5. [Coexistencia Frontend-Backend Desacoplada](#5-coexistencia-frontend-backend-desacoplada)
6. [Matriz de Riesgos y Puntos Críticos](#6-matriz-de-riesgos-y-puntos-críticos)
7. [Recomendaciones y Próximos Pasos](#7-recomendaciones-y-próximos-pasos)

---

## 1. Resumen Ejecutivo

### 1.1 Propósito del Backend

El backend de **HealthCore** es el pilar central que habilita:

- **Automatización de Reclamaciones Médicas**: Procesamiento acelerado de reclamaciones con validación de reglas de negocio críticas.
- **Análisis Predictivo de Inasistencia**: Modelos de ML que predicen no-shows y optimizan la eficiencia operativa.
- **Centralización de Datos Clínicos**: Almacenamiento estructurado de notas, citas y datos de pacientes.
- **Gobernanza y Transparencia**: Auditoría completa de cambios, reportes regulatorios y trazabilidad de decisiones.

### 1.2 Valor Empresarial

| Métrica | Impacto |
|---------|---------|
| **Reducción de tiempo de procesamiento** | De semanas → 24-48 horas |
| **Aumento de tasas de aprobación correcta** | -25-30% denegaciones injustificadas |
| **Mejora en predicción de no-shows** | Modelos con 80%+ de precisión |
| **Cumplimiento normativo** | HIPAA + auditoría completa |
| **Escalabilidad** | Soporte para 100K+ reclamaciones/día |

### 1.3 Visión General de la Solución

```
┌─────────────────────────────────────────────────────────────┐
│                     ARQUITECTURA GENERAL                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │  /uis/       │    │  /uis/       │    │   /services/ │   │
│  │  website     │    │  backoffice  │    │      api     │   │
│  │  (Public)    │    │  (Internal)  │    │  (FastAPI)   │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│        │                    │                     │           │
│        └────────────────────┼─────────────────────┘           │
│                             │                                 │
│                      ┌──────▼──────┐                         │
│                      │  API Layer   │                         │
│                      │   (REST)     │                         │
│                      └──────┬──────┘                         │
│                             │                                 │
│        ┌────────────────────┼────────────────────┐           │
│        │                    │                    │           │
│  ┌─────▼──────┐    ┌────────▼────────┐  ┌──────▼─────┐    │
│  │  Services  │    │  ML/Analytics   │  │  Auth/JWT  │    │
│  │  Layer     │    │  (Python)       │  │  Middleware│    │
│  └─────┬──────┘    └────────┬────────┘  └──────┬─────┘    │
│        │                    │                   │           │
│        └────────────────────┼───────────────────┘           │
│                             │                                │
│        ┌────────────────────▼────────────────────┐          │
│        │        Data Access / Repository         │          │
│        │          (ORM + SQLAlchemy)             │          │
│        └────────────────────┬────────────────────┘          │
│                             │                                │
│        ┌────────────────────▼────────────────────┐          │
│        │        PostgreSQL Database              │          │
│        │   (Schemas: claims, patients, etc.)     │          │
│        └─────────────────────────────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Selección y Justificación del Patrón Arquitectónico

### 2.1 Patrón Propuesto: **Arquitectura en Capas Orientada a Dominios**

#### Definición

La arquitectura está organizada en **capas horizontales de responsabilidad** (Routers → Services → Data Access) con una **orientación vertical por dominios de negocio** (Claims, Patients, Providers, Appointments, etc.).

#### Capas Definidas

```
┌─────────────────────────────────────────────────────┐
│          Capa de Presentación / Routing             │
│        (APIRouter, Validación HTTP, Schemas)       │
└─────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────┐
│          Capa de Lógica de Negocio                  │
│   (Services, Use Cases, Reglas, Validaciones)      │
└─────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────┐
│        Capa de Acceso a Datos / Persistence         │
│     (Repositories, ORM, Queries SQL, Schemas DB)   │
└─────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────┐
│          Capa de Infraestructura                    │
│      (PostgreSQL, Cache, Logs, Alertas)            │
└─────────────────────────────────────────────────────┘
```

#### Por Dominio

```
/services/api/
├── claims/              ← Dominio: Reclamaciones
│   ├── routers.py       ├── GET /api/v1/claims
│   ├── services.py      ├── POST /api/v1/claims
│   ├── schemas.py       ├── PATCH /api/v1/claims/{id}
│   └── repository.py    └── DELETE /api/v1/claims/{id}
│
├── patients/            ← Dominio: Pacientes
│   ├── routers.py
│   ├── services.py
│   ├── schemas.py
│   └── repository.py
│
├── providers/           ← Dominio: Proveedores
├── appointments/        ← Dominio: Citas
└── clinical_notes/      ← Dominio: Notas Clínicas
```

### 2.2 Justificación para HealthCore

| Criterio | FastAPI Layers | MVC Clásico | Serverless | Microservicios |
|----------|---|---|---|---|
| **Volumen de datos** (100K+ claims/día) | ✅ Alto rendimiento | ⚠️ Dependiente de framework | ⚠️ Latencia cold start | ✅ Escalabilidad horizontal |
| **Complejidad de reglas** (20+ validaciones) | ✅ Separación clara de lógica | ✅ Posible | ❌ Difícil de mantener | ✅ Dominio específico |
| **Modelos de IA** (Predicción, clustering) | ✅ Integración Python nativa | ❌ Requerirá sidecar | ⚠️ Tiempo límite | ✅ Microservicio IA |
| **Equipo actual** (5-7 engineers) | ✅ Fácil onboarding | ⚠️ Curva aprendizaje | ❌ Demasiado distribuido | ❌ Complejidad operativa |
| **Auditoría/Compliance** (HIPAA) | ✅ Logging centralizadocontrolado | ✅ Posible | ⚠️ Difícil de auditar | ✅ Observabilidad clara |
| **Despliegue/DevOps** | ✅ Docker simple | ✅ Docker simple | ⚠️ Vendor lock-in | ❌ Orquestación compleja |

### 2.3 Alternativas Descartadas

**MVC Clásico (Django, Rails):**
- ❌ Menos performante en volúmenes altos
- ❌ Menos flexibilidad para modelos de IA en Python
- ❌ Menos idóneo para arquitecturas event-driven

**Serverless (AWS Lambda, GCP Functions):**
- ❌ Cold start > 2s afecta UX en tiempo real
- ❌ Difícil de debuggear y testear localmente
- ❌ Límite de 15 minutos ejecución (insuficiente para procesamiento batch)

**Microservicios Completos:**
- ❌ Complejidad operativa muy alta (Kubernetes, service mesh)
- ❌ Equipo pequeño no puede mantener 5-6 servicios
- ✅ Aplica para M6+ (segunda fase: notificaciones, webhooks)

**→ Decisión: Monolito modular (FastAPI en capas) con preparación para desacoplamiento en Fase 2.**

---

## 3. Estructura de Módulos FastAPI

### 3.1 Árbol de Directorios Estándar

```
/services/api/
│
├── main.py                          # Aplicación FastAPI principal
├── config.py                        # Configuración (env vars, settings)
├── dependencies.py                  # Inyección de dependencias globales
│
├── core/                            # Core compartido
│   ├── __init__.py
│   ├── security.py                  # JWT, RBAC, permisos
│   ├── exceptions.py                # Excepciones personalizadas
│   ├── logging.py                   # Configuración de logs
│   └── validators.py                # Validadores reutilizables
│
├── db/                              # Capa de Base de Datos
│   ├── __init__.py
│   ├── session.py                   # SessionLocal, engine (SQLAlchemy)
│   ├── base.py                      # Base model para ORM
│   └── migrations/                  # Alembic migrations
│       ├── versions/
│       └── env.py
│
├── models/                          # SQLAlchemy ORM Models
│   ├── __init__.py
│   ├── claim.py                     # Modelo: Reclamaciones
│   ├── patient.py                   # Modelo: Pacientes
│   ├── provider.py                  # Modelo: Proveedores
│   ├── appointment.py               # Modelo: Citas
│   └── clinical_note.py             # Modelo: Notas Clínicas
│
├── schemas/                         # Pydantic schemas (validación HTTP)
│   ├── __init__.py
│   ├── claim.py                     # Esquemas para claims
│   ├── patient.py                   # Esquemas para pacientes
│   ├── provider.py                  # Esquemas para proveedores
│   ├── appointment.py               # Esquemas para citas
│   └── clinical_note.py             # Esquemas para notas
│
├── repositories/                    # Data Access Layer (DAL)
│   ├── __init__.py
│   ├── base.py                      # Repository base genérico (CRUD)
│   ├── claim_repository.py          # Custom queries para claims
│   ├── patient_repository.py        # Custom queries para pacientes
│   ├── provider_repository.py       # Custom queries para proveedores
│   ├── appointment_repository.py    # Custom queries para citas
│   └── clinical_note_repository.py  # Custom queries para notas
│
├── services/                        # Business Logic Layer
│   ├── __init__.py
│   ├── claim_service.py             # Lógica de reclamaciones
│   ├── patient_service.py           # Lógica de pacientes
│   ├── provider_service.py          # Lógica de proveedores
│   ├── appointment_service.py       # Lógica de citas
│   ├── clinical_note_service.py     # Lógica de notas clínicas
│   ├── analytics_service.py         # Reportes y análisis
│   └── ml_service.py                # Integración con modelos de IA
│
├── api/                             # API Layer (Routers)
│   ├── __init__.py
│   ├── v1/                          # Versión 1 de API
│   │   ├── __init__.py
│   │   ├── endpoints/
│   │   │   ├── __init__.py
│   │   │   ├── claims.py            # Router: /api/v1/claims
│   │   │   ├── patients.py          # Router: /api/v1/patients
│   │   │   ├── providers.py         # Router: /api/v1/providers
│   │   │   ├── appointments.py      # Router: /api/v1/appointments
│   │   │   ├── clinical_notes.py    # Router: /api/v1/clinical-notes
│   │   │   ├── analytics.py         # Router: /api/v1/analytics
│   │   │   └── health.py            # Router: /api/v1/health (status)
│   │   └── api.py                   # Inclusor de routers v1
│   └── health.py                    # Health check endpoint
│
├── middleware/                      # Middleware personalizado
│   ├── __init__.py
│   ├── cors.py                      # CORS configuration
│   ├── auth.py                      # JWT validation
│   ├── audit.py                     # Audit logging
│   └── error_handling.py            # Error handler global
│
├── utils/                           # Utilidades compartidas
│   ├── __init__.py
│   ├── pagination.py                # Paginación estándar
│   ├── filters.py                   # Filtros dinámicos
│   ├── sorting.py                   # Sorting dinámico
│   ├── date_utils.py                # Helpers de fechas
│   └── constants.py                 # Constantes globales
│
├── ml_models/                       # Modelos de IA (Python)
│   ├── __init__.py
│   ├── no_show_predictor.py         # Predictor de inasistencia
│   ├── risk_classifier.py           # Clasificador de riesgo
│   └── data_processor.py            # Preprocesamiento de datos
│
├── tests/                           # Suite de pruebas
│   ├── __init__.py
│   ├── conftest.py                  # Fixtures pytest
│   ├── unit/                        # Unit tests
│   │   ├── test_claim_service.py
│   │   ├── test_patient_service.py
│   │   └── ...
│   ├── integration/                 # Integration tests
│   │   ├── test_claims_endpoints.py
│   │   └── ...
│   └── e2e/                         # End-to-end tests
│       └── test_full_flow.py
│
├── requirements.txt                 # Dependencias Python
├── .env.example                     # Plantilla de variables de entorno
├── Dockerfile                       # Containerización
└── docker-compose.yml               # Orquestación local

```

### 3.2 Convenciones FastAPI Estándar

**Referencia**: [FastAPI Official Documentation - Project Structure](https://fastapi.tiangolo.com/project-structure/)

#### APIRouter Pattern
```python
# /services/api/api/v1/endpoints/claims.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.claim_service import ClaimService
from db.session import get_db

router = APIRouter(
    prefix="/claims",
    tags=["claims"],
)

@router.get("", response_model=List[ClaimRead])
def list_claims(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Listar todas las reclamaciones."""
    service = ClaimService(db)
    return service.list_all(skip=skip, limit=limit)

@router.get("/{claim_id}", response_model=ClaimRead)
def get_claim(claim_id: str, db: Session = Depends(get_db)):
    """Obtener reclamación por ID."""
    service = ClaimService(db)
    claim = service.get_by_id(claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Reclamación no encontrada")
    return claim
```

#### Dependency Injection
```python
# /services/api/dependencies.py
from fastapi import Depends, HTTPException
from jwt import decode, DecodeError
from core.security import SECRET_KEY, ALGORITHM

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except DecodeError:
        raise HTTPException(status_code=401, detail="Token inválido")
    return user_id
```

#### Pydantic Schemas
```python
# /services/api/schemas/claim.py
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

class ClaimCreate(BaseModel):
    """Validación para crear reclamación."""
    numero_reclamacion: str = Field(..., min_length=1, max_length=50)
    id_paciente: str
    id_proveedor: str
    monto_reclamacion: float = Field(..., gt=0)
    fecha_servicio: datetime
    
    @validator("monto_reclamacion")
    def validate_monto(cls, v):
        if v > 1_000_000:  # Máximo realista por reclamación
            raise ValueError("Monto excede límite máximo")
        return v

class ClaimRead(ClaimCreate):
    """Response model para reclamación."""
    id: str
    estado: str
    fecha_actualizacion: datetime

    class Config:
        from_attributes = True  # ORM mode
```

---

## 4. Mapa de Routers y Endpoints por Dominio

### 4.1 Estructura de Versioning

```
/api/v1/                  ← Versión 1 (Actual)
├── /claims
├── /patients
├── /providers
├── /appointments
├── /clinical-notes
├── /analytics
└── /health

/api/v2/                  ← Versión 2 (Futura, cambios breaking)
(Mantener compatibilidad con v1)
```

### 4.2 Endpoints por Dominio

#### **A. Dominio: Reclamaciones (Claims)**

**Prefijo**: `/api/v1/claims`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| GET | `/` | Listar reclamaciones (filtrable, paginado) | Reviewer, Admin |
| POST | `/` | Crear nueva reclamación | Reviewer, Admin |
| GET | `/{id}` | Obtener detalles de reclamación | Reviewer, Admin |
| PATCH | `/{id}` | Actualizar reclamación (estado, notas) | Reviewer, Admin |
| DELETE | `/{id}` | Eliminar reclamación (soft delete) | Admin |
| GET | `/{id}/audit` | Historial de cambios (auditoría) | Admin, Reviewer |
| GET | `/search?numero_reclamacion=XXX` | Búsqueda por número | Reviewer |
| POST | `/{id}/flag-for-review` | Marcar para revisión de IA | Reviewer |

**Respuestas Estándar**:
```json
{
  "id": "uuid",
  "numero_reclamacion": "CLM-2026-001",
  "id_paciente": "uuid",
  "id_proveedor": "uuid",
  "fecha_envio": "2026-11-21T10:00:00Z",
  "monto_reclamacion": 5000.00,
  "estado": "EN_REVISION",
  "region": "US",
  "prioridad": "ALTA",
  "requiere_revision_ia": true
}
```

#### **B. Dominio: Pacientes (Patients)**

**Prefijo**: `/api/v1/patients`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| GET | `/` | Listar pacientes (filtrable) | Analyst, Admin |
| POST | `/` | Registrar nuevo paciente | Admin |
| GET | `/{id}` | Perfil del paciente | Analyst, Admin |
| PATCH | `/{id}` | Actualizar datos del paciente | Admin |
| GET | `/{id}/risk-score` | Puntuación de riesgo (no-show) | Analyst, Admin |
| GET | `/{id}/appointments` | Historial de citas | Analyst, Admin |
| GET | `/{id}/clinical-notes` | Notas clínicas del paciente | Clinician, Admin |
| POST | `/{id}/bulk-update-risk` | Recalcular riesgo batch | ML System |

#### **C. Dominio: Proveedores (Providers)**

**Prefijo**: `/api/v1/providers`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| GET | `/` | Listar proveedores (con performance) | Analyst, Admin |
| POST | `/` | Registrar nuevo proveedor | Admin |
| GET | `/{id}` | Perfil del proveedor | Analyst, Admin |
| PATCH | `/{id}` | Actualizar datos | Admin |
| GET | `/{id}/claims-sent` | Reclamaciones enviadas | Analyst |
| GET | `/{id}/denial-rate` | Tasa de denegación | Analyst |
| GET | `/{id}/specialties` | Especialidades | Analyst |

#### **D. Dominio: Citas (Appointments)**

**Prefijo**: `/api/v1/appointments`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| GET | `/` | Listar citas (paginado) | Analyst, Clinician |
| POST | `/` | Programar nueva cita | Clinician |
| PATCH | `/{id}` | Cambiar estado (programada, completada, faltada) | Clinician |
| GET | `/{id}/prediction` | Predicción de no-show | Analyst |
| GET | `/no-shows/at-risk` | Pacientes en riesgo de no-show | Analyst |

#### **E. Dominio: Notas Clínicas (Clinical Notes)**

**Prefijo**: `/api/v1/clinical-notes`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| GET | `/` | Listar notas clínicas | Clinician, Admin |
| POST | `/` | Crear nueva nota | Clinician |
| GET | `/{id}` | Obtener nota por ID | Clinician, Admin |
| PATCH | `/{id}` | Actualizar nota | Clinician |
| GET | `/patient/{patient_id}` | Notas de un paciente | Clinician, Admin |

#### **F. Dominio: Analytics & Reportes**

**Prefijo**: `/api/v1/analytics`

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| GET | `/claims/summary` | Resumen de estadísticas de reclamaciones | Analyst, Admin |
| GET | `/patients/risk-distribution` | Distribución de riesgo de pacientes | Analyst |
| GET | `/providers/performance` | Desempeño de proveedores (top 5) | Analyst |
| GET | `/appointments/no-show-forecast` | Pronóstico de no-shows | Analyst |
| GET | `/export/csv?report_type=claims` | Exportar reportes en CSV | Admin |

#### **G. Health & Status**

**Prefijo**: `/api/v1/health`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Health check básico |
| GET | `/ready` | Readiness probe (DB conectada) |
| GET | `/live` | Liveness probe (servicio vivo) |

### 4.3 Codigosde Error Estándar

| Código HTTP | Significado | Ejemplo |
|-------------|------------|---------|
| **200** | OK — Éxito | Listar, obtener, actualizar |
| **201** | CREATED — Recurso creado | POST nuevo |
| **204** | NO CONTENT — Sin contenido | DELETE exitoso |
| **400** | BAD REQUEST — Validación fallida | Monto negativo |
| **401** | UNAUTHORIZED — Sin autenticación | Token faltante o expirado |
| **403** | FORBIDDEN — Sin permisos | Revisor accediendo claims como paciente |
| **404** | NOT FOUND — Recurso no existe | GET claim inexistente |
| **409** | CONFLICT — Restricción de negocio | Aprobar reclamación ya denegada |
| **500** | INTERNAL SERVER ERROR | Error inesperado en base de datos |
| **503** | SERVICE UNAVAILABLE | ML model offline |

---


---

## 5. Coexistencia Frontend-Backend Desacoplada

### 5.1 Estrategia de Comunicación

```
┌─────────────────────────┐         HTTP REST         ┌─────────────────────────┐
│   /uis/backoffice       │◄─────────────────────────►│   /services/api         │
│   (Next.js 14 + React)  │                           │   (FastAPI + Python)    │
│   - SPA moderna         │                           │   - Microservicios prep │
│   - Client-side routing │                           │   - Validación servidor │
│   - State management    │                           │   - Lógica de negocio   │
│   - TypeScript strict   │                           │   - Modelos ML          │
└─────────────────────────┘                           └─────────────────────────┘
         │                                                      │
         │                                                      │
    Bearer JWT (stateless)                              PostgreSQL 15+
    ├── Token en header                                 ├── Schemas: claims,
    ├── Refresh vía /auth/refresh                       │   patients, providers
    ├── Expiración: 15 min                              ├── Audit log table
    └── HTTPS enforcement                               ├── Full-text search
                                                        └── Replicación (future)
```

### 5.2 CORS Configuration

**Archivo**: `/services/api/middleware/cors.py`

```python
from fastapi.middleware.cors import CORSMiddleware

ALLOWED_ORIGINS = [
    "https://app.healthcore.local",           # Backoffice producción
    "https://www.healthcore.com",             # Website producción
    "http://localhost:3000",                  # Backoffice desarrollo
    "http://localhost:3001",                  # Website desarrollo
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["X-Total-Count"],         # Para paginación
    max_age=3600,                              # Cache preflight 1 hora
)
```

**Variables de Entorno**:

```bash
# /services/api/.env.example
CORS_ORIGINS=https://app.healthcore.local,http://localhost:3000
CORS_ALLOW_CREDENTIALS=true
CORS_MAX_AGE=3600
```

### 5.3 Autenticación & Autorización (JWT sin Sesiones)

**Flujo**:

```
1. Frontend (backoffice) solicita login:
   POST /api/v1/auth/login
   {
     "email": "reviewer@healthcore.com",
     "password": "***"
   }

2. Backend valida credenciales (bcrypt), genera JWT:
   {
     "access_token": "eyJhbGc...",
     "refresh_token": "eyJhbGc...",
     "token_type": "bearer",
     "expires_in": 900
   }

3. Frontend almacena en memoria (NO localStorage por XSS):
   sessionStorage.setItem("access_token", token)

4. Cada request incluye token en header:
   Authorization: Bearer eyJhbGc...

5. Backend valida JWT (firma RSA-256):
   - Extrae claims (user_id, role, permissions)
   - Verifica expiration
   - Aplica RBAC (Role-Based Access Control)

6. Si token expira, frontend usa refresh_token:
   POST /api/v1/auth/refresh
   {
     "refresh_token": "eyJhbGc..."
   }
```

**Implementación**:

```python
# /services/api/core/security.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = os.getenv("SECRET_KEY")  # 256+ bits
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expirado o inválido")
```

### 5.4 Separación de Responsabilidades

| Componente | Responsabilidad | NO Responsable |
|------------|---|---|
| **Frontend (/uis/backoffice)** | Validación básica (UI), rendering, state local | Validación crítica, persistencia, lógica de negocio |
| **Backend (/services/api)** | Validación completa, autorización, lógica, BD | Renderizado, UX animations, local caching |

**Ejemplo: Crear Reclamación**

```
Frontend:
1. Validar campos requeridos (básico, UX)
2. Verificar monto > 0 (cálculo local)
3. Enviar POST /api/v1/claims

Backend:
1. Validar autenticación (JWT)
2. Verificar autorización (role = "reviewer")
3. Validar TODAS las reglas de negocio:
   - monto_aprobado + monto_denegado ≤ monto_reclamacion
   - fecha_servicio < fecha_envio
   - region válida
   - proveedor existe
   - paciente existe
4. Calcular prioridad basada en reglas
5. Persistir en BD
6. Registrar en audit log
7. Retornar reclamación creada
```

### 5.5 Despliegue Independiente

**Docker Compose** para desarrollo:

```yaml
# /docker-compose.yml
version: '3.8'

services:
  # PostgreSQL
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: healthcore
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: healthcore_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # FastAPI Backend
  api:
    build: ./services/api
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://healthcore:dev_password@db:5432/healthcore_db
      SECRET_KEY: "dev_key_do_not_use_in_production"
      CORS_ORIGINS: "http://localhost:3000,http://localhost:3001"
    depends_on:
      - db
    volumes:
      - ./services/api:/app

  # Frontend Backoffice
  backoffice:
    build: ./uis/backoffice
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
    depends_on:
      - api

  # Website Público
  website:
    build: ./uis/website
    ports:
      - "3001:3001"

volumes:
  postgres_data:
```

**Variables de Entorno** (separadas por ambiente):

```bash
# /services/api/.env.production
DATABASE_URL=postgresql://user:pass@prod-db.aws.com:5432/healthcore_prod
SECRET_KEY=<256-bit-key-generated-in-CI>
CORS_ORIGINS=https://app.healthcore.com
LOG_LEVEL=INFO
SENTRY_DSN=https://key@sentry.io/project
```

---

## 6. Matriz de Riesgos y Puntos Críticos

### 6.1 Matriz de Riesgos (3 Escenarios Críticos)

#### **RIESGO #1: Acoplamiento de ORM en Routers → Corrupción de Datos**

**Descripción**:
Si los routers accesan directamente el ORM (SQLAlchemy models) y aplican cambios sin validación de servicios, se pueden violar reglas de negocio críticas.

**Ejemplo Peligroso**:
```python
# ❌ MALO: Router accediendo ORM directamente
@router.patch("/claims/{id}")
def update_claim(id: str, data: dict, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == id).first()
    for key, value in data.items():
        setattr(claim, key, value)  # SIN VALIDACIÓN
    db.commit()
    return claim
    # Riesgo: Alguien podría enviar:
    # { "monto_aprobado": 10000, "monto_denegado": 20000 }
    # Violaría la regla: monto_aprobado + monto_denegado ≤ monto_reclamacion
```

**Impacto**:
- 🔴 **CRÍTICO**: Pérdida de integridad de datos
- Incumplimiento de auditoría HIPAA
- Reportes financieros incorrectos
- Denegaciones no justificadas

**Mitigación**:
```python
# ✅ BUENO: Separación de capas
@router.patch("/claims/{id}", response_model=ClaimRead)
def update_claim(
    id: str,
    update_data: ClaimUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    service = ClaimService(db)
    # El servicio aplica TODAS las validaciones
    return service.update_claim(id, update_data, current_user)

# En service:
class ClaimService:
    def update_claim(self, claim_id: str, update_data: ClaimUpdate, user_id: str):
        claim = self.repository.get_by_id(claim_id)
        
        # Validar regla de negocio
        total_montos = update_data.monto_aprobado + update_data.monto_denegado
        if total_montos > claim.monto_reclamacion + 0.01:
            raise ValueError("Monto aprobado + denegado excede reclamación")
        
        # Registrar auditoría
        self.audit_service.log_change(claim_id, update_data, user_id)
        
        # Persistir
        updated_claim = self.repository.update(claim_id, update_data)
        return updated_claim
```

**Métricas de Éxito**:
- ✅ 100% de reglas de negocio validadas en service layer
- ✅ 0 cambios bypass del servicio
- ✅ Code review checklist: "¿Pasa por servicio?"

---

#### **RIESGO #2: Exposición de Errores Internos → Fuga de Información Sensible**

**Descripción**:
Si el backend retorna stack traces completos en respuestas de error, se exponen detalles de BD, rutas internas y versiones que un atacante puede explotar.

**Ejemplo Peligroso**:
```python
# ❌ MALO: Error expuesto
{
  "detail": "SQL: SELECT * FROM claims WHERE id = 'xyz' — Table claims not found",
  "traceback": "File /services/api/db/session.py line 42 in get_session..."
}
# Atacante descubre: estructura de BD, paths, versiones
```

**Impacto**:
- 🔴 **CRÍTICO**: OWASP A01 — Broken Access Control
- Fuga de información sensible
- Facilita ataques targeted

**Mitigación**:
```python
# ✅ BUENO: Error handling genérico
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    # Log completo en servidor (Sentry)
    logger.error(f"Unhandled exception", exc_info=True)
    
    # Retornar respuesta genérica al cliente
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor. ID: <uuid>"}
        # El UUID permite trace sin exponer detalles
    )

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    logger.warning(f"Validation error: {str(exc)}")
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}  # Solo el mensaje, no traceback
    )
```

**Métricas de Éxito**:
- ✅ 0 stack traces en respuestas HTTP
- ✅ 100% de errores loggueados en servidor
- ✅ Sentry/CloudWatch recibiendo eventos

---

#### **RIESGO #3: JWT Token Expiración No Validada → Acceso Persistente Comprometido**

**Descripción**:
Si el backend NO valida la expiración del JWT correctamente, tokens comprometidos (robados en man-in-the-middle) pueden usarse indefinidamente.

**Ejemplo Peligroso**:
```python
# ❌ MALO: No verificar expiración
def verify_token(token: str):
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    # NO incluye options={"verify_exp": True}
    return payload

# Token robado hace 30 días sigue siendo válido
```

**Impacto**:
- 🔴 **CRÍTICO**: Acceso no autorizado persistente
- Violación HIPAA (acceso no anulable)
- Cambios de datos sin poder revocar

**Mitigación**:
```python
# ✅ BUENO: Validación estricta + revocación
def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_exp": True}  # Fuerza validación
        )
        
        # Verificar que token no esté revocado (blacklist DB)
        if is_token_revoked(token):
            raise HTTPException(status_code=401, detail="Token revocado")
        
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

# Logout: agregar token a blacklist
@router.post("/auth/logout")
def logout(current_user: str = Depends(get_current_user)):
    token = request.headers.get("Authorization").replace("Bearer ", "")
    revoke_token(token)  # Guardar en Redis con TTL
    return {"message": "Sesión cerrada"}
```

**Métricas de Éxito**:
- ✅ Expiración validada en cada request
- ✅ Tokens revocables (logout funciona)
- ✅ Refresh tokens con TTL máximo 7 días

---

### 6.2 Checklist de Validación Pre-Deploy

| Item | Verificación | Responsable |
|------|---|---|
| **Reglas de Negocio** | ¿Todas las validaciones en service layer? | QA + DevOps |
| **Errores** | ¿0 stack traces en prod? | Security Team |
| **JWT** | ¿Expiración validada? ¿Blacklist funciona? | Backend Lead |
| **CORS** | ¿Origins permitidos solo prod? | DevOps |
| **BD** | ¿Conexión encriptada (SSL)? | DBA |
| **Logs** | ¿Sentry recibiendo eventos? | DevOps |
| **API Docs** | ¿Swagger solo en dev? | Backend Lead |
| **SQL Injection** | ¿Parametrizadas todas las queries? | Security Team |

---

## 7. Recomendaciones y Próximos Pasos

### 7.1 Implementación Faseada

**Fase 1 (Diciembre 2026 — M5)**:
- ✅ FastAPI monolítico con 5 dominios
- ✅ PostgreSQL 15
- ✅ JWT auth sin sesiones
- ✅ 50+ unit tests + 10+ integration tests
- ✅ Swagger docs

**Fase 2 (Enero 2027 — M6)**:
- 🚀 Event-driven (Kafka/RabbitMQ) para ML workflows
- 🚀 AsyncIO para operaciones I/O intensivas
- 🚀 Redis cache para reportes

**Fase 3 (Febrero 2027 — M7+)**:
- 🚀 Desacoplamiento en microservicios:
  - `api-gateway` (FastAPI)
  - `claims-service` (FastAPI)
  - `analytics-service` (Python ML)
  - `notifications-service` (Node.js)

### 7.2 Estándares de Desarrollo

**Código**:
- Linting: `pylint`, `flake8`
- Formatting: `black`
- Type checking: `mypy` (strict mode)
- Testing: `pytest` con `>80%` coverage

**Documentación**:
- OpenAPI/Swagger generado automáticamente
- Docstrings en todas las funciones públicas
- README.md por módulo mayor

**Seguridad**:
- Scan de dependencias: `safety check`
- OWASP Top 10 review antes de merge
- Penetration testing trimestral

### 7.3 Métricas de Calidad

| Métrica | Target | Tool |
|---------|--------|------|
| Test Coverage | >80% | pytest-cov |
| Code Duplication | <5% | radon |
| Complexity | <10 (ciclo) | radon |
| Security Score | A+ | Dependabot + Trivy |
| API Latency | <200ms p95 | Prometheus |
| Availability | >99.5% | Uptime Robot |

---

## 📚 Referencias

- [FastAPI Official Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [HIPAA Compliance](https://www.hhs.gov/hipaa/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Documento Preparado Por**: CTO Advisory Team + Principal Software Architect  
**Versión**: 1.0  
**Fecha Última Actualización**: 21 de Noviembre de 2026  
**Estado**: ✅ LISTO PARA IMPLEMENTACIÓN (M5 — Diciembre 2026)

