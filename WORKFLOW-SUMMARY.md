# Resumen de Flujo de Trabajo - Traducciones

## 🎯 Tu Flujo de Trabajo Diario

### Después de Editar Contenido en Inglés:

1. **Verifica qué necesita traducción**:
   ```bash
   pnpm translation-quick
   ```

2. **Si hay archivos que traducir**, copia el mensaje generado y pégalo en Claude Code

3. **Claude traducirá automáticamente** todos los archivos identificados

4. **Verifica que todo funcione**:
   ```bash
   pnpm build-check
   ```

¡Eso es todo! 🎉

## 📋 Comandos Disponibles

- `pnpm translation-quick` - Reporte rápido para Claude Code
- `pnpm check-translations` - Reporte detallado completo  
- `pnpm build-check` - Verificar que el build funciona

## 🔄 Flujo Completo Ejemplo

```bash
# 1. Después de editar docs en inglés
pnpm translation-quick

# 2. Si aparecen archivos pendientes, ve a Claude Code y di:
# "Detecté archivos que necesitan traducción: [copiar lista del output]"

# 3. Claude hace las traducciones automáticamente

# 4. Verificar
pnpm build-check

# ✅ ¡Listo!
```

## 🎯 Lo Que Hace Claude Automáticamente

Cuando le pidas traducir archivos, Claude:

- ✅ Lee cada archivo en inglés
- ✅ Crea/actualiza las traducciones en español
- ✅ Mantiene todos los componentes React
- ✅ Preserva la estructura MDX y tablas
- ✅ Conserva las referencias de video
- ✅ Usa terminología técnica consistente
- ✅ Verifica el build al final

## 📂 Sistema de Archivos

```
docs/                           # Contenido en inglés (tú editas aquí)
├── workouts/
├── exercises/ 
└── ...

i18n/es/docusaurus-plugin-content-docs/current/  # Traducciones (Claude gestiona)
├── workouts/
├── exercises/
└── ...

scripts/                        # Scripts de verificación
├── check-translations.js      # Reporte detallado
└── quick-translation-check.js # Reporte rápido
```

## 🚨 Si Algo Sale Mal

- **Build falla**: Claude puede arreglar errores MDX automáticamente
- **Traducciones inconsistentes**: Menciona la terminología en TRANSLATION-GUIDE.md
- **Archivos no detectados**: Verifica que estén en `docs/` y sean `.md` o `.mdx`

---

**Resultado**: Mantenimiento de traducciones completamente automatizado con un comando simple. 🚀