# 🔧 Troubleshooting - Milestone 3

## ❌ Problemas Comunes y Soluciones

---

## **1. "Module not found" / "Cannot find module"**

### **Síntoma**
```
Module not found: Can't resolve '@/types/candidate'
```

### **Causas Posibles**
- Importación con ruta incorrecto
- Archivo no existe
- Configuración de `tsconfig.json` incorrecta
- Alias `@/*` no configurado

### **Soluciones**

✅ **1. Verificar que el archivo existe**
```bash
ls -la types/candidate.ts
```

✅ **2. Verificar importación**
```typescript
// ❌ Incorrecto
import { Candidate } from './types/candidate'

// ✅ Correcto (si path alias está configurado)
import { Candidate } from '@/types/candidate'
```

✅ **3. Verificar `tsconfig.json`**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

✅ **4. Reiniciar servidor**
```bash
npm run dev
```

---

## **2. "API_URL is undefined"**

### **Síntoma**
```
Error: Cannot read property 'split' of undefined
```

Probablemente en `lib/api.ts` cuando intenta usar `process.env.NEXT_PUBLIC_API_URL`.

### **Causas Posibles**
- `.env.local` no existe
- Variable mal nombrada
- Servidor no reiniciado después de crear `.env.local`
- Variable no tiene prefijo `NEXT_PUBLIC_`

### **Soluciones**

✅ **1. Crear `.env.local`**
```bash
# En la raíz de talent-pipeline-tracker/
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
EOF
```

✅ **2. Verificar que el archivo existe**
```bash
cat .env.local
```

Debe mostrar:
```
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
```

✅ **3. Verificar nombre de variable**
```typescript
// ✅ Correcto
const API_URL = process.env.NEXT_PUBLIC_API_URL

// ❌ Incorrecto (sin NEXT_PUBLIC_)
const API_URL = process.env.API_URL
```

✅ **4. Reiniciar servidor**
```bash
# Detener con Ctrl+C
# Luego
npm run dev
```

✅ **5. Verificar en navegador**
```javascript
// En console del navegador (F12)
console.log(process.env.NEXT_PUBLIC_API_URL)
```

---

## **3. "Cannot GET /candidates/[id]"**

### **Síntoma**
```
404 Not Found
```

Al acceder a `/candidates/123`.

### **Causas Posibles**
- Archivo `app/candidates/[id]/page.tsx` no existe
- Nombre de carpeta incorrecto
- Ruta dinámica no está configurada

### **Soluciones**

✅ **1. Verificar estructura**
```bash
# Debe existir:
app/candidates/[id]/page.tsx
```

✅ **2. Verificar que `page.tsx` existe**
```bash
ls -la app/candidates/[id]/
```

✅ **3. Contenido mínimo de `page.tsx`**
```typescript
export default function CandidateDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <div>Detalle del candidato: {params.id}</div>
}
```

✅ **4. Reiniciar servidor**
```bash
npm run dev
```

---

## **4. "CORS Error"**

### **Síntoma**
```
Access to XMLHttpRequest at 'https://playground.4geeks.com/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

### **Causas Posibles**
- API backend no tiene CORS habilitado
- Dominio no está en la lista de CORS permitidos
- Request usa método incorrecto (POST/PUT/PATCH/DELETE sin preflight)

### **Soluciones**

✅ **1. Para desarrollo local (si CORS es el problema)**

Usa proxy de CORS:
```typescript
// NO RECOMENDADO EN PRODUCCIÓN - solo para desarrollo
const API_URL = `https://cors-anywhere.herokuapp.com/${process.env.NEXT_PUBLIC_API_URL}`
```

✅ **2. Verificar que API soporta CORS**
```bash
# En terminal, prueba headers de CORS
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -v https://playground.4geeks.com/tracker/api/v1/records
```

✅ **3. Contactar al tech lead**

Si es un problema real del backend, reporta:
```
Error: CORS bloqueado
Dominio: http://localhost:3000
API: https://playground.4geeks.com/tracker/api/v1
Necesario: Agregar localhost:3000 a allowedOrigins en backend
```

---

## **5. TypeScript Errors en Desarrollo**

### **Síntoma**
```
Type 'undefined' is not assignable to type 'Candidate'
Type 'any' is not assignable to type 'Candidate'
```

### **Causas Posibles**
- Falta tipado explícito
- Interfaz incompleta
- Valor null/undefined no manejado

### **Soluciones**

✅ **1. Usar `satisfies` para validar tipos**
```typescript
// ❌ Incorrecto
const candidate = {} as Candidate

// ✅ Correcto
const candidate: Candidate = {
  id: '123',
  full_name: 'Juan',
  // ... todos los campos requeridos
}
```

✅ **2. Manejar null/undefined**
```typescript
// ✅ Correcto
function displayCandidate(candidate: Candidate | undefined) {
  if (!candidate) return <div>No found</div>
  return <div>{candidate.full_name}</div>
}
```

✅ **3. Verificar `tsconfig.json`**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

✅ **4. Ejecutar type checking**
```bash
npm run typecheck
```

---

## **6. Build Falla**

### **Síntoma**
```
npm run build
> Error during Next.js build
```

### **Soluciones**

✅ **1. Limpiar caché**
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

✅ **2. Verificar TypeScript**
```bash
npm run typecheck
```

✅ **3. Verificar ESLint**
```bash
npm run lint
```

✅ **4. Ver logs completos**
```bash
npm run build 2>&1 | head -100
```

---

## **7. API Retorna 404 / 500**

### **Síntoma**
```javascript
// En console
fetch('/api/records')
// 404 Not Found
// o
// 500 Internal Server Error
```

### **Soluciones**

✅ **1. Verificar URL**
```typescript
// ✅ Correcto
const url = `${process.env.NEXT_PUBLIC_API_URL}/records`

// ❌ Incorrecto
const url = `/api/records`  // Esto busca en tu servidor Next.js
```

✅ **2. Verificar método HTTP**
```typescript
// ✅ Correcto
fetch(`${API_URL}/records`, { method: 'GET' })

// Verificar que el método coincide con el endpoint
```

✅ **3. Verificar payload JSON**
```typescript
// ✅ Correcto
fetch(`${API_URL}/records`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ full_name: 'Juan' }),
})
```

✅ **4. Verificar en Postman/Insomnia**
```
GET https://playground.4geeks.com/tracker/api/v1/records
```

Debe retornar datos.

---

## **8. Componente No Se Actualiza**

### **Síntoma**
Cambias un campo pero la UI no se actualiza.

### **Causas Posibles**
- Estado no se está actualizando
- Componente no se re-renderiza
- Dependencias de useEffect incorrectas
- Mutación directa del estado

### **Soluciones**

✅ **1. Verificar useState**
```typescript
// ✅ Correcto
const [data, setData] = useState(initialData)
setData(newData)  // Trigger re-render

// ❌ Incorrecto
data.name = 'Juan'  // Mutación directa
```

✅ **2. Verificar useEffect**
```typescript
// ✅ Correcto - especificar dependencias
useEffect(() => {
  fetchData()
}, [candidateId])  // Se ejecuta cuando candidateId cambia

// ❌ Incorrecto - sin dependencias
useEffect(() => {
  fetchData()
})  // Se ejecuta infinitamente
```

✅ **3. Usar React DevTools**
```
F12 → React DevTools → Profiler
Interactúa con la app y mira qué se re-renderiza
```

---

## **9. Spinners/Loading No Funciona**

### **Síntoma**
Botón no muestra spinner mientras se carga.

### **Soluciones**

✅ **1. Verificar prop `isLoading`**
```typescript
<Button isLoading={isLoading}>
  {isLoading ? 'Cargando...' : 'Guardar'}
</Button>
```

✅ **2. Mantener estado durante request**
```typescript
const [isLoading, setIsLoading] = useState(false)

const handleSave = async () => {
  setIsLoading(true)
  try {
    await api.updateCandidate(id, data)
  } finally {
    setIsLoading(false)
  }
}
```

✅ **3. No resetear estado prematuramente**
```typescript
// ❌ Incorrecto
const { data } = await api.fetch()
setIsLoading(false)
// Si hay otro await, isLoading ya es false

// ✅ Correcto
try {
  const { data } = await api.fetch()
} finally {
  setIsLoading(false)
}
```

---

## **10. Validación de Formulario No Funciona**

### **Síntoma**
Puedes enviar formulario con campos vacíos.

### **Soluciones**

✅ **1. Validar antes de enviar**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!formData.full_name) {
    setError('Nombre es requerido')
    return
  }
  
  // Enviar datos
}
```

✅ **2. Deshabilitar botón**
```typescript
<button disabled={!formData.full_name || isLoading}>
  Guardar
</button>
```

✅ **3. Mostrar error al usuario**
```typescript
{error && <ErrorMessage message={error} />}
```

---

## 🆘 Si Nada Funciona

### **Paso 1: Resetear todo**
```bash
# Detener servidor (Ctrl+C)
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### **Paso 2: Verificar estructura**
```bash
# Deben existir estos archivos:
app/page.tsx
app/layout.tsx
app/candidates/[id]/page.tsx
components/candidates/CandidatesList.tsx
components/common/UIElements.tsx
lib/api.ts
types/candidate.ts
hooks/useCandidates.ts
```

### **Paso 3: Verificar variables**
```bash
# Verificar .env.local
cat .env.local

# Verificar tsconfig.json
cat tsconfig.json | grep paths
```

### **Paso 4: Consultar documentación**
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### **Paso 5: Buscar logs**
```bash
# Logs del navegador
F12 → Console → Ver errores

# Logs del servidor
Ctrl+C para ver el último output
npm run dev 2>&1 | tail -50
```

---

## 📞 Contacto

¿Problema no resuelto?

1. Revisar [TESTING.md](./TESTING.md) para debugging manual
2. Revisar [ARCHITECTURE.md](./ARCHITECTURE.md) para entender flujo
3. Consultar [API-ROUTES.md](./API-ROUTES.md) para endpoints
4. Contactar tech lead con:
   - Error exacto (copy/paste del mensaje)
   - Stack trace completo
   - Pasos para reproducir
   - Sistema operativo y versiones

---

**Última actualización**: 21 de noviembre de 2024
