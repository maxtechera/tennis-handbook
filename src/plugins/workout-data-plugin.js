const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

module.exports = function workoutDataPlugin(context, options) {
  return {
    name: 'workout-data-plugin',
    
    async loadContent() {
      const workoutDataDir = path.join(context.siteDir, 'workout-data');
      const workouts = {};
      
      // Read all week directories
      for (let week = 1; week <= 12; week++) {
        const weekDir = path.join(workoutDataDir, `week-${week}`);
        workouts[`week-${week}`] = {};
        
        try {
          const files = await fs.readdir(weekDir);
          
          for (const file of files) {
            if (file.endsWith('.yml') || file.endsWith('.yaml')) {
              const day = path.basename(file, path.extname(file));
              // Handle both regular and complete versions
              const dayName = day.replace('-complete', '');
              const content = await fs.readFile(path.join(weekDir, file), 'utf8');
              const data = yaml.load(content);
              
              // Use complete version if available
              if (day.includes('-complete') || !workouts[`week-${week}`][dayName]) {
                workouts[`week-${week}`][dayName] = data;
              }
            }
          }
        } catch (error) {
          console.warn(`Week ${week} data not found, skipping...`);
        }
      }
      
      return workouts;
    },
    
    async contentLoaded({ content, actions }) {
      const { setGlobalData, addRoute } = actions;
      
      // Make workout data available globally
      setGlobalData({ workouts: content });
      
      // Create JSON files for runtime loading
      const outputDir = path.join(context.siteDir, 'static/data/workouts');
      
      // Ensure directory exists
      await fs.mkdir(outputDir, { recursive: true });
      
      // Write JSON files for each week/day
      for (const [weekKey, weekData] of Object.entries(content)) {
        const weekNum = weekKey.replace('week-', '');
        const weekDir = path.join(outputDir, `week-${weekNum}`);
        await fs.mkdir(weekDir, { recursive: true });
        
        for (const [day, dayData] of Object.entries(weekData)) {
          await fs.writeFile(
            path.join(weekDir, `${day}.json`),
            JSON.stringify(dayData, null, 2)
          );
        }
      }
      
      console.log('✅ Workout data processed and available at /data/workouts/');
    },
  };
};