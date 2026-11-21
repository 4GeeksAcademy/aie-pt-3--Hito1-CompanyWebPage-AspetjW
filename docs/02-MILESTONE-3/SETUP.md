# ⚙️ Setup e Instalación - Milestone 3

## 🚀 Requisitos Previos

Asegúrate de tener instalado:

```bash
# Verificar versiones
node --version      # Debe ser ≥ 18.17
npm --version       # Debe ser ≥ 9.0
```

---

## 📦 Instalación Inicial

### 1. **Crear el proyecto Next.js**

Si es la primera vez, ejecuta:

```bash
cd uis
npx create-next-app@latest talent-pipeline-tracker \
  --typescript \
  --app \
  --tailwind \
  --eslint \
  --no-git
```

**Opciones recomendadas:**
- Use TypeScript? → **Yes**
- Use ESLint? → **Yes**
- Use Tailwind CSS? → **Yes**
- Use `src/` directory? → **No**
- Use App Router? → **Yes**
- Use Turbopack? → **No**

### 2. **Configurar Variables de Entorno**

Crea `.env.local` en la raíz de `talent-pipeline-tracker/`:

```env
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
```

> ⚠️ **Importante**: La variable debe empezar con `NEXT_PUBLIC_` para ser accesible en el navegador.

### 3. **Instalar Dependencias**

```bash
# Dentro de talent-pipeline-tracker/
npm install
```

---

## 🏗️ Crear la Estructura de Carpetas

```bash
mkdir -p app/candidates/{[id],components}
mkdir -p components/{candidates,common}
mkdir -p lib
mkdir -p types
mkdir -p hooks
mkdir -p docs
```

**Resultado final:**
```
talent-pipeline-tracker/
├── app/
│   ├── candidates/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── components/
│   │       └── CandidateDetail.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── candidates/
│   │   └── CandidatesList.tsx
│   └── common/
│       └── UIElements.tsx
├── lib/
│   └── api.ts
├── types/
│   └── candidate.ts
├── hooks/
│   └── useCandidates.ts
├── docs/
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   ├── API-ROUTES.md
│   ├── TESTING.md
│   └── DEPLOYMENT.md
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🔧 Configurar TypeScript

Verifica `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "resolveJsonModule": true,
    "allowJs": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## 🎨 Configurar Tailwind CSS v4

Verifica `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Extensiones de color personalizadas según CONTEXT.md
      },
    },
  },
  plugins: [],
}
export default config
```

---

## 🚀 Ejecutar en Desarrollo

```bash
# Terminal 1: Iniciar servidor de desarrollo
npm run dev

# La aplicación estará en http://localhost:3000
# Acceso a Codespaces: http://localhost:3000 (reenrutado automáticamente)
```

**Verificar que funciona:**
- [ ] Accede a `http://localhost:3000`
- [ ] Ves la página raíz sin errores
- [ ] La consola del navegador no muestra errores TypeScript

---

## ✅ Validación de Setup

### **TypeScript**
```bash
npm run typecheck
```

Debe retornar **0 errores**.

### **ESLint**
```bash
npm run lint
```

Debe retornar **0 warnings críticos**.

### **Build**
```bash
npm run build
```

Debe compilar sin errores y generar `.next/`.

---

## 🔗 Verificar Conexión con API

Prueba manual en la consola del navegador:

```javascript
// En console del navegador (F12)
const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('API URL:', API_URL);

// Intentar traer candidatos
fetch(`${API_URL}/records`)
  .then(r => r.json())
  .then(data => console.log('Candidatos:', data))
  .catch(err => console.error('Error:', err));
```

**Esperado**: 
- ✅ Ves la URL de la API
- ✅ Ves un array de candidatos en consola
- ❌ Si hay CORS error, revisa la API backend

---

## 🐛 Troubleshooting de Setup

### **Error: "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Error: "API_URL is undefined"**
- Verifica que `.env.local` existe
- Verifica que tiene `NEXT_PUBLIC_API_URL=...`
- Reinicia el servidor (`Ctrl+C`, `npm run dev`)

### **Error: "Cannot find module '@/*'"**
- Verifica que `tsconfig.json` tiene `"paths": { "@/*": ["./*"] }`
- Reinicia el servidor

### **Error de CORS desde la API**
- Esto es normal si la API backend no tiene CORS habilitado
- Verifica con tu tech lead
- Para desarrollo local, puedes usar proxies de CORS públicos (no recomendado en producción)

---

## 📝 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

| Comando | Propósito |
|---------|-----------|
| `npm run dev` | Ejecutar en desarrollo (hot reload) |
| `npm run build` | Compilar para producción |
| `npm start` | Ejecutar build de producción |
| `npm run lint` | Validar código con ESLint |
| `npm run typecheck` | Validar tipos sin compilar |

---

## ✨ Próximos Pasos

Una vez completado el setup:

1. **[Leer ARCHITECTURE.md](./ARCHITECTURE.md)** — Entiende la estructura
2. **[Crear types/candidate.ts](./COMPONENTS.md)** — Define los tipos
3. **[Crear lib/api.ts](./API-ROUTES.md)** — Implementa las llamadas
4. **[Crear componentes](./COMPONENTS.md)** — Construye la UI
5. **[Testing y verificación](./TESTING.md)** — Valida funcionamiento

---

**Última actualización**: 21 de noviembre de 2024
