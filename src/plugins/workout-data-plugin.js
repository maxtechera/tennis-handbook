const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

module.exports = function workoutDataPlugin(context, options) {
  return {
    name: 'workout-data-plugin',
    
    async loadContent() {
      const workoutDataDir = path.join(context.siteDir, 'workout-data');
      const workouts = {};
      
      // Load data for both English and Spanish
      const locales = ['en', 'es'];
      
      for (const locale of locales) {
        workouts[locale] = {};
        
        // Read all week directories
        for (let week = 1; week <= 12; week++) {
          const weekDir = path.join(workoutDataDir, `week-${week}`);
          workouts[locale][`week-${week}`] = {};
          
          try {
            const files = await fs.readdir(weekDir);
            
            for (const file of files) {
              if (file.endsWith('.yml') || file.endsWith('.yaml')) {
                const day = path.basename(file, path.extname(file));
                
                // Handle locale-specific files
                let dayName, fileLocale;
                if (day.includes('.es')) {
                  dayName = day.replace('.es', '').replace('-complete', '');
                  fileLocale = 'es';
                } else {
                  dayName = day.replace('-complete', '');
                  fileLocale = 'en';
                }
                
                // Only load files for the current locale
                if (fileLocale === locale) {
                  const content = await fs.readFile(path.join(weekDir, file), 'utf8');
                  const data = yaml.load(content);
                  
                  // Use complete version if available
                  if (day.includes('-complete') || !workouts[locale][`week-${week}`][dayName]) {
                    workouts[locale][`week-${week}`][dayName] = data;
                  }
                }
              }
            }
          } catch (error) {
            console.warn(`Week ${week} data not found for locale ${locale}, skipping...`);
          }
        }
      }
      
      return workouts;
    },
    
    async contentLoaded({ content, actions }) {
      const { setGlobalData, addRoute } = actions;
      
      // Make workout data available globally
      setGlobalData({ workouts: content });
      
      // Create JSON files for runtime loading (for both locales)
      const outputDir = path.join(context.siteDir, 'static/data/workouts');
      
      // Ensure directory exists
      await fs.mkdir(outputDir, { recursive: true });
      
      // Write JSON files for each locale, week, and day
      for (const [locale, localeData] of Object.entries(content)) {
        const localeDir = path.join(outputDir, locale);
        await fs.mkdir(localeDir, { recursive: true });
        
        for (const [weekKey, weekData] of Object.entries(localeData)) {
          const weekNum = weekKey.replace('week-', '');
          const weekDir = path.join(localeDir, `week-${weekNum}`);
          await fs.mkdir(weekDir, { recursive: true });
          
          for (const [day, dayData] of Object.entries(weekData)) {
            await fs.writeFile(
              path.join(weekDir, `${day}.json`),
              JSON.stringify(dayData, null, 2)
            );
          }
        }
      }
      
      console.log('✅ Workout data processed and available at /data/workouts/ for both locales');
    },
  };
};