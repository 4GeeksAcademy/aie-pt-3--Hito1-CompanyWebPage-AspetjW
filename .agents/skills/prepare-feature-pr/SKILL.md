# 🛠️ SKILL: Prepare Feature PR

## 📌 Metadatos
- **Nombre**: Prepare Feature PR
- **Versión**: 1.0.0
- **Ámbito**: Desarrollo en HealthCore (M2+)
- **Tipo**: Recurrente / Pre-commit
- **Dueño**: HealthCore Engineering Team

---

## 🎯 Objetivo Único
Validar, formatear y preparar una rama feature para Pull Request a `main`, asegurando que el código cumple con los estándares HealthCore (TypeScript, tests, documentación, BRIEFING).

---

## 📋 Requisitos de Entrada

### Precondiciones (Deben ser True)
- [ ] Rama feature creada desde `main`
- [ ] Código escrito en rama (commits locales no pusheados)
- [ ] Cambios relativos a 1 milestone (M2, M3, M4+)
- [ ] No hay conflictos con `main`

### Datos Requeridos
1. **Rama actual**: `git branch --show-current`
2. **Cambios pendientes**: `git status`
3. **Commits locales**: `git log main..HEAD --oneline`
4. **Archivos modificados**: `git diff --name-only main`

---

## 🔄 Pasos de Ejecución

### PASO 1️⃣: Validar Rama Feature (< 1 minuto)

**Input**: Nombre de rama actual  
**Output**: ✅ Rama válida o ❌ Error

```bash
# Verificar nombre de rama
BRANCH=$(git branch --show-current)
echo "Rama actual: $BRANCH"

# Validar patrón
if [[ ! "$BRANCH" =~ ^feat/milestone-[0-9]- ]]; then
  echo "❌ Error: Rama debe ser 'feat/milestone-X-{nombre}'"
  exit 1
fi

echo "✅ Rama válida: $BRANCH"
```

**Criterios de Aceptación**:
- ✓ Patrón: `feat/milestone-X-{nombre}`
- ✓ No es `main` ni `develop`
- ✓ X es número 2-9
- ✓ {nombre} en kebab-case

---

### PASO 2️⃣: Compilar TypeScript (< 2 minutos)

**Input**: Código TypeScript sin compilar  
**Output**: ✅ Compilación exitosa o ❌ Errores

```bash
# Compilar sin emitir archivos
npx tsc --noEmit

# Capturar resultado
if [ $? -ne 0 ]; then
  echo "❌ Error: TypeScript compilation failed"
  exit 1
fi

echo "✅ TypeScript compilation successful (0 errors)"
```

**Criterios de Aceptación**:
- ✓ Exit code = 0
- ✓ Cero errores de tipo
- ✓ Cero warnings en strict mode
- ✓ Ningún `any` sin @ts-ignore

**Fallo típico**:
```
error TS2322: Type 'string | null' is not assignable to type 'string'.
  Consider using optional chaining (?.).
```
→ Solución: Validar null con type guard o operador `??`

---

### PASO 3️⃣: Lint y Formatear (< 1 minuto)

**Input**: Código sin formato  
**Output**: ✅ Código formateado o ❌ Errores no resolubles

```bash
# Lint automático (fix where possible)
npx eslint src/ uis/ --fix

# Formatear con Prettier
npx prettier --write "src/**/*.ts" "uis/**/*.{ts,tsx}"

# Verificar que no quedan issues
npx eslint src/ uis/

if [ $? -ne 0 ]; then
  echo "❌ Error: ESLint issues remaining (manual fix needed)"
  exit 1
fi

echo "✅ Lint and format successful"
```

**Criterios de Aceptación**:
- ✓ ESLint: 0 errors, 0 warnings
- ✓ Prettier: Formato uniforme
- ✓ Indentación: 2 espacios
- ✓ Línea máxima: 100 caracteres

**Fallo típico**:
```
error  'any' type usage found  @typescript-eslint/no-explicit-any
```
→ Solución: Cambiar a tipo específico o `unknown`

---

### PASO 4️⃣: Ejecutar Tests (< 3 minutos)

**Input**: Suite de tests  
**Output**: ✅ Tests pasan o ❌ Fallos en tests

```bash
# Ejecutar tests
npm run test

# Capturar resultado
if [ $? -ne 0 ]; then
  echo "❌ Error: Tests failed"
  exit 1
fi

# Verificar coverage
npm run test:coverage

# Minimum requerido
# M2: >= 80%
# M3: >= 60%

echo "✅ All tests passed"
```

**Criterios de Aceptación**:
- ✓ Todos los tests pasan (exit code 0)
- ✓ Coverage >= mínimo (80% M2, 60% M3)
- ✓ Ningún test skipped (pending)
- ✓ Cero timeout errors

**Fallo típico**:
```
FAIL  src/utils/search.spec.ts
● buscarBinaria › should find element in middle
  expect(found).toBe(true)
```
→ Solución: Revisar lógica de función, agregar test case

---

### PASO 5️⃣: Validar BRIEFING (< 2 minutos)

**Input**: BRIEFING.md + código modificado  
**Output**: ✅ Respeta BRIEFING o ⚠️ Cambios en dominio

```bash
# Verificar archivos modificados
MODIFIED=$(git diff --name-only main)

echo "📋 Validating changes against BRIEFING.md..."

# Checklist automático
if echo "$MODIFIED" | grep -q "models.ts"; then
  echo "⚠️ Cambio en models.ts (entidades)"
  echo "   → Verificar que tipos coincidan con BRIEFING"
fi

if echo "$MODIFIED" | grep -q "validations.ts"; then
  echo "⚠️ Cambio en validations.ts (reglas)"
  echo "   → Verificar que reglas coincidan con BRIEFING"
fi

if echo "$MODIFIED" | grep -q "BRIEFING.md"; then
  echo "🔴 NO modificar BRIEFING.md directamente"
  echo "   → Usar memory-bank/projectbrief.md en su lugar"
  exit 1
fi

echo "✅ BRIEFING validation passed"
```

**Criterios de Aceptación**:
- ✓ Si cambios en `models.ts`: Tipos = BRIEFING
- ✓ Si cambios en `validations.ts`: Reglas = BRIEFING
- ✓ Si cambios en `transformations.ts`: Reportes = BRIEFING
- ✓ Montos financieros: tolerancia ±$0.01
- ✓ Fechas: orden lógico (service < envío < actualización)
- ✓ Enums: exactamente como en BRIEFING
- ✓ NO modificar archivos restringidos

**Fallo típico**:
```
Código: estado: "NUEVO" | "PROCESANDO"
BRIEFING: estado: "ENVIADA" | "EN_REVISION" | ...
```
→ Solución: Cambiar código para coincidir con BRIEFING

---

### PASO 6️⃣: Preparar Mensaje de Commit (< 1 minuto)

**Input**: Cambios listos en staging  
**Output**: ✅ Commits atómicos con mensajes correctos

```bash
# Ver commits pendientes
echo "📝 Commits to be pushed:"
git log main..HEAD --oneline

# Validar que cada commit tenga:
# - type(scope): mensaje
# - Co-author (si aplica)
# - Cierre de issue (Closes #XXX)

# TEMPLATE esperado:
# feat(scope): descripción breve
# 
# Descripción detallada (opcional)
# 
# Closes #123
# 
# Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>

git log main..HEAD --format="%B" | head -20
# Revisar manualmente que formato sea correcto

echo "✅ Commit messages validated"
```

**Criterios de Aceptación**:
- ✓ Cada commit tiene `type(scope):`
- ✓ Tipos válidos: feat, fix, docs, refactor, test, chore
- ✓ Scope coincide con archivo/módulo
- ✓ Si múltiples cambios: commits separados (atómicos)
- ✓ Co-author presente si es colaborativo
- ✓ Referencias a issues: `Closes #XXX`

**Fallo típico**:
```
wip: cambios varios
```
→ Solución: Rebase interactivo, reescribir mensajes

---

### PASO 7️⃣: Pre-flight Checklist (< 1 minuto)

**Input**: Todos los pasos anteriores completados  
**Output**: ✅ Listo para PR o ❌ Bloqueo

```bash
# Resumen final
echo "
🚀 PRE-FLIGHT CHECKLIST
========================

Rama:              $BRANCH
Cambios:           $(git log main..HEAD --oneline | wc -l) commits
Archivos:          $(git diff --name-only main | wc -l)

✅ TypeScript:     OK (tsc --noEmit)
✅ ESLint:         OK (eslint src/ uis/)
✅ Tests:          OK (jest --coverage)
✅ BRIEFING:       OK (manual review)
✅ Commits:        OK (type(scope): format)

========================
Estado: 🟢 LISTO PARA PR
========================

Próximo paso:
  git push -u origin $BRANCH
  
  Luego crear PR en GitHub:
  - Título: type(scope): descripción
  - Descripción: qué, por qué, cambios, cierre
  - Closes: #XXX
"
```

**Criterios de Aceptación**:
- ✓ Todos los pasos previos: ✅
- ✓ Cero bloqueos
- ✓ Listo para `git push`

---

## ⚠️ Criterios de Aceptación (Globales)

| Criterio | Verificación | Estado |
|----------|--------------|--------|
| **Tipado TypeScript** | `tsc --noEmit` → 0 errors | ✅ |
| **Linting ESLint** | `eslint` → 0 errors | ✅ |
| **Tests pasando** | `jest` → 100% pasan | ✅ |
| **Coverage** | Coverage >= 80% (M2) / 60% (M3) | ✅ |
| **Formato Prettier** | Código uniforme, 2 espacios | ✅ |
| **BRIEFING respetado** | Tipos, validaciones, reportes = BRIEFING | ✅ |
| **Commits atómicos** | 1 lógica por commit | ✅ |
| **Commits semánticos** | `type(scope): descripción` | ✅ |
| **Co-author** | Footer si es colaborativo | ✅ |
| **Ramas limpias** | Sin `main`, con `feat/milestone-X` | ✅ |
| **Documentación** | JSDoc, comentarios en español | ✅ |

**Bloqueo de PR si falta CUALQUIERA**

---

## 🚫 Fallos Comunes y Recuperación

| Fallo | Causa | Solución |
|-------|-------|----------|
| `Error TS2322: Type 'X' not assignable to 'Y'` | Tipos incorrectos | Verificar models.ts vs BRIEFING |
| `error 'any' type` | ESLint strict | Usar tipo específico o unknown + guard |
| `FAIL src/utils/x.spec.ts` | Test falla | Revisar lógica de función |
| `Coverage 45% < 80%` | Cobertura baja | Agregar test cases para las ramas no cubiertas |
| `Commit message: wip: change` | Formato incorrecto | Rebase interactivo: `git rebase -i main` |
| `NO modificar BRIEFING.md` | Intentar cambiar BRIEFING directo | Cambiar memory-bank/projectbrief.md en su lugar |

---

## 🔄 Automatización (Futuro)

**Planeado pero no implementado**:
- [ ] Pre-commit hook (husky) que valide PASO 1-3
- [ ] CI/CD automático que valide PASO 1-7
- [ ] Template de commit message automático

---

## 📞 Escalación

| Bloqueo | Contacto | Tiempo |
|---------|----------|--------|
| Duda sobre BRIEFING | Product Manager | 24 horas |
| Bug en validación TypeScript | Tech Lead | 2 horas |
| Issue crítico en main | DevOps | Inmediato |

---

## ✅ Validación Final

**Esta SKILL está lista cuando**:
- [x] Todos los 7 pasos completados
- [x] Criterios de aceptación: ✅
- [x] Pre-flight checklist: 🟢 LISTO
- [x] Sin bloqueos
- [x] Rama lista para `git push`

---

**Versión**: 1.0.0  
**Última actualización**: 21 de noviembre de 2026  
**Próxima revisión**: Después de M4 merge
