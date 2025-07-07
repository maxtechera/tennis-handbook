# ConvertKit Email Template - PDF Delivery

## 📧 Subject Lines (A/B Test)
- **Option A**: 🎾 Tu entrenamiento elite te está esperando (PDF incluido)
- **Option B**: ⚡ Descarga tu rutina de 7 días - Métodos de campeones
- **Option C**: 🏆 ¡Bienvenido! Tu PDF está listo para descargar

## 📝 Email Template (Spanish)

```html
¡Hola [FIRST_NAME]!

🎾 **¡Bienvenido al entrenamiento de élite!**

Gracias por unirte a nuestra comunidad. Como prometimos, aquí tienes tu rutina gratuita de 7 días con los métodos exactos que usan los mejores jugadores del mundo.

**👇 DESCARGA TU PDF AHORA:**

[🔥 DESCARGAR: Rutina Elite de 7 Días](https://tennis-handbook.vercel.app/downloads/7-day-elite-tennis-workout-spanish.pdf)

**🏆 Lo que encontrarás dentro:**
✅ Rutinas de medallistas olímpicos  
✅ Métodos de entrenadores del ATP Tour  
✅ Ejercicios específicos para tenis  
✅ Plan progresivo de 7 días  
✅ Técnicas de Ferrero, Panichi y más  

**📱 Próximos pasos:**
1. Descarga y guarda tu PDF
2. Empieza con el Día 1 mañana
3. Revisa tu email - te enviaremos consejos exclusivos cada semana

¿Tienes WhatsApp? Responde con tu número y te enviaremos updates directos.

**¡A entrenar como los campeones!**

Equipo Elite Tennis Training  
P.D: Guarda este email - tu PDF estará siempre disponible aquí.

---
*¿No quieres más emails? [Cancelar suscripción]({{ unsubscribe_url }})*
```

## 📝 Email Template (English)

```html
Hi [FIRST_NAME]!

🎾 **Welcome to elite training!**

Thanks for joining our community. As promised, here's your free 7-day routine with the exact methods used by the world's best players.

**👇 DOWNLOAD YOUR PDF NOW:**

[🔥 DOWNLOAD: 7-Day Elite Routine](https://tennis-handbook.vercel.app/downloads/7-day-elite-tennis-workout.pdf)

**🏆 What you'll find inside:**
✅ Olympic medalist routines  
✅ ATP Tour coach methods  
✅ Tennis-specific exercises  
✅ Progressive 7-day plan  
✅ Ferrero, Panichi techniques & more  

**📱 Next steps:**
1. Download and save your PDF
2. Start with Day 1 tomorrow
3. Check your email - we'll send exclusive tips weekly

Got WhatsApp? Reply with your number for direct updates.

**Train like the champions!**

Elite Tennis Training Team  
P.S: Save this email - your PDF will always be available here.

---
*Don't want more emails? [Unsubscribe]({{ unsubscribe_url }})*
```

## ⚙️ ConvertKit Setup Instructions

1. **Create Email Sequence:**
   - Go to ConvertKit → Automate → Sequences
   - Create "Tennis PDF Delivery - Spanish"
   - Create "Tennis PDF Delivery - English"

2. **Trigger Setup:**
   - Trigger: When subscriber is added to form
   - Wait: 0 minutes (immediate delivery)
   - Send: PDF delivery email

3. **Form Configuration:**
   - Link forms to respective email sequences
   - Spanish form → Spanish sequence
   - English form → English sequence

4. **PDF Hosting:**
   - Upload PDFs to: `/public/downloads/`
   - Spanish: `7-day-elite-tennis-workout-spanish.pdf`
   - English: `7-day-elite-tennis-workout.pdf`