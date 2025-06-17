#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Function to check if file has frontmatter
function hasFrontmatter(content) {
  return content.startsWith("---");
}

// Function to add basic frontmatter
function addFrontmatter(content, position = 1) {
  const frontmatter = `---
sidebar_position: ${position}
---

`;
  return frontmatter + content;
}

// Function to process directory recursively
function processDirectory(dirPath, basePosition = 1) {
  const items = fs.readdirSync(dirPath);
  let position = basePosition;

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Skip node_modules and other system directories
      if (!["node_modules", ".git", "build"].includes(item)) {
        processDirectory(itemPath, 1);
      }
    } else if (item.endsWith(".md")) {
      const content = fs.readFileSync(itemPath, "utf8");

      if (!hasFrontmatter(content)) {
        console.log(`Adding frontmatter to: ${itemPath}`);
        const newContent = addFrontmatter(content, position);
        fs.writeFileSync(itemPath, newContent);
        position++;
      } else {
        console.log(`Frontmatter already exists: ${itemPath}`);
      }
    }
  });
}

// Main execution
const docsPath = path.join(__dirname, "docs");
if (fs.existsSync(docsPath)) {
  console.log("Processing docs directory...");
  processDirectory(docsPath);
  console.log("Frontmatter processing complete!");
} else {
  console.error("Docs directory not found!");
  process.exit(1);
}
