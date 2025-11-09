const fs = require('fs');

// Read the mockData.ts file
const content = fs.readFileSync('./src/data/mockData.ts', 'utf-8');

// Count tools in aiTools array
const aiToolsMatch = content.match(/export const aiTools: AITool\[\] = \[([\s\S]*?)\n\];\n\n\/\/ Additional/);
const aiToolsCount = aiToolsMatch ? (aiToolsMatch[1].match(/{\s*id:/g) || []).length : 0;

// Count tools in moreAITools array
const moreToolsMatch = content.match(/\/\/ Additional real AI tools\nconst moreAITools: AITool\[\] = \[([\s\S]*?)\n\];\n\nexport const allAITools/);
const moreToolsCount = moreToolsMatch ? (moreToolsMatch[1].match(/{\s*id:/g) || []).length : 0;

console.log('\n=== TOOL COUNT BREAKDOWN ===\n');
console.log(`Original aiTools array: ${aiToolsCount} tools`);
console.log(`Additional moreAITools array: ${moreToolsCount} tools`);
console.log(`\nTotal AI Tools: ${aiToolsCount + moreToolsCount} tools`);

// Extract all tool names
const allToolMatches = content.matchAll(/id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g);
const tools = [];
for (const match of allToolMatches) {
  tools.push({ id: match[1], name: match[2] });
}

console.log(`\n=== ALL TOOLS (${tools.length}) ===\n`);
tools.forEach((tool, index) => {
  console.log(`${index + 1}. ${tool.name} (${tool.id})`);
});
