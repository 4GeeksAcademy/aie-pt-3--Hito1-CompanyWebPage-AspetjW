# HealthCore - Milestone 2: Utilidades TypeScript de Procesamiento de Datos

## 📋 Descripción General del Proyecto

Este milestone se enfoca en crear utilidades TypeScript robustas y type-safe para procesar y analizar datos sanitarios en HealthCore. Las utilidades soportarán:

1. **Sistema de Revisión de Reclamaciones Asistido por IA** - Procesamiento automatizado de reclamaciones con señalización de riesgo
2. **Procesamiento de Documentación Clínica** - Estructuras de datos listas para NLP en registros médicos
3. **Predicción de Inasistencia en Citas** - Análisis de patrones de asistencia en citas

---

## 🏥 Entidades Principales y Modelos de Datos

### 1. **Reclamación** (Registro de Reclamación de Seguros)
Representa una reclamación de seguros presentada con seguimiento de estado y datos financieros.

```typescript
interface Reclamacion {
  id: string;                      // Identificador único (formato UUID)
  numeroReclamacion: string;       // Número de reclamación legible
  idPaciente: string;              // Referencia al paciente
  idProveedor: string;             // Referencia al proveedor de salud
  fechaEnvio: Date;                // Cuándo se envió la reclamación
  montoReclamacion: number;        // Monto total en USD (> 0)
  montoDenegado: number;           // Monto denegado/rechazado (>= 0)
  montoAprobado: number;           // Monto aprobado/pagado (>= 0)
  estado: EstadoReclamacion;       // Estado actual de procesamiento
  razonesRechazo: string[];        // Array de códigos de razones de rechazo
  fechaServicio: Date;             // Cuándo se proporcionó el servicio
  fechaActualizacion: Date;        // Última marca de tiempo de modificación
  region: "US" | "UK";             // Región geográfica
  prioridad: "BAJA" | "MEDIA" | "ALTA"; // Nivel de riesgo/prioridad
  requiereRevisionIA: boolean;     // Bandera para revisión asistida por IA
  notas: string;                   // Notas clínicas o administrativas
}

type EstadoReclamacion = "ENVIADA" | "EN_REVISION" | "APROBADA" | "PARCIALMENTE_APROBADA" | "DENEGADA" | "APELADA";
```

### 2. **Paciente**
Datos demográficos y de citas para pacientes.

```typescript
interface Paciente {
  id: string;                      // Identificador único (UUID)
  nombre: string;                  // Nombre (no vacío)
  apellido: string;                // Apellido (no vacío)
  fechaNacimiento: Date;           // Fecha de nacimiento (debe ser en el pasado)
  correo: string;                  // Correo electrónico (formato válido)
  telefonoContacto: string;        // Número de teléfono
  fechaRegistro: Date;             // Cuándo se registró el paciente
  totalCitas: number;              // Número total de citas programadas (>= 0)
  citasFaltadas: number;           // Número de citas faltadas (>= 0, <= totalCitas)
  fechaUltimaVisita: Date | null;  // Fecha de la última visita (puede ser null)
  puntuacionRiesgo: number;        // Puntuación de predicción de no-show (0-100)
  region: "US" | "UK";             // Región geográfica
}
```

### 3. **Proveedor** (Proveedor de Servicios de Salud)
Información sobre proveedores de servicios médicos.

```typescript
interface Proveedor {
  id: string;                      // Identificador único
  nombre: string;                  // Nombre del proveedor
  tipoProveedor: TipoProveedor;    // HOSPITAL, CLINICA, LABORATORIO, etc.
  npi: string;                     // Identificador Nacional del Proveedor
  reclamacionesEnviadas: number;   // Cantidad de reclamaciones enviadas (>= 0)
  tasaDenegacion: number;          // Porcentaje de denegación (0-100)
  region: "US" | "UK";             // Región geográfica
  montoPromedioCita: number;       // Monto promedio por cita (> 0)
  especialidades: string[];        // Lista de especialidades médicas
}

type TipoProveedor = "HOSPITAL" | "CLINICA" | "LABORATORIO" | "FARMACIA" | "ESPECIALISTA";
```

### 4. **Cita** (Cita Médica)
Información sobre citas médicas y su cumplimiento.

```typescript
interface Cita {
  id: string;                      // Identificador único
  idPaciente: string;              // Referencia al paciente
  idProveedor: string;             // Referencia al proveedor
  fechaCita: Date;                 // Fecha/hora de la cita
  estado: EstadoCita;              // PROGRAMADA, COMPLETADA, FALTADA, CANCELADA
  duracionMinutos: number;         // Duración estimada en minutos (> 0)
  tipoVisita: "PRESENCIAL" | "TELEMEDICA"; // Tipo de consulta
  razonVisita: string;             // Motivo/razón de la cita
  montoFacturado: number;          // Monto facturado (>= 0)
  region: "US" | "UK";             // Región geográfica
}

type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "FALTADA" | "CANCELADA";
```

### 5. **Nota Clínica** (Registro Médico)
Documentación clínica de pacientes.

```typescript
interface NotaClinica {
  id: string;                      // Identificador único
  idPaciente: string;              // Referencia al paciente
  idProveedor: string;             // Referencia al proveedor que creó la nota
  fechaCreacion: Date;             // Cuándo se creó la nota
  contenido: string;               // Texto de la nota clínica (no vacío)
  tipo: TipoNotaClinica;           // Tipo de documento
  diagnosticos: string[];          // Array de diagnósticos (códigos ICD-10)
  medicamentos: string[];          // Medicamentos prescritos
  recomendaciones: string[];       // Recomendaciones de seguimiento
  region: "US" | "UK";             // Región geográfica
}

type TipoNotaClinica = "DIAGNOSTICO" | "EVOLUCION" | "ALTA" | "CONSULTA_EXTERNA";
```

---

## 📊 Reglas de Negocio y Validaciones

### Validaciones Generales
- Todos los IDs deben ser strings no vacíos (formato UUID recomendado)
- Todas las fechas deben ser instancias válidas de Date
- Montos numéricos deben ser >= 0, con tolerancia de redondeo de ±0.01

### Validaciones de Reclamación
- `numeroReclamacion`: String no vacío, alfanumérico
- `montoReclamacion` > 0
- `montoAprobado` + `montoDenegado` <= `montoReclamacion` (tolerancia: ±0.01)
- `fechaEnvio` <= `fechaActualizacion`
- `fechaServicio` debe ser anterior a `fechaEnvio`
- `estado`: Debe ser uno de los valores definidos en `EstadoReclamacion`
- `razonesRechazo`: No puede estar vacío si estado = "DENEGADA"
- `region` debe ser "US" o "UK"
- `prioridad` debe ser "BAJA", "MEDIA" o "ALTA"

### Validaciones de Paciente
- `nombre` y `apellido`: Strings no vacíos con longitud >= 2
- `correo`: Formato válido (patrón regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- `telefonoContacto`: String no vacío
- `fechaNacimiento`: Debe ser en el pasado
- `fechaRegistro`: No puede ser en el futuro
- `totalCitas` >= `citasFaltadas`
- `puntuacionRiesgo`: Número entre 0 y 100 (inclusive)
- `fechaUltimaVisita`: Si está presente, debe ser >= `fechaRegistro` y <= hoy
- `region` debe ser "US" o "UK"

### Validaciones de Proveedor
- `nombre`: String no vacío
- `npi`: String no vacío, formato válido (10 dígitos)
- `reclamacionesEnviadas` >= 0
- `tasaDenegacion`: Número entre 0 y 100 (inclusive)
- `montoPromedioCita` > 0
- `especialidades`: Array no vacío
- `region` debe ser "US" o "UK"

### Validaciones de Cita
- `fechaCita` debe ser no nula y válida
- Si estado = "FALTADA", debe haber evidencia de no-show
- `duracionMinutos` > 0
- `montoFacturado` >= 0
- `tipoVisita` debe ser "PRESENCIAL" o "TELEMEDICA"
- `razonVisita`: String no vacío

### Validaciones de Nota Clínica
- `contenido`: String no vacío con longitud >= 10
- `diagnosticos`: Array no vacío
- `tipo`: Debe ser uno de los valores definidos
- `fechaCreacion` <= fecha actual
- `region` debe ser "US" o "UK"

---

## 📈 Reportes Requeridos

### 1. **Reporte de Estadísticas de Reclamaciones**
Proporciona análisis consolidado de volumen, aprobación y denegación.

```typescript
interface ReporteEstadisticasReclamaciones {
  totalReclamaciones: number;      // Total de registros procesados
  totalMontoEnviado: number;       // Suma de montoReclamacion
  totalMontoAprobado: number;      // Suma de montoAprobado
  totalMontoDenegado: number;      // Suma de montoDenegado
  tasaDenegacion: number;          // (totalMontoDenegado / totalMontoEnviado) * 100
  montoPromedio: number;           // Promedio de montoReclamacion
  montoMediana: number;            // Mediana de montoReclamacion
  reclamacionesPorEstado: Record<EstadoReclamacion, number>; // Conteo por estado
  reclamacionesPorRegion: Record<"US" | "UK", number>;       // Conteo por región
  reclamacionesPorPrioridad: Record<"BAJA" | "MEDIA" | "ALTA", number>; // Conteo por prioridad
  razonesRechazoMasComunes: Array<{
    razon: string;
    cantidad: number;
  }>;                              // Top 5 razones de rechazo
}
```

### 2. **Reporte de Análisis de Pacientes**
Análisis de patrones de asistencia y segmentación de riesgo.

```typescript
interface ReporteAnalisisPacientes {
  totalPacientes: number;          // Total de pacientes
  tasaInasistencia: number;        // (citasFaltadas / totalCitas) * 100
  pacientesAltoRiesgo: number;     // Conteo de puntuacionRiesgo >= 70
  pacientesConInasistencias: number; // Conteo de pacientes con citasFaltadas > 0
  promedioCitas: number;           // Promedio de totalCitas
  inasistenciasPorRegion: Record<"US" | "UK", number>; // Suma de citasFaltadas por región
  distribucionPuntuacionRiesgo: {
    riesgoBajo: number;            // Conteo: puntuacionRiesgo < 33
    riesgoMedio: number;           // Conteo: 33 <= puntuacionRiesgo < 67
    riesgoAlto: number;            // Conteo: puntuacionRiesgo >= 67
  };
}
```

### 3. **Reporte de Desempeño de Proveedores**
Análisis de volumen, eficiencia y tasa de aprobación.

```typescript
interface ReporteDesempenoProveedor {
  totalProveedores: number;        // Total de proveedores analizados
  volumenTotalReclamaciones: number; // Suma de reclamacionesEnviadas
  tasaDenegacionPromedio: number;  // Promedio de tasaDenegacion
  proveedoresTopVolumen: Array<{
    id: string;
    nombre: string;
    reclamacionesEnviadas: number;
    tasaDenegacion: number;
  }>;                              // Top 5 proveedores por volumen
  desempenoPorRegion: Record<"US" | "UK", {
    totalProveedores: number;
    volumenReclamaciones: number;
    tasaDenegacionPromedio: number;
  }>;                              // Métricas por región
  especializacionesTop: Array<{
    especialidad: string;
    cantidad: number;
  }>;                              // Top 5 especialidades
}
```

### 4. **Reporte de Predicción de Inasistencia en Citas**
Análisis de factores que predicen inasistencia.

```typescript
interface ReportePrediccionInasistencia {
  totalCitas: number;              // Total de citas analizadas
  citasCompletadas: number;        // Conteo de estado = "COMPLETADA"
  citasFaltadas: number;           // Conteo de estado = "FALTADA"
  tasaInasistenciaGeneral: number; // (citasFaltadas / totalCitas) * 100
  inasistenciaPorTipoVisita: Record<"PRESENCIAL" | "TELEMEDICA", number>; // Conteo de no-show por tipo
  inasistenciaPorRegion: Record<"US" | "UK", number>; // Conteo de no-show por región
  pacientesConAltoRiesgo: Array<{
    idPaciente: string;
    puntuacionRiesgo: number;
    citasFaltadas: number;
  }>;                              // Top 10 pacientes de alto riesgo
  correlacionEdadInasistencia: Record<string, number>; // Distribución de edad vs no-show
}
```

---

## ✅ Criterios de Aceptación

### Tipado y Sintaxis TypeScript
- [ ] Todas las interfaces están definidas en `src/types/models.ts`
- [ ] Tipado explícito en todos los parámetros y valores de retorno
- [ ] Cero uso de `any`
- [ ] Tipos genéricos reutilizables donde corresponda
- [ ] Configuración TypeScript con `strict: true`

### Funciones de Búsqueda (`src/utils/search.ts`)
- [ ] Búsqueda lineal: O(n), maneja arrays vacíos correctamente
- [ ] Búsqueda binaria: O(log n), requiere precondición de array ordenado
- [ ] Búsqueda de todos los elementos coincidentes
- [ ] Funciones de búsqueda por propiedades específicas
- [ ] JSDoc documentación de complejidad temporal

### Funciones de Colecciones (`src/utils/collections.ts`)
- [ ] Filtrado por múltiples criterios (O(n*m))
- [ ] Ordenamiento ascendente y descendente (O(n log n))
- [ ] Ordenamiento por múltiples campos
- [ ] Agrupación por propiedad (O(n))
- [ ] Deduplicación (O(n))
- [ ] Particionamiento de arrays
- [ ] Funciones puras e inmutables

### Funciones de Transformación (`src/utils/transformations.ts`)
- [ ] Conteo por propiedad (O(n))
- [ ] Suma de propiedades numéricas (O(n))
- [ ] Promedio de propiedades (O(n))
- [ ] Máximo y mínimo (O(n))
- [ ] Mediana de valores (O(n log n))
- [ ] 4 generadores de reportes completos
- [ ] Agregaciones precisas con manejo de edge cases

### Funciones de Validación (`src/utils/validations.ts`)
- [ ] Validador para Reclamación (implementa 15+ reglas)
- [ ] Validador para Paciente (implementa 10+ reglas)
- [ ] Validador para Proveedor (implementa 8+ reglas)
- [ ] Validador para NotaClinica (implementa 6+ reglas)
- [ ] Validador para Cita (implementa 7+ reglas)
- [ ] Retorna ResultadoValidacion con lista de errores descriptivos
- [ ] Validaciones reutilizables (email, número, fecha, etc.)

### Modularidad y Organización
- [ ] Archivo `src/index.ts` con exportaciones barrel
- [ ] Responsabilidad única por archivo
- [ ] Nombres descriptivos en camelCase para funciones/variables
- [ ] Nombres en PascalCase para interfaces/tipos
- [ ] Comentarios en español
- [ ] Ninguna función modifica sus inputs

### Compilación y Build
- [ ] `npm run build` compila sin errores
- [ ] `npm run type-check` sin errores de tipos
- [ ] Archivos `.js` y `.d.ts` generados en `dist/`
- [ ] `tsconfig.json` configurado con strict mode

### Documentación
- [ ] README_MILESTONE2.md con guía de uso
- [ ] EJEMPLOS_USO.ts con ejemplos de cada función
- [ ] JSDoc completo en todas las funciones públicas
- [ ] Documentación de complejidad temporal

---

## 🚀 Tecnologías y Herramientas

- **TypeScript 5.3.3+**: Tipado estricto
- **Node.js 18+**: Runtime de ejecución
- **npm**: Gestor de dependencias
- **Git**: Control de versiones

---

## 📝 Notas Importantes

1. **Funciones Puras**: Ninguna función debe modificar sus inputs. Use spread operator para copias inmutables.
2. **Sin Dependencias Externas**: Solo se permiten TypeScript y Node.js built-in modules.
3. **Edge Cases**: Manejar arrays vacíos, null/undefined, montos con rounding, fechas futuras vs pasadas.
4. **Reportes Precisos**: Las agregaciones deben ser exactas con tolerancia de ±0.01 para montos monetarios.
5. **Idioma**: Todos los comentarios, nombres de funciones y documentación en español.

---

## 📅 Hitos de Entrega

- **Fase 1**: Definición de tipos (models.ts, BRIEFING.md)
- **Fase 2**: Implementación de funciones de búsqueda y colecciones
- **Fase 3**: Funciones de transformación y reportes
- **Fase 4**: Validaciones exhaustivas
- **Fase 5**: Documentación, ejemplos y PR

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2026  
**Responsable del proyecto**: HealthCore Engineering Team
