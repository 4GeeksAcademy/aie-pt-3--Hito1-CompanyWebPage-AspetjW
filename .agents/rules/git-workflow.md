# 📋 Regla de Desarrollo: Git Workflow para HealthCore

## 🎯 Ámbito de Aplicación
- **Proyecto**: HealthCore (Monorepo)
- **Aplica a**: Todos los commits en ramas feature
- **Versión**: 1.0.0
- **Efectiva desde**: 21 de noviembre de 2026

---

## 📌 Contexto Empresarial
HealthCore es un sistema de gestión de reclamaciones médicas con datos financieros y clínicos sensibles. Los estándares Git aseguran:
- **Trazabilidad**: Auditoría de cambios críticos
- **Calidad**: Validación antes de integración
- **Colaboración**: Historia legible y coherente

---

## 🏢 Ramas Permitidas

### 1. **main** (Protegida)
- Código producción-ready
- Solo recibe merges vía PR
- Siempre compilable y con tests pasando
- Tags de versión: `v{major}.{minor}.{patch}`

### 2. **feature branches** (Efímeras)
```
feat/milestone-X-{nombre}
```
- **Convención**: `feat/milestone-2-search-binary`
- Viven máximo 2 semanas
- Se eliminan tras merge a main
- Creadas desde main (nunca desde otra feature)

### 3. **fix branches** (Efímeras)
```
fix/{nombre-corto}
```
- Para hotfixes críticos
- Creadas desde main
- Mergeadas rápidamente

### 4. **docs branches** (Efímeras)
```
docs/{nombre-corto}
```
- Cambios exclusivamente de documentación
- No requieren compilación TypeScript
- Pueden mergearse sin PR (si es trivial)

---

## ✍️ Formato de Commits (Semantic Commit Convention)

### Estructura Obligatoria
```
type(scope): descripción breve (< 50 caracteres)

Descripción detallada (opcional).
Pueden ser varias líneas si es necesario.

BREAKING CHANGE: descripción si modifica API pública

Closes #numero_issue

Co-authored-by: Nombre <email@example.com>
```

### Tipos Válidos

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat` | Nueva funcionalidad | `feat(validations): agregar validador de NPI` |
| `fix` | Corrección de bug | `fix(search): corregir búsqueda binaria con arrays negativos` |
| `docs` | Documentación | `docs(readme): actualizar instrucciones de setup` |
| `style` | Formato, indentación (sin lógica) | `style: aplicar prettier` |
| `refactor` | Reorganización sin cambio funcional | `refactor(collections): renombrar parámetros` |
| `test` | Cambios en tests | `test(validations): agregar casos de paciente sin email` |
| `chore` | Dependencias, config | `chore: actualizar TypeScript a 5.3.3` |

### Scope (Área Afectada)

**Para M2 (Utilidades)**:
- `search` → `src/utils/search.ts`
- `collections` → `src/utils/collections.ts`
- `transformations` → `src/utils/transformations.ts`
- `validations` → `src/utils/validations.ts`
- `types` → `src/types/models.ts`

**Para M3 (Talent Pipeline)**:
- `form` → Componentes de formulario
- `table` → Tabla de candidatos
- `api` → `lib/api.ts`
- `types` → `types/candidate.ts`
- `page` → Rutas principales

**Para M4+ (Agents)**:
- `agents` → Protocolo AGENTS.md
- `memory-bank` → Contexto en memory-bank/
- `rules` → `.agents/rules/`

### Descripción Breve
- **Imperativa**: "agregar", no "agregué" o "agregado"
- **Concisa**: < 50 caracteres
- **Sin punto final**
- **En inglés**: NO, en español obligatorio

### Co-author (Obligatorio si colaborativo)
```
Co-authored-by: Nombre Completo <email@example.com>
```

**Ejemplo**: `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

---

## 📦 Commits Atómicos (Responsabilidad Única)

**PROHIBIDO**: 1 commit con múltiples cambios lógicos independientes

**CORRECTO**: 1 commit = 1 cambio lógico

```bash
# ❌ MAL: Demasiados cambios
git commit -m "feat: agregar búsqueda y mejorar validación

- Implementar buscarBinaria()
- Corregir validarPaciente()
- Actualizar tipos
- Limpiar comentarios"

# ✅ BIEN: Commits separados
git commit -m "feat(search): implementar búsqueda binaria
# ...

git commit -m "fix(validations): corregir lógica de paciente
# ...

git commit -m "refactor(types): renombrar campos de Reclamacion
# ...
```

---

## 🔀 Integración: Push, Pull Request, Merge

### Paso 1: Push a Rama Feature
```bash
git push -u origin feat/milestone-2-search-binary
```

**Resultado**: Rama visible en GitHub, lista para PR

### Paso 2: Crear Pull Request
**Título**: `feat(search): implementar búsqueda binaria`  
**Descripción**:
```markdown
## Descripción
Implementa función de búsqueda binaria O(log n) para arrays ordenados.

## Cambios
- Función buscarBinaria() en src/utils/search.ts
- Tests en src/utils/search.spec.ts
- Documentación en JSDoc

## Validación Pre-Commit ✓
- [x] TypeScript: sin errores
- [x] ESLint: sin warnings
- [x] Tests: 100% pasan
- [x] Coverage: > 80%
- [x] BRIEFING: Respetado

## Closes
Closes #15
```

### Paso 3: Revisión
- **Mínimo 1 aprobación** antes de merge
- Revisor verifica: código, tipos, tests, documentación
- Cambios solicitados: desarrollador updatea

### Paso 4: Merge a main
```bash
# Opción recomendada: Squash + Fast Forward
git switch main
git pull origin main
git merge --squash origin/feat/milestone-2-search-binary
git commit -m "feat(search): implementar búsqueda binaria

Implementa función de búsqueda binaria O(log n) para arrays ordenados.
- Precondición: array debe estar ordenado
- Maneja arrays vacíos y elemento no encontrado
- Función genérica reutilizable

Closes #15

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

git push origin main
```

**Resultado**: 1 commit limpio en main, rama feature se elimina

---

## 🏷️ Versionado (Tags)

Tras cada milestone o release:
```bash
git tag -a v2.0.0-M4 -m "Milestone 4: AI-driven Engineering"
git push origin v2.0.0-M4
```

**Formato**: `v{major}.{minor}.{patch}-{milestone}`  
**Ejemplo**: `v2.0.0-M4`, `v2.0.1`, `v3.1.0-M5`

---

## ✅ Validaciones Automáticas en CI/CD

GitHub Actions valida **automáticamente** en cada push:

```yaml
✓ TypeScript compilation (tsc --noEmit)
✓ ESLint (eslint src/ uis/)
✓ Jest tests (npm run test)
✓ Coverage > mínimo requerido
✓ Builds exitosos
```

**Si alguna falla**: PR bloqueado hasta arreglar

---

## ⚠️ Reglas Estrictas (No Excepciones)

| Regla | Por Qué | Consecuencia |
|-------|--------|-------------|
| Commits atómicos | Historia legible | PR rechazado |
| Co-author para colabs | Auditoría correcta | PR rechazado |
| `type(scope):` obligatorio | Parsing automático | Commit bloqueado (pre-hook) |
| Sin `any` en TypeScript | Calidad código | CI/CD rechaza |
| Tests pasando | Confianza | PR rechazado |
| BRIEFING respetado | Integridad datos | Escalación a PM |

---

## 📋 Checklist Pre-Push

Antes de `git push`, validar:

```
Código
  ✓ Compilación: npx tsc --noEmit → salida: 0
  ✓ Linting: npx eslint . → 0 errors
  ✓ Formato: npx prettier --check . → 0 issues
  ✓ Tests: npm run test → ✓ passed
  
Git
  ✓ Commits atómicos (1 lógica por commit)
  ✓ Mensajes con type(scope): descripción
  ✓ Co-author si aplica
  ✓ Rama desde main (no divergida)

Briefing
  ✓ Tipos en models.ts
  ✓ Validaciones en validations.ts
  ✓ Montos/fechas/reglas correctas
  
Documentación
  ✓ JSDoc en funciones públicas
  ✓ Comentarios en español
  ✓ README.md actualizado
```

**Bloqueo automático si falla: ESLint, TypeScript, Tests**

---

## 🚫 Prohibiciones Absoluta

1. **Merge directo a main**: Siempre vía PR
2. **Force push** (`--force`): Nunca sin autorización
3. **Commits "oops", "fix typo"**: Rebase y squash
4. **Merge commits en main**: Usar squash + rebase
5. **Ramas sin limpieza**: Eliminar tras merge
6. **Cambios a BRIEFING.md**: Usar `memory-bank/projectbrief.md`
7. **Dependencies sin pkg.json update**: Coordinar con tech lead

---

## 🎓 Ejemplos Paso a Paso

### Ejemplo: Agregar Función de Validación (M2)

```bash
# 1. Crear rama desde main limpio
git switch main
git pull origin main
git switch -c feat/milestone-2-email-validator

# 2. Escribir código (src/utils/validations.ts)
# - Nueva función: validarEmail()
# - Tests en .spec.ts
# - JSDoc documentado

# 3. Validar pre-push
npx tsc --noEmit        # ✓ OK
npx eslint . --fix      # ✓ OK
npm run test            # ✓ OK

# 4. Verificar BRIEFING
# - ¿Email es validación de Paciente? SÍ
# - ¿Patrón regex correcto? Sí, según BRIEFING
# - ¿Tipos de retorno correctos? Sí

# 5. Commit
git add src/utils/validations.ts src/utils/validations.spec.ts
git commit -m "feat(validations): agregar validador de email

Implementa validación de email para Paciente.
- Patrón: ^[^\s@]+@[^\s@]+\.[^\s@]+$
- Maneja casos edge: +, dominio, TLD
- Tests: 5 casos cubiertos

Closes #42

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# 6. Push y crear PR
git push -u origin feat/milestone-2-email-validator

# 7. En GitHub: Crear PR (GitHub te sugiere)
# - Título auto-rellena desde commit
# - Descripción con cambios
# - Cierra issue #42

# 8. Esperar aprobación, luego:
git switch main
git pull origin main
git merge --squash origin/feat/milestone-2-email-validator
git commit   # Editor abre con mensaje sugerido
git push origin main

# 9. Eliminar rama feature
git branch -d feat/milestone-2-email-validator
git push origin --delete feat/milestone-2-email-validator
```

---

## 📞 Escalación

| Problema | Contacto | Proceso |
|----------|----------|---------|
| Bloqueo en CI/CD | Crear issue con `ci` label | Tech Lead revisa en < 2 horas |
| Duda sobre commit message | Ver ejemplos en AGENTS.md | Se auto-resuelve |
| Merge conflict | Rebase y resolver localmente | Revisar docs/git-rebase.md |
| Cambios a BRIEFING | Escalar a PM | Actualizar BRIEFING.md formal |

---

## 🔄 Control de Calidad

**Métricas recopiladas automáticamente** (SonarQube / GitHub):
- Commits atómicos: Avg 1.5 archivos por commit ✓
- Commits con co-author: 100% ✓
- Merge quality: 0 errores después de merge ✓
- Tiempo pre-merge: Avg 4 horas ✓

---

**Este documento es NORMATIVA. Cambios requieren aprobación de Tech Lead.**

**Versión**: 1.0.0  
**Última actualización**: 21 de noviembre de 2026  
**Responsable**: HealthCore Engineering Team
