# 🤖 AGENTS.md - Protocolo de Inicialización y Gobernanza

## 📌 Versión
**1.0.0** | 21 de noviembre de 2026

---

## 🎯 Propósito
Este archivo define el protocolo de inicialización, flujo de trabajo y gobernanza para agentes de desarrollo (IA) que colaboran en el proyecto HealthCore. Garantiza consistencia, calidad y alineamiento con los estándares empresariales.

---

## 📖 Protocolo de Inicialización Obligatorio

### PASO 1️⃣: Lectura del Memory Bank (Obligatorio)
**Tiempo**: 5 minutos  
**Archivos a leer EN ORDEN**:

```
1. memory-bank/projectbrief.md       ← Problemas de negocio, usuarios, misión
2. memory-bank/techContext.md        ← Stack, mapeo monorepo, estándares
3. memory-bank/progress.md           ← Estado actual, decisiones, roadmap
```

**Qué Validar**:
- ✓ Entender los 4 problemas críticos de HealthCore
- ✓ Conocer el stack: Next.js, TypeScript, Tailwind, Node.js
- ✓ Ubicación exacta de `/uis/talent-pipeline-tracker`, `/src/utils`, `/services`
- ✓ Restricciones: sin Redux, sin `any`, TypeScript strict mode

### PASO 2️⃣: Revisar Briefing Empresarial
**Tiempo**: 3 minutos  
**Archivo**:
```
BRIEFING.md                         ← Contexto completo + entidades
```

**Qué Validar**:
- ✓ Modelos de datos: Reclamación, Paciente, Proveedor, Cita, NotaClínica
- ✓ Validaciones críticas (e.g., montos, fechas, coherencia)
- ✓ Reportes requeridos
- ✓ Restricciones legales (HIPAA, GDPR, auditoría)

### PASO 3️⃣: Acceder Documentación Técnica
**Tiempo**: Variable (según tarea)  
**Punto de Entrada**:
```
docs/README.md                      ← Índice maestro + enlaces
```

**Acceso por Milestone**:
- **M2 (TypeScript Utilities)**: `docs/01-MILESTONE-2/`
- **M3 (Talent Pipeline)**: `docs/02-MILESTONE-3/`
- **M4 (Agents)**: `memory-bank/` + este archivo

---

## ✅ Flujo Pre-Commit Obligatorio (4 Pasos Secuenciales)

**NOTA**: TODOS los pasos son OBLIGATORIOS. Ningún commit a rama feature sin completar.

### PASO A: Validar Código TypeScript
```bash
# 1. Compilar sin errores
npx tsc --noEmit

# 2. Linting
npx eslint src/ uis/ --fix

# 3. Formato
npx prettier --write .

# VALIDACIÓN: 
  ✓ $? === 0 (sin errores)
  ✓ Cero warnings de tipo
```

**Responsable**: Compilador TypeScript  
**Tiempo**: < 1 minuto

---

### PASO B: Ejecutar Tests (si aplica)
```bash
# 1. Tests unitarios
npm run test -- --testPathPattern=".spec.ts"

# 2. Coverage mínimo
npm run test:coverage

# VALIDACIÓN:
  ✓ Todos los tests pasan (exit code 0)
  ✓ Coverage >= 80% para M2, >= 60% para M3
  ✓ Ningún test skipped (pending)
```

**Responsable**: Jest  
**Tiempo**: < 2 minutos

---

### PASO C: Revisar Cambios Respecto a BRIEFING
```
1. Verificar que cambios NO violan reglas de negocio
2. Validar tipos: ¿están en models.ts?
3. Verificar constantes: ¿están en place correcto?
4. Checklist:
   ✓ Montos financieros: tolerancia ±$0.01
   ✓ Fechas: validar orden lógico (service < envío < actualización)
   ✓ Enums: "US" | "UK", "BAJA" | "MEDIA" | "ALTA", etc.
   ✓ Reglas de validación: ¿están en validations.ts?
```

**Responsable**: Revisor Manual  
**Tiempo**: 2-5 minutos

---

### PASO D: Preparar Mensaje de Commit
```bash
# Formato obligatorio:
git commit -m "type(scope): descripción

Descripción detallada (opcional).

BREAKING CHANGE: si aplica

Closes #123 (si cierra un issue)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

**Tipos Válidos**:
- `feat`: Nueva funcionalidad (feature branch)
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `refactor`: Reorganización sin cambio funcional
- `test`: Cambios en tests

**Ejemplo**:
```
feat(validations): agregar validación de email para Paciente

- Implementa regex para validar formato de email
- Integra con validarPaciente()
- Cubre edge cases (+, subdominio, etc.)

Closes #42

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

**Responsable**: Developer  
**Tiempo**: 1-2 minutos

---

## 🚫 Zonas Restringidas (No Modificar sin Autorización)

**ROJO 🔴 (Prohibido sin PM)**:
- `/BRIEFING.md` - Usar `memory-bank/projectbrief.md` para actualizar
- `/docs/README.md` - Índice maestro centralizado
- `/package.json` root - Contactar antes de agregar dependencia
- `/.github/workflows/` - Cambios en CI/CD
- `/uis/*/next.config.js` - Configuración crítica
- `/memory-bank/*.md` - Consultar antes de editar

**AMARILLO 🟡 (Revisar antes de cambiar)**:
- `/src/types/models.ts` - Cambios en entidades = cambio en BRIEFING
- `tsconfig.json` - Cambios en strict mode
- `/uis/*/tailwind.config.js` - Configuración de tokens
- `/.agents/rules/` - Estándares de desarrollo

**VERDE 🟢 (Libre para modificar)**:
- Código en `/src/utils/`
- Componentes en `/uis/*/components/`
- Código en `/services/`
- Documentación específica (no índices maestros)
- Ejemplos y demo

---

## 🔐 Reglas de Gobernanza Git

### Ramas
- **Feature**: `feat/milestone-X-{nombre}`
- **Fix**: `fix/{nombre-corto}`
- **Docs**: `docs/{nombre-corto}`

### Pull Requests
1. **Título**: Mismo formato que commit (`type(scope): descripción`)
2. **Descripción**: 
   - Qué cambia y por qué
   - Validación de los 4 pasos pre-commit
   - Referencias a issues
3. **Revisión**: Mínimo 1 aprobación antes de merge
4. **Merge**: Squash + Fast Forward para historial limpio

### Commits
- **Atómicos**: 1 cambio lógico por commit
- **Co-authored**: Incluir footer si es colaborativo
- **Sin merge commits**: Rebase si hay conflictos
- **Histórico**: Limpio, sin "oops", "fix typo", etc.

---

## 📋 Checklist Pre-Merge (Pull Request)

Antes de mergear a `main`, validar:

```
Código
  ✓ Todos los archivos compilados sin errores
  ✓ ESLint / Prettier sin warnings
  ✓ Tests pasando (coverage >= mínimo)
  ✓ Cero `any` en TypeScript
  ✓ Funciones puras / inmutables

BRIEFING
  ✓ Cambios alineados con BRIEFING.md
  ✓ Nuevas entidades en models.ts
  ✓ Nuevas validaciones en validations.ts
  ✓ Montos/fechas/reglas respetadas
  
Documentación
  ✓ Código comentado en español (cuando necesario)
  ✓ JSDoc en funciones públicas
  ✓ README.md actualizado (si aplica)
  ✓ memory-bank/progress.md con cambios de M4+

Git
  ✓ Commits semánticos y atómicos
  ✓ Mensaje con co-author
  ✓ Rama desde main (sin divergencia)
  ✓ Sin conflictos

PR
  ✓ Título clear (type(scope): desc)
  ✓ Descripción explícita
  ✓ Cierra issues con "Closes #XXX"
  ✓ Mínimo 1 aprobación
```

---

## 🎓 Ejemplos de Flujo Correcto

### Ejemplo 1: Agregar Función de Búsqueda (M2)

```bash
# 1. Crear rama
git switch -c feat/milestone-2-search-binary

# 2. Escribir código en src/utils/search.ts
# - Función pura, tipada, sin `any`
# - Casos de test para array vacío, elemento no encontrado, etc.

# 3. Validar pre-commit
npx tsc --noEmit        # ✓ OK
npx eslint src/ --fix   # ✓ OK
npm run test            # ✓ OK

# 4. Revisar BRIEFING
# - ¿búsqueda binaria es especificación M2? SÍ
# - ¿tipos correctos? SÍ

# 5. Commit con co-author
git add .
git commit -m "feat(search): implementar búsqueda binaria

Implementa búsqueda binaria O(log n) para arrays ordenados.
- Precondición: array debe estar ordenado
- Maneja arrays vacíos y elemento no encontrado
- Función genérica reutilizable

Closes #15

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# 6. Push y crear PR
git push -u origin feat/milestone-2-search-binary
# Crear PR en GitHub
```

### Ejemplo 2: Cambiar Estructura de Formulario (M3)

```bash
# 1. Crear rama
git switch -c feat/milestone-3-candidate-form

# 2. Escribir cambios
# - Cambiar CandidateForm.tsx
# - Actualizar tipos en types/candidate.ts
# - Agregar validación en lib/api.ts

# 3. Validar pre-commit
npx tsc --noEmit        # ✓ OK
npx prettier --write .  # ✓ Formateado
npm run test            # ✓ OK

# 4. Revisar BRIEFING
# - ¿Nuevos campos en candidato? Verificar models.ts
# - ¿Validaciones? Estar en validations.ts o en componente?

# 5. Commit
git commit -m "feat(form): mejorar validación de formulario de candidato

- Agregar validación de email en cliente
- Mejorar UX con inline feedback
- Tipos sincronizados con API

Closes #42

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## 🛠️ Troubleshooting

### "ESLint error: `any` type found"
**Solución**: Reemplazar con tipo específico o `unknown` + type guard

### "TypeScript error: Argument of type 'X' is not assignable to parameter of type 'Y'"
**Solución**: Revisar tipos en models.ts, asegurar coincidencia exacta

### "Test failing: Expected undefined, received null"
**Solución**: Validar null-safety en funciones, usar strict comparisons

### "BRIEFING dice X, pero código hace Y"
**Solución**: Prioritize BRIEFING. Cambiar código o escalar si BRIEFING está desactualizado

---

## 📞 Escalación

| Problema | Contacto | Acción |
|----------|----------|--------|
| Duda sobre BRIEFING | Product Manager | Revisar `memory-bank/projectbrief.md` |
| No claro estándar de código | Tech Lead | Revisar `.agents/rules/git-workflow.md` |
| Bloqueo en zona restringida | Dev Lead | Crear issue de discusión |
| Bug crítico | Ops | Crear issue con `critical` label |

---

## 📊 Métricas de Gobernanza

**Se recopilan automáticamente**:
- Tiempo promedio pre-commit validation: < 3 min
- Commits con co-author: 100%
- PRs con descripción: 100%
- Compilación exitosa: 100%
- Tests pasando: 100%

---

## 🚀 Próximas Mejoras (Futuro)

- [ ] Automatizar PASO A/B/C en pre-commit hook (husky + lint-staged)
- [ ] Validación automática de BRIEFING en CI/CD
- [ ] Dashboard de métricas de gobernanza
- [ ] Template de SKILL automático

---

**Este protocolo es VIVO y FLEXIBLE. Cambios documentados en memory-bank/progress.md.**

**Versión**: 1.0.0  
**Última actualización**: 21 de noviembre de 2026  
**Responsable**: HealthCore Engineering Team
