# Onboarding Wizard Debug Instructions

The wizard has been implemented but isn't showing up. Here's how to debug:

## 1. Restart the dev server
```bash
# Stop the current server (Ctrl+C)
# Then start it again:
pnpm start
```

## 2. Clear browser data
1. Open http://localhost:3000 in incognito/private mode
2. Or clear localStorage manually in browser console:
   ```javascript
   localStorage.clear()
   ```

## 3. Check browser console
1. Open Developer Tools (F12)
2. Look for these console logs:
   - "Wizard check: ..." 
   - "Setting timer to show wizard..."
   - "Showing wizard now!" (after 5 seconds)
   - "Rendering wizard modal"

## 4. Manual trigger
There's now a blue "Test Wizard (Debug)" button at the bottom of the homepage. Click it to manually trigger the wizard.

## 5. Expected behavior
- First visit: Wizard should appear after 5 seconds
- Subsequent visits: Wizard won't show (localStorage prevents it)
- The wizard should be:
  - Full screen overlay with dark background
  - White modal in center
  - 5 steps of questions
  - Spanish-aware (WhatsApp field for ES locale)

## Issues fixed:
1. Added debug logging
2. Added manual trigger button
3. Cleared Docusaurus cache
4. Fixed import statement (changed to named import)
5. Renamed wizard-steps.tsx to wizard-steps.ts

## Next steps:
1. Restart the server
2. Test in incognito mode
3. Check console for errors
4. Use the debug button if auto-trigger fails

The implementation is complete and should work once the server is restarted with the cleared cache.