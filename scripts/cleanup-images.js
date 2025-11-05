const fs = require('fs');
const path = require('path');

const affiliates = require('../data/affiliates.json');

console.log('Cleaning up affiliates.json - removing images array...\n');

// images 배열 제거하고 image 필드만 유지
const cleanedAffiliates = affiliates.map(affiliate => {
  const { images, ...rest } = affiliate;

  if (images) {
    console.log(`✓ Removed images array from: ${affiliate.name}`);
  }

  return rest;
});

// 파일 저장
const outputPath = path.join(__dirname, '../data/affiliates.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanedAffiliates, null, 2), 'utf8');

console.log('\n✅ Done! Cleaned up affiliates.json');
console.log(`   Total: ${affiliates.length}`);

// affiliate-images.json 삭제
const imagesFilePath = path.join(__dirname, '../data/affiliate-images.json');
if (fs.existsSync(imagesFilePath)) {
  fs.unlinkSync(imagesFilePath);
  console.log('\n🗑️  Deleted affiliate-images.json (no longer needed)');
}
