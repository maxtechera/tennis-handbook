// Local development storage using JSON files
import fs from 'fs';
import path from 'path';

const DEV_DATA_DIR = path.join(process.cwd(), '.dev-data');

// Ensure data directory exists
if (!fs.existsSync(DEV_DATA_DIR)) {
  fs.mkdirSync(DEV_DATA_DIR, { recursive: true });
}

// Helper to read JSON file
function readJsonFile(filename) {
  const filepath = path.join(DEV_DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

// Helper to write JSON file
function writeJsonFile(filename, data) {
  const filepath = path.join(DEV_DATA_DIR, filename);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Development storage implementation
export const devStorage = {
  // Email captures
  addEmailCapture(email, source, metadata) {
    const captures = readJsonFile('email_captures.json');
    const newCapture = {
      id: Date.now().toString(),
      email,
      source,
      metadata,
      capturedAt: new Date().toISOString()
    };
    captures.push(newCapture);
    writeJsonFile('email_captures.json', captures);
    return newCapture;
  },

  // Wizard submissions
  addWizardSubmission(sessionId, data) {
    const submissions = readJsonFile('wizard_submissions.json');
    const newSubmission = {
      id: Date.now().toString(),
      sessionId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    submissions.push(newSubmission);
    writeJsonFile('wizard_submissions.json', submissions);
    return newSubmission;
  },

  createWizardSubmission(sessionId, data) {
    const submissions = readJsonFile('wizard_submissions.json');
    // Check if already exists
    const existing = submissions.find(s => s.sessionId === sessionId);
    if (existing) {
      return existing;
    }
    
    const newSubmission = {
      id: Date.now().toString(),
      sessionId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    submissions.push(newSubmission);
    writeJsonFile('wizard_submissions.json', submissions);
    return newSubmission;
  },

  updateWizardSubmission(sessionId, data) {
    const submissions = readJsonFile('wizard_submissions.json');
    const index = submissions.findIndex(s => s.sessionId === sessionId);
    
    if (index >= 0) {
      submissions[index] = {
        ...submissions[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Create new if not exists
      submissions.push({
        id: Date.now().toString(),
        sessionId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    writeJsonFile('wizard_submissions.json', submissions);
    return submissions[index] || submissions[submissions.length - 1];
  },

  getWizardSubmission(sessionId) {
    const submissions = readJsonFile('wizard_submissions.json');
    return submissions.find(s => s.sessionId === sessionId);
  },

  // Conversion events
  addConversionEvent(eventType, eventData, sessionId, userId = null) {
    const events = readJsonFile('conversion_events.json');
    const newEvent = {
      id: Date.now().toString(),
      eventType,
      eventData,
      sessionId,
      userId,
      createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    writeJsonFile('conversion_events.json', events);
    return newEvent;
  },

  // Users
  addUser(email, userData) {
    const users = readJsonFile('users.json');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      // Update existing
      Object.assign(existingUser, userData, {
        updatedAt: new Date().toISOString()
      });
      writeJsonFile('users.json', users);
      return existingUser;
    } else {
      // Create new
      const newUser = {
        id: Date.now().toString(),
        email,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(newUser);
      writeJsonFile('users.json', users);
      return newUser;
    }
  },

  getUser(email) {
    const users = readJsonFile('users.json');
    return users.find(u => u.email === email);
  },

  // Analytics
  getAnalytics(days = 7) {
    const events = readJsonFile('conversion_events.json');
    const submissions = readJsonFile('wizard_submissions.json');
    const captures = readJsonFile('email_captures.json');
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentEvents = events.filter(e => new Date(e.createdAt) >= cutoffDate);
    const recentSubmissions = submissions.filter(s => new Date(s.createdAt) >= cutoffDate);
    const recentCaptures = captures.filter(c => new Date(c.capturedAt) >= cutoffDate);
    
    // Calculate funnel stats
    const starts = recentEvents.filter(e => e.eventType === 'wizard_start').length;
    const emails = recentCaptures.length;
    const completes = recentEvents.filter(e => e.eventType === 'wizard_complete').length;
    
    // Segment stats
    const segmentStats = {};
    recentSubmissions.forEach(s => {
      if (s.userSegment) {
        if (!segmentStats[s.userSegment]) {
          segmentStats[s.userSegment] = { total: 0, completed: 0 };
        }
        segmentStats[s.userSegment].total++;
        if (s.completedAt) {
          segmentStats[s.userSegment].completed++;
        }
      }
    });
    
    // Email sources
    const sourceStats = {};
    recentCaptures.forEach(c => {
      sourceStats[c.source] = (sourceStats[c.source] || 0) + 1;
    });
    
    return {
      funnel: { starts, emails, completes, downloads: 0 },
      conversionRates: {
        emailCapture: starts > 0 ? ((emails / starts) * 100).toFixed(1) : '0',
        completion: emails > 0 ? ((completes / emails) * 100).toFixed(1) : '0',
        pdfDownload: '0'
      },
      segmentStats: Object.entries(segmentStats).map(([segment, stats]) => ({
        user_segment: segment,
        ...stats
      })),
      emailSources: Object.entries(sourceStats).map(([source, count]) => ({
        source,
        count
      }))
    };
  },

  // Clear all data (for testing)
  clearAll() {
    const files = ['email_captures.json', 'wizard_submissions.json', 'conversion_events.json', 'users.json'];
    files.forEach(file => {
      const filepath = path.join(DEV_DATA_DIR, file);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    });
    return true;
  }
};