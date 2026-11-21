# HealthCore - Briefing Empresarial

## 🏥 Identidad de la Empresa

**Nombre**: HealthCore  
**Sector**: Healthcare Technology & Insurance Claims Management  
**Región**: US + UK  
**Misión**: Transformar la gestión de reclamaciones de seguros médicos mediante IA y automatización, reduciendo tiempos de procesamiento y mejorando la experiencia de pacientes y proveedores.

---

## 🎯 Problemas que Resolvemos

### 1. **Retraso en Procesamiento de Reclamaciones**
- Reclamaciones médicas procesadas manualmente tardan semanas
- Sistema actual: hojas de cálculo compartidas + correos
- **Solución**: Automatización de revisión inicial y señalización de riesgo con IA

### 2. **Denegaciones Inesperadas y Apelaciones Costosas**
- 25-30% de reclamaciones denegadas sin causa clara
- Pacientes y proveedores desconocen razones específicas
- **Solución**: Reglas de negocio transparentes y reportes detallados

### 3. **Fragmentación de Datos Clínicos**
- Notas médicas dispersas en múltiples sistemas
- Falta estructura para análisis predictivo
- **Solución**: Centralización de documentación clínica con tipado estructurado

### 4. **Inasistencia No Predicha en Citas**
- 15-20% de no-shows sin patrón identificable
- Impacto económico: pérdida de ingresos y desincentivo operativo
- **Solución**: Modelos predictivos basados en datos de pacientes y comportamiento

---

## 👥 Usuarios Objetivo

### 1. **Equipo de People & Talent**
- Gestión de candidatos en campañas de selección
- Seguimiento de etapas del pipeline (Application → Hire/Reject)
- Notas internas, cambios de estado, registros de nuevos candidatos

### 2. **Revisores de Reclamaciones**
- Análisis de reclamaciones médicas
- Señalización automática de riesgos y casos fuera de lo normal
- Acceso a documentación clínica y reglas de negocio

### 3. **Analistas de Datos**
- Generación de reportes de desempeño de proveedores
- Análisis de patrones de inasistencia
- Segmentación de riesgo de pacientes

### 4. **Administradores de Sistema**
- Configuración de reglas de validación
- Monitoreo de integridad de datos
- Auditoría de cambios

---

## 📊 Datos Principales

### Entidades Clave

#### **1. Reclamación**
```typescript
{
  id: string;                      // UUID
  numeroReclamacion: string;       // Número legible
  idPaciente: string;              // Referencia a paciente
  idProveedor: string;             // Referencia a proveedor
  fechaEnvio: Date;                // Fecha de envío
  montoReclamacion: number;        // Monto en USD
  montoDenegado: number;           // Monto rechazado
  montoAprobado: number;           // Monto aprobado
  estado: "ENVIADA" | "EN_REVISION" | "APROBADA" | "PARCIALMENTE_APROBADA" | "DENEGADA" | "APELADA";
  razonesRechazo: string[];        // Códigos de razones
  fechaServicio: Date;             // Cuándo se brindó el servicio
  fechaActualizacion: Date;        // Última modificación
  region: "US" | "UK";             // Región
  prioridad: "BAJA" | "MEDIA" | "ALTA"; // Nivel de riesgo
  requiereRevisionIA: boolean;     // Revisión asistida
  notas: string;                   // Notas clínicas/admin
}
```

#### **2. Paciente**
```typescript
{
  id: string;                      // UUID
  nombre: string;                  // Nombre
  apellido: string;                // Apellido
  fechaNacimiento: Date;           // Fecha de nacimiento
  correo: string;                  // Email
  telefonoContacto: string;        // Teléfono
  fechaRegistro: Date;             // Fecha registro
  totalCitas: number;              // Total de citas programadas
  citasFaltadas: number;           // Citas no-show
  fechaUltimaVisita: Date | null;  // Última visita
  puntuacionRiesgo: number;        // 0-100 (predicción no-show)
  region: "US" | "UK";             // Región
}
```

#### **3. Proveedor**
```typescript
{
  id: string;                      // UUID
  nombre: string;                  // Nombre
  tipoProveedor: "HOSPITAL" | "CLINICA" | "LABORATORIO" | "FARMACIA" | "ESPECIALISTA";
  npi: string;                     // ID Nacional del Proveedor
  reclamacionesEnviadas: number;   // Volumen
  tasaDenegacion: number;          // % de denegación
  region: "US" | "UK";             // Región
  montoPromedioCita: number;       // Promedio por cita
  especialidades: string[];        // Lista de especialidades
}
```

#### **4. Cita Médica**
```typescript
{
  id: string;                      // UUID
  idPaciente: string;              // Referencia a paciente
  idProveedor: string;             // Referencia a proveedor
  fechaCita: Date;                 // Fecha/hora
  estado: "PROGRAMADA" | "COMPLETADA" | "FALTADA" | "CANCELADA";
  duracionMinutos: number;         // Duración
  tipoVisita: "PRESENCIAL" | "TELEMEDICA";
  razonVisita: string;             // Motivo
  montoFacturado: number;          // Monto facturado
  region: "US" | "UK";             // Región
}
```

#### **5. Nota Clínica**
```typescript
{
  id: string;                      // UUID
  idPaciente: string;              // Referencia a paciente
  idProveedor: string;             // Referencia a proveedor
  fechaCreacion: Date;             // Fecha creación
  contenido: string;               // Texto de la nota
  tipo: "DIAGNOSTICO" | "EVOLUCION" | "ALTA" | "CONSULTA_EXTERNA";
  diagnosticos: string[];          // Códigos ICD-10
  medicamentos: string[];          // Medicamentos prescritos
  recomendaciones: string[];       // Recomendaciones de seguimiento
  region: "US" | "UK";             // Región
}
```

---

## 🔐 Reglas de Negocio Críticas

### Reclamaciones
- Monto aprobado + denegado ≤ monto reclamación (tolerancia ±$0.01)
- Si estado = "DENEGADA", razonesRechazo no puede estar vacío
- fechaServicio < fechaEnvio
- Prioridad basada en monto y estado

### Pacientes
- Email válido (patrón: `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- fechaNacimiento siempre en el pasado
- citasFaltadas ≤ totalCitas
- puntuacionRiesgo: 0-100

### Proveedores
- NPI: exactamente 10 dígitos
- tasaDenegacion: 0-100%
- Especialidades no vacías
- montoPromedioCita > 0

### Citas
- Si estado = "FALTADA", debe haber evidencia
- duracionMinutos > 0
- fechaCita válida

### Notas Clínicas
- contenido ≥ 10 caracteres
- diagnosticos no vacío
- fechaCreacion ≤ hoy

---

## 📈 Reportes Clave

### 1. Reporte de Estadísticas de Reclamaciones
- Total de reclamaciones y montos (enviado, aprobado, denegado)
- Tasa de denegación por región y prioridad
- Razones de rechazo más comunes (top 5)
- Distribución por estado

### 2. Reporte de Análisis de Pacientes
- Tasa de inasistencia general
- Distribución de riesgo (bajo, medio, alto)
- Pacientes de alto riesgo (puntuación ≥ 70)
- Inasistencias por región

### 3. Reporte de Desempeño de Proveedores
- Top 5 proveedores por volumen
- Desempeño por región
- Especialidades más comunes
- Tasa de denegación promedio

### 4. Reporte de Predicción de Inasistencia
- Tasa de no-show por tipo de visita (presencial vs telemédica)
- Top 10 pacientes de alto riesgo
- Correlación de edad y no-show
- Distribución regional

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** 18+
- **TypeScript** 5.3+
- **FastAPI** (Python) para modelos de IA
- **PostgreSQL** para persistencia

### Frontend
- **Next.js** 14 (App Router)
- **React** 18
- **TypeScript**
- **Tailwind CSS** v4
- **React Hooks** (sin Redux/Zustand)

### Infraestructura
- **Docker** para containerización
- **GitHub Actions** para CI/CD
- **Vercel/AWS** para deployment

### Utilerías
- **Jest** para testing
- **ESLint** para linting
- **Prettier** para formatteo

---

## 📋 Estándares de Desarrollo

### Código
- TypeScript strict mode (no `any`)
- Funciones puras e inmutables
- Responsabilidad única
- Nombres descriptivos (camelCase funciones, PascalCase tipos)

### Commits
- Formato: `type(scope): descripción`
- Tipos: feat, fix, docs, style, refactor, test, chore
- Incluir co-author cuando sea colaborativo

### Ramas
- Nueva rama por milestone: `feat/milestone-X-{nombre}`
- Merge a `main` vía PR con revisión
- Histórico limpio sin merge commits

### Documentación
- Español/Castellano para comentarios
- JSDoc para funciones públicas
- README.md por componente mayor
- Ejemplos de uso incluidos

---

## ✅ Hitos Completados

| Hito | Título | Estado | Rama |
|------|--------|--------|------|
| M1 | Setup Inicial | ✅ | - |
| M2 | TypeScript Utilities | ✅ | `feat/milestone-2-typescript-utilities` |
| M3 | Talent Pipeline Tracker | ✅ | `feat/milestone-3-talent-pipeline-tracker` |
| M4 | AI-driven Engineering (Memory Bank) | 🔄 | `feature/agent-memory-bank` |

---

## 🚀 Próximos Pasos

1. **M4**: Configuración de Memory Bank y Agents
2. **M5**: Implementación del dashboard de Analytics
3. **M6**: Sistema de notificaciones en tiempo real
4. **M7**: Integración de modelos de IA predictiva

---

**Versión**: 2.0.0  
**Última actualización**: 21 de noviembre de 2026  
**Responsable**: HealthCore Engineering Team
