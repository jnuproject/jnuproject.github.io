const fs = require('fs');
const path = require('path');

// File paths
const files = [
  '/Users/goyehun/myApp/data/affiliates.json',
  '/Users/goyehun/myApp/docs/data/affiliates.json'
];

files.forEach(filePath => {
  console.log(`Processing: ${filePath}`);

  // Read the file
  const data = fs.readFileSync(filePath, 'utf8');

  // Parse JSON
  const affiliates = JSON.parse(data);

  // Convert all id fields from numbers to strings
  const updated = affiliates.map(item => ({
    ...item,
    id: String(item.id)
  }));

  // Write back to file with proper formatting
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');

  console.log(`✓ Converted ${updated.length} id fields to strings in ${filePath}`);
});

console.log('\nAll files updated successfully!');
