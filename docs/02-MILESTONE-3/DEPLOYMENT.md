# 🚢 Despliegue - Milestone 3

## 🚀 Opciones de Despliegue

### **1. Vercel (Recomendado para Next.js)**

**Ventajas:**
- ✅ Integración nativa con Next.js
- ✅ Deployments automáticos desde GitHub
- ✅ Serverless functions gratuitas
- ✅ CDN global
- ✅ Preview deployment en cada PR
- ✅ Zero-config

**Pasos:**

1. **Conectar repositorio GitHub a Vercel**
   - Ir a https://vercel.com
   - Clickear "New Project"
   - Importar repositorio GitHub
   - Autorizar Vercel

2. **Configurar variables de entorno**
   - En Vercel, ir a Settings → Environment Variables
   - Agregar: `NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1`

3. **Deploy automático**
   - Vercel automáticamente:
     - Detecta Next.js
     - Instala dependencias
     - Ejecuta `npm run build`
     - Despliega en Vercel Edge Network

4. **Verificar despliegue**
   - Recibir email de Vercel con URL
   - Acceder a URL pública
   - Verificar funcionamiento

**URL resultante:**
```
https://talent-pipeline-tracker.vercel.app
```

---

### **2. Netlify**

**Pasos:**

1. **Conectar repositorio**
   - Ir a https://netlify.com
   - Clickear "Add new site" → "Import an existing project"
   - Conectar GitHub

2. **Configurar build**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: `.netlify/functions`

3. **Configurar variables**
   - En Settings → Build & Deploy → Environment
   - `NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1`

4. **Deploy**
   - Netlify despliega automáticamente

---

### **3. AWS Amplify**

**Pasos:**

1. **Conectar repositorio**
   - AWS Amplify → "Create app"
   - Conectar GitHub

2. **Configurar app.yml**
   - Crear `amplify.yml` en raíz del proyecto:
   ```yaml
   version: 1
   applications:
     - appRoot: uis/talent-pipeline-tracker
       backend:
         phases:
           build:
             commands:
               - npm install
               - npm run build
       frontend:
         phases:
           build:
             commands:
               - npm install
               - npm run build
         artifacts:
           baseDirectory: .next
           files:
             - '**/*'
       cache:
         paths:
           - 'node_modules/**/*'
   ```

3. **Configurar ambiente**
   - En Amplify console: Environment variables
   - `NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1`

---

### **4. Railway**

**Pasos:**

1. **Crear proyecto**
   - https://railway.app
   - "New project"
   - Deploy from GitHub repo

2. **Configurar servicio**
   - **Build command**: `npm run build`
   - **Start command**: `npm start`
   - **Root directory**: `uis/talent-pipeline-tracker`

3. **Agregar variables**
   - En Railway dashboard:
   - `NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1`

---

## 🔧 Configuración Pre-Despliegue

### **1. Build Optimization**

Verifica `next.config.ts`:

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  
  // Optimizaciones de imagen
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Headers de seguridad
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
      ],
    },
  ],
  
  // Redirecciones
  redirects: async () => [
    {
      source: '/candidates',
      destination: '/',
      permanent: false,
    },
  ],
}

export default nextConfig
```

### **2. Environment Variables**

Crear `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
NODE_ENV=production
```

### **3. Verificar Build Localmente**

```bash
npm run build
npm start
```

Debe funcionar en `http://localhost:3000` sin errores.

---

## 📋 Checklist Pre-Despliegue

Antes de hacer deploy a producción:

- [ ] ✅ `npm run typecheck` → 0 errores
- [ ] ✅ `npm run lint` → 0 errores
- [ ] ✅ `npm run build` → Éxito
- [ ] ✅ `npm start` → Funciona localmente
- [ ] ✅ Testing manual completado
- [ ] ✅ `.env.local` en `.gitignore`
- [ ] ✅ No hay console.logs de debug
- [ ] ✅ No hay archivos temporales
- [ ] ✅ Responsive en móvil/tablet/desktop
- [ ] ✅ Accesibilidad validada
- [ ] ✅ Lighthouse score ≥ 80 en Performance

---

## 🌐 URLs de Producción

| Plataforma | URL |
|-----------|-----|
| **Vercel** | `https://talent-pipeline-tracker.vercel.app` |
| **Netlify** | `https://talent-pipeline-tracker.netlify.app` |
| **AWS Amplify** | `https://talent-pipeline-tracker.amplifyapp.com` |
| **Railway** | `https://talent-pipeline-tracker.railway.app` |

---

## 🔐 Variables de Entorno en Producción

Configura estas variables en tu plataforma de despliegue:

```env
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
NODE_ENV=production
```

> ⚠️ **Importante**: La variable debe empezar con `NEXT_PUBLIC_` para ser accesible en el navegador.

---

## 📊 Monitoreo Post-Despliegue

Después de desplegar, verifica:

1. **Función**: 
   - Accede a URL pública
   - Prueba listado de candidatos
   - Prueba filtros
   - Prueba CRUD de candidatos

2. **Performance**:
   - Abre Lighthouse (F12)
   - Genera report
   - Performance ≥ 80

3. **Logs**:
   - Vercel: Dashboard → Deployments → Logs
   - Netlify: Dashboard → Deploy log
   - AWS: Amplify → App settings → Logs

4. **Analytics**:
   - Configurar Google Analytics (opcional)
   - Monitorear user sessions
   - Rastrear errores

---

## 🔄 Despliegues Posteriores

Para future PRs:

```bash
# 1. Crear rama
git switch -c feature/milestone-3-improvements

# 2. Hacer cambios
# ... modificar archivos ...

# 3. Commit y push
git add .
git commit -m "Mejoras en Milestone 3"
git push origin feature/milestone-3-improvements

# 4. Vercel automáticamente:
#    - Crea "Preview Deployment"
#    - Genera URL temporal para revisar
#    - Actualiza PR con link
```

---

## ⚠️ Troubleshooting de Despliegue

### **Build falla en Vercel**
```bash
# Verificar localmente
npm ci  # Clean install
npm run build
```

### **API no responde en producción**
- Verificar que `NEXT_PUBLIC_API_URL` está configurada
- Verificar que la URL es correcta
- Verificar CORS en la API backend

### **Página 404**
- Verificar que archivos se subieron correctamente
- Verificar que rutas están definidas
- Revisar logs de despliegue

---

**Última actualización**: 21 de noviembre de 2024
