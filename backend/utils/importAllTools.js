// ==================== FULL TOOLS DATA CONVERTER ====================
// This script extracts ALL 3000+ tools from mockData.ts and formats them for MongoDB

/*
INSTRUCTIONS TO CONVERT ALL 3000+ TOOLS:

1. Open: src/data/mockData.ts
2. Copy the ENTIRE aiTools and moreAITools arrays
3. Paste them into a new file: backend/data/allTools.json
4. Format as JSON (remove TypeScript types)
5. Run: node backend/utils/importAllTools.js

QUICK METHOD:
Run this in src/data directory:
```
# Extract just the tools data
grep -A 5000 "export const aiTools" mockData.ts > tools_export.txt
```

Then convert TypeScript format to JSON format.
*/

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Tool = require('../models/Tool');
const connectDB = require('../config/database');

const importAllTools = async () => {
  try {
    await connectDB();

    // Check if allTools.json exists
    const jsonPath = path.join(__dirname, '../data/allTools.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.log('❌ allTools.json not found!');
      console.log('\\n📋 FOLLOW THESE STEPS TO IMPORT ALL 3000+ TOOLS:\\n');
      console.log('1. Open: src/data/mockData.ts');
      console.log('2. Copy all tools from aiTools and moreAITools arrays');
      console.log('3. Create: backend/data/allTools.json');
      console.log('4. Paste and format as JSON (remove TypeScript types)');
      console.log('5. Run: npm run import-all');
      console.log('\\n💡 For now, use: npm run seed (imports 10 sample tools)');
      process.exit(1);
    }

    const allTools = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log('🌱 Importing all tools to MongoDB...');
    console.log(`📊 Found ${allTools.length} tools to import`);

    // Clear existing
    await Tool.deleteMany({});
    console.log('🗑️  Cleared existing tools');

    // Import all
    const imported = await Tool.insertMany(allTools);
    console.log(`✅ Successfully imported ${imported.length} tools!`);

    // Stats
    const categories = {};
    imported.forEach(tool => {
      categories[tool.category] = (categories[tool.category] || 0) + 1;
    });

    console.log('\\n📊 Tools by category:');
    Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} tools`);
      });

    process.exit(0);

  } catch (error) {
    console.error('❌ Import error:', error);
    process.exit(1);
  }
};

importAllTools();
