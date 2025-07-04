# Integración de Captura de Email con ConvertKit

Este documento explica cómo el sistema de captura de email de ConvertKit está integrado en el sitio web de Tennis Workout.

## Configuración

### Variables de Entorno

Agrega lo siguiente a tu archivo `.env`:

```bash
# Configuración API ConvertKit
NEXT_PUBLIC_CONVERTKIT_API_KEY=tu_convertkit_api_key_aqui
NEXT_PUBLIC_CONVERTKIT_FORM_ID=tu_convertkit_form_id_aqui

# Opcional: ConvertKit API Secret (para operaciones del lado del servidor)
CONVERTKIT_API_SECRET=tu_convertkit_api_secret_aqui
```

### Obtener tus Credenciales de ConvertKit

1. Inicia sesión en tu cuenta de ConvertKit
2. Ve a Settings → Advanced → API
3. Copia tu API Key
4. Ve a Forms → Selecciona tu formulario → Settings
5. Copia el Form ID desde la URL o página de configuración

## Componentes

### EmailCaptureForm

El componente principal del formulario con validación, cumplimiento GDPR y seguimiento de analíticas.

```jsx
import { EmailCaptureForm } from "@site/src/components/EmailCapture";

// Uso básico
<EmailCaptureForm source="homepage-hero" variant="hero" />;

// Variantes disponibles
// - 'hero': Formulario grande para secciones hero
// - 'inline': Formulario estándar en línea
// - 'popup': Optimizado para visualización popup
// - 'footer': Versión compacta para footer
```

### EmailCapturePopup

Popup temporizado que aparece después de 3 minutos en la página.

```jsx
import { EmailCapturePopup } from "@site/src/components/EmailCapture";

// Agregar a tu layout
<EmailCapturePopup />;
```

### EmailCaptureBar

Barra de footer que se desliza hacia arriba después de 5 segundos.

```jsx
import { EmailCaptureBar } from "@site/src/components/EmailCapture";

// Agregar a tu layout
<EmailCaptureBar />;
```

## Características

### Validación de Formulario

- Validación de formato de email
- Validación de campos requeridos
- Checkbox de consentimiento GDPR
- Estados de carga
- Mensajes de éxito/error

### Seguimiento de Analíticas

- Seguimiento de eventos de Google Analytics
- Seguimiento de conversiones por fuente
- Seguimiento de interacciones popup/barra
- Análisis de efectividad por ubicación

### Experiencia de Usuario

- Estado de éxito persistente (localStorage)
- Período de enfriamiento de 24 horas para popups
- Barra de footer desechable
- Diseño responsivo
- Soporte de internacionalización

## Pruebas

Ejecuta el script de prueba para verificar tu integración de ConvertKit:

```bash
node scripts/test-convertkit.js
```

Esto:

1. Verificará las variables de entorno requeridas
2. Probará la conexión API
3. Creará una suscripción de prueba
4. Reportará cualquier error

## Etiquetas y Campos

Todas las suscripciones incluyen:

### Etiquetas

- `tennis-workout` (siempre agregada)
- Etiqueta específica de fuente (ej. `homepage-hero`, `footer-bar`)

### Campos Personalizados

- `gdpr_consent`: 'yes' o 'no'
- `signup_source`: Identificador de ubicación
- `signup_date`: Timestamp ISO
- `language`: Preferencia de idioma del usuario

## Manejo de Errores

La integración incluye manejo integral de errores:

1. **Configuración Faltante**: Error claro si las API keys no están configuradas
2. **Errores de Red**: Respaldo elegante con mensajes amigables al usuario
3. **Errores de API**: Mensajes de error específicos de ConvertKit
4. **Logging de Consola**: Errores detallados registrados para depuración

## Privacidad y Cumplimiento

- Checkbox de consentimiento GDPR requerido
- Enlace a política de privacidad en texto de consentimiento
- Datos de usuario almacenados solo con consentimiento explícito
- Información de cancelación de suscripción en texto del formulario

## Mejores Prácticas

1. **Siempre prueba** con el script de prueba después de la configuración
2. **Monitorea conversiones** en el dashboard de ConvertKit
3. **Prueba A/B** diferentes ubicaciones de formularios y textos
4. **Mantén formularios simples** - solo email y consentimiento
5. **Usa variantes apropiadas** para diferentes secciones de página

## Resolución de Problemas

### El formulario no se envía

1. Verifica errores en la consola del navegador
2. Verifica las API keys en el archivo .env
3. Asegúrate de que el formulario de ConvertKit esté activo
4. Revisa la pestaña de red para respuesta de API

### Tasas de conversión bajas

1. Revisa la ubicación del formulario
2. Prueba diferentes textos
3. Ajusta el tiempo del popup
4. Considera ofrecer un incentivo

### Errores de API

1. Verifica que la API key tenga permisos correctos
2. Confirma que el form ID coincida con formulario activo
3. Asegúrate de que el formulario acepte envíos de API
4. Revisa los límites de API de ConvertKit
