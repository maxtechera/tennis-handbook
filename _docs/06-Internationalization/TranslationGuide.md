# Guía de Mantenimiento de Traducciones

Esta guía explica cómo mantener las traducciones al español actualizadas cuando se modifica el contenido en inglés.

## 🚀 Inicio Rápido

### 1. Verificar Estado de Traducciones

```bash
# Ejecutar script de verificación
node scripts/check-translations.js
```

Este comando te mostrará:
- ✅ Archivos actualizados
- ⚠️ Archivos que necesitan actualización  
- ❌ Archivos que faltan traducir

### 2. Traducir/Actualizar Archivo Específico

```bash
# Ver información de un archivo específico
node scripts/translate-file.js workouts/week-1/monday.mdx
```

Este comando te dará instrucciones específicas para Claude Code.

## 🛠️ Flujo de Trabajo Recomendado

### Cuando Modifiques Contenido en Inglés:

1. **Después de editar archivos en inglés**, ejecuta:
   ```bash
   node scripts/check-translations.js
   ```

2. **Revisa el reporte** para identificar archivos que necesitan traducción/actualización

3. **Solicita a Claude Code** que traduzca los archivos identificados:
   ```
   "He modificado contenido en inglés. El script detectó estos archivos que necesitan actualización:
   
   [copiar lista del script]
   
   Por favor traduce/actualiza estos archivos manteniendo todos los componentes React y estructura."
   ```

4. **Claude ejecutará las traducciones** automáticamente

5. **Verifica el build** después de que Claude complete:
   ```bash
   pnpm build
   ```

### Ejemplo de Flujo Completo:

```bash
# 1. Verificar estado
node scripts/check-translations.js

# 2. Si hay archivos desactualizados, por ejemplo workouts/week-5/monday.mdx:
node scripts/translate-file.js workouts/week-5/monday.mdx

# 3. Usar Claude Code con las instrucciones mostradas
# 4. Verificar build
pnpm build

# 5. Repetir para otros archivos si es necesario
```

## 📋 Scripts Disponibles

### `check-translations.js`
- **Propósito**: Verificar el estado completo de todas las traducciones
- **Salida**: Reporte detallado + archivo JSON + comandos sugeridos
- **Uso**: `node scripts/check-translations.js`

### `translate-file.js`
- **Propósito**: Analizar un archivo específico y generar instrucciones para Claude
- **Salida**: Información del archivo + instrucciones para Claude Code
- **Uso**: `node scripts/translate-file.js <ruta-relativa>`

## 🎯 Mejores Prácticas

### Para Mantener Traducciones:

1. **Ejecuta verificación regularmente** (al menos después de cada sesión de edición)

2. **Traduce en lotes pequeños** (5-10 archivos a la vez) para mayor precisión

3. **Verifica siempre el build** después de las traducciones

4. **Mantén consistencia terminológica** usando la misma terminología técnica

### Para Trabajar con Claude Code:

1. **Ejecuta el script de verificación** para ver qué archivos necesitan trabajo

2. **Solicita a Claude Code** que traduzca los archivos identificados

3. **Proporciona contexto claro** a Claude sobre qué archivos traducir:
   ```
   "He detectado que estos archivos necesitan traducción:
   [lista de archivos del script]
   
   Traduce estos archivos manteniendo todos los elementos técnicos"
   ```

4. **Claude debe preservar todos los elementos técnicos**:
   - Componentes React (`<WorkoutNav>`, etc.)
   - Frontmatter (`sidebar_position`, etc.)
   - Tablas de Markdown
   - Referencias de video
   - Enlaces internos

5. **Terminología consistente que Claude debe usar**:
   - "entrenamiento" para "training"
   - "ejercicio" para "exercise"  
   - "sesión" para "session"
   - "semana" para "week"
   - "potencia" para "power"
   - "fuerza" para "strength"

## 🔧 Configuración Avanzada

### Agregar Scripts a package.json

Puedes agregar estos comandos a tu `package.json`:

```json
{
  "scripts": {
    "check-translations": "node scripts/check-translations.js",
    "translate-help": "node scripts/translate-file.js",
    "build-check": "pnpm build && echo '✅ Build exitoso - traducciones válidas'"
  }
}
```

Luego usar:
```bash
pnpm check-translations
pnpm run translate-help workouts/week-1/monday.mdx
pnpm run build-check
```

### Integración con Git Hooks

Para verificar traducciones automáticamente antes de commits:

```bash
# Crear .git/hooks/pre-commit
#!/bin/sh
echo "🔍 Verificando estado de traducciones..."
node scripts/check-translations.js
```

## 📊 Entendiendo los Reportes

### Reporte de Consola
- **✅ Actualizados**: Traducciones al día
- **⚠️ Desactualizados**: Inglés modificado después que español
- **❌ Faltantes**: Archivos sin traducir

### Archivo JSON (`translation-status.json`)
Contiene datos estructurados para integración con otras herramientas:
- Resumen numérico
- Lista detallada de archivos
- Fechas de modificación
- Rutas completas

### Comandos Sugeridos
El script genera comandos listos para usar con Claude Code para actualizar las traducciones necesarias.

## 🚨 Solución de Problemas

### Error de Build MDX
Si el build falla con errores MDX:
1. Verifica que no haya caracteres especiales sin escapar (`<`, `>`, `&`)
2. Revisa la sintaxis de las tablas Markdown
3. Asegúrate que los componentes React estén correctamente escritos

### Fechas Incorrectas
Si las fechas de modificación parecen incorrectas:
1. El script usa Git para fechas más precisas
2. Fallback a fechas del sistema de archivos
3. Considera hacer commit de cambios para mejorar precisión

### Archivos No Detectados
Si un archivo no aparece en el reporte:
1. Verifica que tenga extensión `.md` o `.mdx`
2. Asegúrate que no esté en patrones ignorados
3. Confirma que esté en el directorio `docs/`

## 🔄 Integración Continua

Para proyectos con CI/CD, considera agregar verificación automática:

```yaml
# GitHub Actions ejemplo
- name: Check Translation Status
  run: |
    node scripts/check-translations.js
    # Opcional: fallar si hay traducciones desactualizadas
    # node scripts/check-translations.js --strict
```

Esto te ayudará a mantener las traducciones siempre actualizadas de forma automática.