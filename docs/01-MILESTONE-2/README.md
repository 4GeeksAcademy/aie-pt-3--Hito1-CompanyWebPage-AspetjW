# HealthCore - Milestone 2: Utilidades TypeScript de Procesamiento de Datos

## 📋 Descripción General

Este proyecto implementa un conjunto completo y robusto de utilidades TypeScript para el procesamiento, validación y análisis de datos sanitarios en **HealthCore**. Incluye funciones puras, tipadas explícitamente y sin uso de `any`, organizadas en módulos con responsabilidad única.

## 🎯 Objetivos del Milestone 2

- ✅ Crear **tipos TypeScript** para todas las entidades del dominio (Reclamaciones, Pacientes, Proveedores, Citas, Notas Clínicas)
- ✅ Implementar **búsqueda lineal y binaria** genérica
- ✅ Implementar **filtrado, ordenamiento y agrupación** con múltiples criterios
- ✅ Crear **funciones de agregación** para generar reportes
- ✅ Implementar **validación rigurosa** según reglas de negocio
- ✅ Garantizar **tipado estricto** (sin `any`)
- ✅ Código **limpio y modular** siguiendo principios SOLID

---

## 📂 Estructura del Proyecto

```
src/
├── types/
│   └── models.ts              # Interfaces y tipos de dominio
├── utils/
│   ├── search.ts              # Búsqueda lineal y binaria
│   ├── collections.ts         # Filtrado, ordenamiento, agrupación
│   ├── transformations.ts     # Agregaciones y reportes
│   └── validations.ts         # Validación de modelos
├── index.ts                   # Exportaciones barrel
tsconfig.json                  # Configuración TypeScript
BRIEFING.md                    # Especificaciones técnicas detalladas
EJEMPLOS_USO.ts                # Ejemplos de uso de las funciones
```

---

## 🔧 Tipos de Datos Principales

### 1. **Reclamación (Insurance Claim)**
```typescript
interface Reclamacion {
  id: string;
  numeroReclamacion: string;
  idPaciente: string;
  idProveedor: string;
  fechaEnvio: Date;
  montoReclamacion: number;      // Monto total ($)
  montoAprobado: number;          // Monto aprobado ($)
  montoDenegado: number;          // Monto denegado ($)
  estado: EstadoReclamacion;      // ENVIADA, EN_REVISION, APROBADA, etc.
  razonesRechazo: string[];
  fechaServicio: Date;
  fechaActualizacion: Date;
  region: "US" | "UK";
  prioridad: "BAJA" | "MEDIA" | "ALTA";
  requiereRevisionIA: boolean;
  notas: string;
}
```

### 2. **Paciente (Patient)**
```typescript
interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  correo: string;
  telefonoContacto: string;
  fechaRegistro: Date;
  totalCitas: number;
  citasFaltadas: number;
  fechaUltimaVisita: Date | null;
  puntuacionRiesgo: number;        // 0-100 (predicción de no-show)
  region: "US" | "UK";
}
```

### 3. **Proveedor (Healthcare Provider)**
```typescript
interface Proveedor {
  id: string;
  nombre: string;
  tipoProveedor: TipoProveedor;    // HOSPITAL, CLINICA, LABORATORIO, etc.
  npi: string;                      // National Provider Identifier
  reclamacionesEnviadas: number;
  tasaDenegacion: number;           // 0-100 %
  region: "US" | "UK";
  montoPromedioCita: number;
  especialidades: string[];
}
```

### 4. **Cita (Appointment)**
```typescript
interface Cita {
  id: string;
  idPaciente: string;
  idProveedor: string;
  fechaProgramada: Date;
  estadoAsistencia: AttendanceStatus;  // ASISTIO, NO_ASISTIO, PROGRAMADA, etc.
  tipoCita: string;
  recordatoriosEnviados: number;
  region: "US" | "UK";
  duracionMinutos: number;
}
```

### 5. **Nota Clínica (Clinical Note)**
```typescript
interface NotaClinica {
  id: string;
  idPaciente: string;
  idProveedor: string;
  fechaCreacion: Date;
  tipoDocumento: TipoDocumento;    // NOTA_EVOLUCION, RESUMEN_ALTA, etc.
  contenido: string;
  cantidadPalabras: number;
  palabrasClave: string[];
  procesadoPorIA: boolean;
  puntuacionConfianza: number;     // 0-100 o -1 si no procesada
}
```

---

## 🔍 Funciones de Búsqueda

### Búsqueda Lineal
```typescript
// Busca el primer elemento que cumple el predicado
busquedaLineal<T>(array: T[], predicado: Predicado<T>): T | undefined

// Busca todos los elementos coincidentes
busquedaLinealTodos<T>(array: T[], predicado: Predicado<T>): T[]

// Busca por propiedad exacta
buscarPorPropiedad<T>(array: T[], clave: keyof T, valor: T[K]): T | undefined
```

### Búsqueda Binaria
```typescript
// Búsqueda en array ordenado (O(log n))
busquedaBinaria<T>(array: T[], valor: T, comparadorFn: Comparador<T>): T | undefined

// Encuentra posición de inserción
busquedaBinariaIndiceInsercion<T>(
  array: T[],
  valor: T,
  comparadorFn: Comparador<T>
): number
```

---

## 🎯 Funciones de Colecciones

### Filtrado
```typescript
// Filtra por múltiples criterios simultáneamente
filtrarPorMultiplesCriterios<T>(
  items: T[],
  criterios: Partial<Record<keyof T, (valor: any) => boolean>>
): T[]

// Filtra por predicado simple
filtrar<T>(items: T[], predicado: Predicado<T>): T[]
```

### Ordenamiento
```typescript
// Ordena ascendente por propiedad
ordenarAscendente<T>(items: T[], clave: keyof T): T[]

// Ordena descendente por propiedad
ordenarDescendente<T>(items: T[], clave: keyof T): T[]

// Ordena por múltiples campos
ordenarPorMultiplesCampos<T>(
  items: T[],
  opciones: OpcionesOrdenamiento<T>[]
): T[]
```

### Agrupación
```typescript
// Agrupa por propiedad
agruparPorPropiedad<T>(items: T[], clave: keyof T): Record<string, T[]>

// Agrupa usando función extractor
agrupar<T>(items: T[], extractorClave: (item: T) => string | number): Record<string, T[]>
```

---

## 📊 Funciones de Transformación y Agregación

```typescript
// Contar elementos por propiedad
contarPorPropiedad<T>(items: T[], propiedad: keyof T): Record<string, number>

// Sumar valores de propiedad numérica
sumarPorPropiedad<T>(items: T[], propiedad: keyof T): number

// Calcular promedio
promediarPorPropiedad<T>(items: T[], propiedad: keyof T): number

// Encontrar máximo y mínimo
maximoPorPropiedad<T>(items: T[], propiedad: keyof T): number
minimoPorPropiedad<T>(items: T[], propiedad: keyof T): number

// Calcular mediana
medianaPorPropiedad<T>(items: T[], propiedad: keyof T): number
```

### Reportes Complejos
```typescript
// Reporte completo de estadísticas de reclamaciones
generarReporteEstadisticasReclamaciones(
  reclamaciones: Reclamacion[]
): ReporteEstadisticasReclamaciones

// Incluye: totales, promedios, medianas, distribución por estado/región/prioridad
// y razones de rechazo más comunes

// Reporte de análisis de pacientes
generarReporteAnalisisPacientes(pacientes: Paciente[]): ReporteAnalisisPacientes

// Reporte de desempeño de proveedores
generarReporteDesempenoProveedor(proveedores: Proveedor[]): ReporteDesempenoProveedor

// Reporte de predicción de inasistencia
generarReportePrediccionInasistencia(
  citas: Cita[],
  pacientes: Paciente[]
): ReportePrediccionInasistencia
```

---

## ✅ Funciones de Validación

Cada función retorna `{ esValido: boolean; errores: string[] }`

```typescript
// Valida reclamación completa con todas las reglas de negocio
validarReclamacion(reclamacion: Reclamacion): ResultadoValidacion

// Valida paciente (edad mínima 18 años, formato email, etc.)
validarPaciente(paciente: Paciente): ResultadoValidacion

// Valida proveedor (NPI válido, tasas coherentes, etc.)
validarProveedor(proveedor: Proveedor): ResultadoValidacion

// Valida nota clínica (contenido mínimo, palabras claves, etc.)
validarNotaClinica(nota: NotaClinica): ResultadoValidacion

// Valida cita (coherencia de estados y fechas)
validarCita(cita: Cita): ResultadoValidacion
```

### Reglas de Validación Implementadas

#### Reclamación
- ✅ Coherencia de montos: `montoAprobado + montoDenegado ≤ montoReclamacion`
- ✅ Coherencia de fechas: `serviceDate ≤ submissionDate ≤ lastUpdatedDate`
- ✅ Coherencia de estados: estado vs montos aprobados/denegados
- ✅ Razones de rechazo sin duplicados
- ✅ Campos obligatorios no vacíos

#### Paciente
- ✅ Edad mínima: 18 años
- ✅ Formato email válido
- ✅ Teléfono: mínimo 10 dígitos
- ✅ Coherencia: `citasFaltadas ≤ totalCitas`
- ✅ Puntuación de riesgo: 0-100

#### Proveedor
- ✅ NPI: mínimo 10 caracteres numéricos
- ✅ Tasa de denegación: 0-100%
- ✅ Especialidades sin duplicados

#### Cita
- ✅ Coherencia de estado y fecha
- ✅ Duración: positiva
- ✅ Recordatorios: no negativo

#### Nota Clínica
- ✅ Contenido: mínimo 10 caracteres
- ✅ Cantidad de palabras coincide con contenido
- ✅ Palabras clave sin duplicados
- ✅ Puntuación de confianza validada según estado `procesadoPorIA`

---

## 🚀 Cómo Compilar y Usar

### Compilar TypeScript
```bash
npm run build
```

Genera archivos `.js` y `.d.ts` en la carpeta `dist/`

### Verificar tipos sin compilar
```bash
npm run type-check
```

### Importar en tu código
```typescript
import {
  Reclamacion,
  validarReclamacion,
  busquedaLineal,
  ordenarDescendente,
  generarReporteEstadisticasReclamaciones,
} from "./src/index";
```

---

## 📝 Ejemplos de Uso

Ver archivo **[EJEMPLOS_USO.ts](./EJEMPLOS_USO.ts)** para ejemplos comentados de:
- Validación de modelos
- Búsqueda y filtrado
- Ordenamiento y agrupación
- Agregaciones y reportes
- Manejo de múltiples criterios

---

## 🏆 Criterios de Calidad

✅ **Tipado Estricto**
- Cero uso de `any`
- Tipos genéricos reutilizables
- Interfaces explícitas para todos los modelos

✅ **Funciones Puras e Inmutables**
- Sin efectos secundarios
- Arrays originales no modificados
- Uso de operadores spread y `filter`/`map`

✅ **Responsabilidad Única**
- Cada función hace UNA cosa bien
- Cada archivo tiene un propósito claro
- Composición de funciones para operaciones complejas

✅ **Manejo de Errores Robusto**
- Validación de inputs (arrays vacíos, null, undefined)
- Retornos predecibles
- Mensajes de error descriptivos

✅ **Rendimiento**
- Búsqueda lineal: O(n)
- Búsqueda binaria: O(log n)
- Ordenamiento: O(n log n)
- Agregaciones: O(n)

✅ **Documentación Completa**
- JSDoc en todas las funciones
- Especificación de complejidad temporal
- Parámetros y retornos documentados

---

## 📦 Dependencias

- **TypeScript**: ^5.3.3 (devDependency)
- **Node.js**: Compatible con ES2020+

---

## 🔄 Próximos Pasos

1. Crear suite de pruebas unitarias (Jest/Vitest)
2. Integrar con APIs reales de HealthCore
3. Implementar caching para operaciones frecuentes
4. Agregar análisis de complejidad de algoritmos
5. Documentación de integración con Frontend

---

## 👤 Autor

Desarrollado como **Milestone 2** del bootcamp de Ingeniería de IA en 4Geeks Academy.

---

## 📄 Licencia

ISC
