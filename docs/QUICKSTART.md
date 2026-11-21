# 🚀 Quick Start - Comienza en 5 minutos

Bienvenido al proyecto transversal de 4Geeks Academy. Este guide te lleva desde 0 a tener el proyecto funcionando en tu máquina.

---

## ⏰ 5 Minutos o Menos

### **1. Clonar el Repositorio** (30 segundos)

```bash
# Si ya lo tienes clonado, navega a la carpeta
cd aie-pt-3--Hito1-CompanyWebPage-AspetjW

# Verificar que estés en la rama correcta
git branch -a
```

---

### **2. Instalar Dependencias** (2 minutos)

```bash
# Instalar dependencias raíz (TypeScript M2)
npm install

# Instalar dependencias de Milestone 3
cd uis/talent-pipeline-tracker
npm install
```

---

### **3. Configurar Variables de Entorno** (30 segundos)

```bash
# Crear .env.local en talent-pipeline-tracker/
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
EOF

# Verificar que se creó
cat .env.local
```

---

### **4. Ejecutar el Proyecto** (1 minuto)

**Opción A: Milestone 2 (Utilities TypeScript)**
```bash
# En la raíz del proyecto
npm run typecheck    # Validar tipos
npx tsc             # Compilar a JavaScript
```

**Opción B: Milestone 3 (Talent Pipeline Tracker)**
```bash
# En uis/talent-pipeline-tracker/
npm run dev
```

Acceder a: **http://localhost:3000**

---

### **5. Verificar que Funciona** (1 minuto)

```bash
# En otra terminal:
npm run typecheck   # Debe retornar 0 errores
npm run build      # Debe compilar sin errores
```

✅ **¡Listo!** Tienes el proyecto funcionando.

---

## 📚 Próximos Pasos

Según el Milestone en que estés:

### **Si trabajas en Milestone 2 (Backend Logic)**
- 📖 Lee [01-MILESTONE-2/README.md](./01-MILESTONE-2/README.md)
- 🛠️ Implementa [src/types/models.ts](../src/types/)
- 🔍 Estudia [01-MILESTONE-2/IMPLEMENTATION.md](./01-MILESTONE-2/IMPLEMENTATION.md)

### **Si trabajas en Milestone 3 (Frontend)**
- 📖 Lee [02-MILESTONE-3/README.md](./02-MILESTONE-3/README.md)
- ⚙️ Sigue [02-MILESTONE-3/SETUP.md](./02-MILESTONE-3/SETUP.md)
- 🏗️ Entiende [02-MILESTONE-3/ARCHITECTURE.md](./02-MILESTONE-3/ARCHITECTURE.md)
- 🧩 Construye [02-MILESTONE-3/COMPONENTS.md](./02-MILESTONE-3/COMPONENTS.md)

---

## 🎯 Estructura del Proyecto en 1 Minuto

```
aie-pt-3--Hito1-CompanyWebPage-AspetjW/
│
├── 📚 docs/                    ← Documentación (estás aquí)
│   ├── README.md              ← Índice general
│   ├── QUICKSTART.md          ← Esta guía
│   ├── 00-CONTEXT/            ← Briefing de empresa
│   ├── 01-MILESTONE-2/        ← Utilities TypeScript
│   └── 02-MILESTONE-3/        ← Talent Pipeline Tracker
│
├── 📂 src/                     ← Código TypeScript (M2)
│   ├── types/
│   ├── utils/
│   └── index.ts
│
├── 📂 uis/
│   └── talent-pipeline-tracker/  ← App Next.js (M3)
│       ├── app/
│       ├── components/
│       ├── types/
│       ├── lib/
│       ├── package.json
│       └── .env.local
│
└── 📄 README.md               ← Raíz del proyecto
```

---

## ✅ Checklist de Setup

- [ ] Cloné el repositorio
- [ ] Instalé dependencias (`npm install`)
- [ ] Creé `.env.local` en `uis/talent-pipeline-tracker/`
- [ ] Ejecuté `npm run dev` y funciona
- [ ] Accedí a `http://localhost:3000`
- [ ] Validé tipos (`npm run typecheck` → 0 errores)
- [ ] Validé build (`npm run build` → Success)

---

## 🆘 Problemas Frecuentes

### **"npm: command not found"**
```bash
# Instala Node.js desde https://nodejs.org
node --version  # Debe ser ≥ 18
npm --version   # Debe ser ≥ 9
```

### **"Cannot find module"**
```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
```

### **"API_URL is undefined"**
```bash
# Verifica .env.local
cat uis/talent-pipeline-tracker/.env.local
# Debe tener: NEXT_PUBLIC_API_URL=...
```

### **"Module not found: Can't resolve..."**
- Reinicia el servidor (`Ctrl+C`, `npm run dev`)
- Verifica que el archivo exista

---

## 📖 Documentación Completa

| Documento | Para Qué | Leer Cuando |
|-----------|----------|------------|
| **[README.md](./README.md)** | Índice de todo | Primero |
| **[QUICKSTART.md](./QUICKSTART.md)** | Configurar en 5 min | Ahora mismo |
| **[00-CONTEXT/README.md](./00-CONTEXT/README.md)** | Briefing y contexto | Antes de codear |
| **[01-MILESTONE-2/README.md](./01-MILESTONE-2/README.md)** | Utilities M2 | Si trabajas M2 |
| **[02-MILESTONE-3/README.md](./02-MILESTONE-3/README.md)** | Frontend M3 | Si trabajas M3 |
| **[02-MILESTONE-3/SETUP.md](./02-MILESTONE-3/SETUP.md)** | Setup M3 detallado | Después de QUICKSTART |
| **[02-MILESTONE-3/ARCHITECTURE.md](./02-MILESTONE-3/ARCHITECTURE.md)** | Cómo funciona M3 | Antes de codear M3 |
| **[02-MILESTONE-3/COMPONENTS.md](./02-MILESTONE-3/COMPONENTS.md)** | Componentes M3 | Mientras codeas |
| **[02-MILESTONE-3/API-ROUTES.md](./02-MILESTONE-3/API-ROUTES.md)** | Endpoints API | Si llamas API |
| **[02-MILESTONE-3/TESTING.md](./02-MILESTONE-3/TESTING.md)** | Testing M3 | Antes de merge |
| **[02-MILESTONE-3/TROUBLESHOOTING.md](./02-MILESTONE-3/TROUBLESHOOTING.md)** | Solucionar problemas | Si hay errores |

---

## 💡 Consejos Profesionales

### **1. Siempre leer CONTEXT.md primero**
El briefing contiene:
- Entidades a modelar
- Campos específicos
- Reglas de negocio
- Reportes esperados

```bash
cat docs/00-CONTEXT/README.md
```

### **2. Usar Git branches por milestone**
```bash
# Para Milestone 2
git switch -c feature/milestone-2-utilities

# Para Milestone 3
git switch -c feature/milestone-3-tracker
```

### **3. Commits descriptivos**
```bash
# ✅ Bueno
git commit -m "Implementa búsqueda binaria en utils/search.ts"

# ❌ Malo
git commit -m "Fix"
```

### **4. Validar antes de hacer PR**
```bash
npm run typecheck   # 0 errores
npm run lint        # 0 warnings
npm run build       # Success
```

---

## 🎓 Recursos Externos

- [Next.js Docs](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)

---

## ❓ ¿Preguntas?

1. Revisa [TROUBLESHOOTING.md](./02-MILESTONE-3/TROUBLESHOOTING.md)
2. Busca en la documentación del milestone
3. Consulta con tu tech lead

---

## 🎉 Siguiente Paso

Según tu milestone:

- **M2**: 👉 [01-MILESTONE-2/README.md](./01-MILESTONE-2/README.md)
- **M3**: 👉 [02-MILESTONE-3/SETUP.md](./02-MILESTONE-3/SETUP.md)

---

**Happy Coding! 🚀**

**Última actualización**: 21 de noviembre de 2024
