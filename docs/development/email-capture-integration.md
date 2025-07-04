# ConvertKit Email Capture Integration

This document explains how the ConvertKit email capture system is integrated into the Tennis Workout website.

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# ConvertKit API Configuration
NEXT_PUBLIC_CONVERTKIT_API_KEY=your_convertkit_api_key_here
NEXT_PUBLIC_CONVERTKIT_FORM_ID=your_convertkit_form_id_here

# Optional: ConvertKit API Secret (for server-side operations)
CONVERTKIT_API_SECRET=your_convertkit_api_secret_here
```

### Getting Your ConvertKit Credentials

1. Log into your ConvertKit account
2. Go to Settings → Advanced → API
3. Copy your API Key
4. Go to Forms → Select your form → Settings
5. Copy the Form ID from the URL or settings page

## Components

### EmailCaptureForm

The main form component with validation, GDPR compliance, and analytics tracking.

```jsx
import { EmailCaptureForm } from '@site/src/components/EmailCapture';

// Basic usage
<EmailCaptureForm 
  source="homepage-hero" 
  variant="hero" 
/>

// Available variants
// - 'hero': Large form for hero sections
// - 'inline': Standard inline form
// - 'popup': Optimized for popup display
// - 'footer': Compact footer version
```

### EmailCapturePopup

Timed popup that appears after 3 minutes on the page.

```jsx
import { EmailCapturePopup } from '@site/src/components/EmailCapture';

// Add to your layout
<EmailCapturePopup />
```

### EmailCaptureBar

Footer bar that slides up after 5 seconds.

```jsx
import { EmailCaptureBar } from '@site/src/components/EmailCapture';

// Add to your layout
<EmailCaptureBar />
```

## Features

### Form Validation
- Email format validation
- Required field validation
- GDPR consent checkbox
- Loading states
- Success/error messages

### Analytics Tracking
- Google Analytics event tracking
- Conversion tracking by source
- Popup/bar interaction tracking

### User Experience
- Persistent success state (localStorage)
- 24-hour cooldown for popups
- Dismissible footer bar
- Responsive design
- Internationalization support

## Testing

Run the test script to verify your ConvertKit integration:

```bash
node scripts/test-convertkit.js
```

This will:
1. Check for required environment variables
2. Test the API connection
3. Create a test subscription
4. Report any errors

## Tags and Fields

All subscriptions include:

### Tags
- `tennis-workout` (always added)
- Source-specific tag (e.g., `homepage-hero`, `footer-bar`)

### Custom Fields
- `gdpr_consent`: 'yes' or 'no'
- `signup_source`: Location identifier
- `signup_date`: ISO timestamp
- `language`: User's language preference

## Error Handling

The integration includes comprehensive error handling:

1. **Missing Configuration**: Clear error if API keys are not set
2. **Network Errors**: Graceful fallback with user-friendly messages
3. **API Errors**: Specific error messages from ConvertKit
4. **Console Logging**: Detailed errors logged for debugging

## Privacy & Compliance

- GDPR consent checkbox required
- Privacy policy link in consent text
- User data stored only with explicit consent
- Unsubscribe information in form text

## Best Practices

1. **Always test** with the test script after configuration
2. **Monitor conversions** in ConvertKit dashboard
3. **A/B test** different form placements and copy
4. **Keep forms simple** - email and consent only
5. **Use appropriate variants** for different page sections

## Troubleshooting

### Form not submitting
1. Check browser console for errors
2. Verify API keys in .env file
3. Ensure ConvertKit form is active
4. Check network tab for API response

### Low conversion rates
1. Review form placement
2. Test different copy
3. Adjust popup timing
4. Consider offering incentive

### API errors
1. Verify API key has correct permissions
2. Check form ID matches active form
3. Ensure form accepts API submissions
4. Review ConvertKit API limits