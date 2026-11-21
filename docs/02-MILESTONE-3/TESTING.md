# 🧪 Testing y Verificación - Milestone 3

## 📋 Estrategia de Testing

```
Testing Pyramid
       /\
      /  \     E2E (Vercel Preview)
     /────\
    /      \   Component Tests (Storybook/Vitest)
   /────────\
  /          \ Unit Tests (API, Hooks)
 /────────────\
/              \ Type Checking (TypeScript)
────────────────
```

---

## ✅ Validación TypeScript

### **1. Type Checking**

```bash
npm run typecheck
```

Debe retornar **0 errores**.

Verifica:
- ✅ Tipos explícitos en funciones
- ✅ Parámetros tipados
- ✅ Retornos correctos
- ✅ Interfaz de props

---

## 🧹 Linting

### **2. ESLint**

```bash
npm run lint
```

Debe retornar **0 errores críticos**.

Revisa:
- ✅ Convenciones de nombrado
- ✅ Código no utilizado
- ✅ Mejoras de rendimiento

---

## 🏗️ Build

### **3. Compilación**

```bash
npm run build
```

Debe compilar sin errores y generar `.next/`.

Valida:
- ✅ Código TypeScript correcto
- ✅ Dependencias resueltas
- ✅ Rutas dinámicas generadas
- ✅ Assets optimizados

---

## 🧪 Testing Manual

### **4. Verificación Funcional Local**

```bash
npm run dev
```

Accede a `http://localhost:3000` y verifica:

#### **Página Principal (/)**
- [ ] ✅ Carga sin errores
- [ ] ✅ Muestra lista de candidatos
- [ ] ✅ Filtro por status funciona (URL se actualiza sin reload)
- [ ] ✅ Filtro por stage funciona (URL se actualiza sin reload)
- [ ] ✅ Búsqueda por nombre funciona
- [ ] ✅ Búsqueda por email funciona
- [ ] ✅ Estado de carga visible inicialmente
- [ ] ✅ Mensaje de error si API falla
- [ ] ✅ Estado vacío si no hay candidatos
- [ ] ✅ Botón "Nuevo Candidato" abre modal
- [ ] ✅ Modal tiene campos validados

#### **Modal: Crear Candidato**
- [ ] ✅ Campos requeridos marcados
- [ ] ✅ Validación de email
- [ ] ✅ Validación de teléfono (formato)
- [ ] ✅ Botón deshabilitado si campos inválidos
- [ ] ✅ Spinners en botón mientras se envía
- [ ] ✅ Mensaje de éxito al crear
- [ ] ✅ Mensaje de error si falla
- [ ] ✅ Listado se actualiza sin reload

#### **Página de Detalle (/candidates/[id])**
- [ ] ✅ Carga sin errores
- [ ] ✅ Muestra todos los campos del candidato
- [ ] ✅ Estado de carga visible inicialmente
- [ ] ✅ Mensaje de error si candidato no existe
- [ ] ✅ Selector de status funciona
- [ ] ✅ Selector de stage funciona
- [ ] ✅ Cambios en status se guardan (PATCH)
- [ ] ✅ Cambios en stage se guardan (PATCH)

#### **Sección de Notas**
- [ ] ✅ Muestra listado de notas existentes
- [ ] ✅ Formulario para agregar nota
- [ ] ✅ Validación: nota no vacía
- [ ] ✅ Botón de agregar deshabilitado si está vacío
- [ ] ✅ Spinner mientras se crea nota
- [ ] ✅ Nueva nota aparece al crear (sin reload)
- [ ] ✅ Botón de eliminar funciona
- [ ] ✅ Nota desaparece al eliminar (sin reload)
- [ ] ✅ Mensaje de error si falla

#### **Modal: Editar Candidato**
- [ ] ✅ Pre-carga datos actuales
- [ ] ✅ Validación de campos
- [ ] ✅ Botón deshabilitado si sin cambios
- [ ] ✅ Spinner mientras se guarda
- [ ] ✅ Mensaje de éxito
- [ ] ✅ Campos actualizados en detalle

---

## 🌐 Testing Basado en URLs

### **5. Verificar useSearchParams**

```bash
# Cambiar filtros desde URL
http://localhost:3000/?status=applied&stage=interview
```

Verificar:
- [ ] ✅ Filtros se aplican sin reload
- [ ] ✅ URL cambia cuando seleccionas filtros
- [ ] ✅ Filtros persisten al recargar página
- [ ] ✅ Búsqueda se mantiene en URL

---

## 🔄 Testing de API

### **6. Verificar Integración con API**

**En la consola del navegador (F12):**

```javascript
// Listar candidatos
const API_URL = process.env.NEXT_PUBLIC_API_URL
fetch(`${API_URL}/records`)
  .then(r => r.json())
  .then(data => console.log('Candidatos:', data))

// Obtener candidato específico
fetch(`${API_URL}/records/CANDIDATE_ID`)
  .then(r => r.json())
  .then(data => console.log('Candidato:', data))

// Listar notas
fetch(`${API_URL}/records/CANDIDATE_ID/notes`)
  .then(r => r.json())
  .then(data => console.log('Notas:', data))
```

Verificar:
- [ ] ✅ Respuestas JSON válidas
- [ ] ✅ Estructura de datos corresponde con tipos
- [ ] ✅ No hay CORS errors
- [ ] ✅ Status HTTP correcto (200, 201, 404, etc.)

---

## 📊 Testing de Performance

### **7. Lighthouse**

```bash
npm run build
npm start
```

Luego abrir DevTools (F12) → Lighthouse:

**Métricas objetivo:**
- [ ] ✅ Performance: ≥ 80
- [ ] ✅ Accessibility: ≥ 90
- [ ] ✅ Best Practices: ≥ 90
- [ ] ✅ SEO: ≥ 90

---

## 🎯 Checklist de Verificación Final

### **Antes de Merge a Main**

#### **TypeScript y Tipado**
- [ ] ✅ `npm run typecheck` retorna 0 errores
- [ ] ✅ No hay `any` en el código
- [ ] ✅ Todos los parámetros están tipados
- [ ] ✅ Todos los retornos están tipados

#### **Código**
- [ ] ✅ `npm run lint` retorna 0 errores
- [ ] ✅ `npm run build` compila sin errores
- [ ] ✅ No hay console.log() de debug
- [ ] ✅ Nombres descriptivos en español/inglés
- [ ] ✅ SRP: cada componente una responsabilidad
- [ ] ✅ No hay duplicación de código

#### **Funcionalidad**
- [ ] ✅ Listar candidatos funciona
- [ ] ✅ Filtros funcionan (URL)
- [ ] ✅ Búsqueda funciona
- [ ] ✅ Ver detalle funciona
- [ ] ✅ Cambiar status funciona
- [ ] ✅ Cambiar stage funciona
- [ ] ✅ Crear candidato funciona
- [ ] ✅ Editar candidato funciona
- [ ] ✅ Crear nota funciona
- [ ] ✅ Eliminar nota funciona
- [ ] ✅ Estados (loading, error, vacío) visibles

#### **UX**
- [ ] ✅ Spinners en botones mientras se carga
- [ ] ✅ Mensajes de error claros
- [ ] ✅ Validación de formularios
- [ ] ✅ No hay page jumps
- [ ] ✅ Navegación suave
- [ ] ✅ Accesibilidad: Tab order correcto
- [ ] ✅ Responsive en móvil/tablet/desktop

#### **Git**
- [ ] ✅ Rama creada: `feature/milestone-3`
- [ ] ✅ Commits con mensajes descriptivos
- [ ] ✅ No hay archivos innecesarios
- [ ] ✅ `.env.local` en `.gitignore`
- [ ] ✅ `node_modules` en `.gitignore`

---

## 🐛 Debugging

### **Ver Console en Node**

```bash
npm run dev -- --debug
```

### **Ver DevTools en Navegador**

```
F12 → Console → Ver errores y logs
F12 → Network → Ver requests a API
F12 → Application → Ver estado de React
```

### **Ver TypeScript Errors en Real-Time**

```bash
npm run typecheck -- --watch
```

---

## 📋 Reporte de Testing

**Genera este reporte antes de hacer PR:**

```markdown
## Testing Report - Milestone 3

### Type Safety
- [x] TypeScript compilation: 0 errors
- [x] No `any` types used
- [x] All functions typed

### Code Quality
- [x] ESLint: 0 critical errors
- [x] Build: Success
- [x] No console.logs left

### Functionality
- [x] Candidates list loads
- [x] Filters work (useSearchParams)
- [x] Search works
- [x] Detail view loads
- [x] Status/Stage updates work
- [x] Create candidate works
- [x] Edit candidate works
- [x] Notes CRUD works

### User Experience
- [x] Loading states visible
- [x] Error messages clear
- [x] Form validation works
- [x] Mobile responsive
- [x] Accessibility tested

### Lighthouse
- Performance: 85+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
```

---

**Última actualización**: 21 de noviembre de 2024
