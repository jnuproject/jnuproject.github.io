const fs = require('fs');
const path = require('path');

const affiliates = require('../data/affiliates.json');
const affiliateImages = require('../data/affiliate-images.json');

console.log('Updating affiliates.json with fetched images...\n');

let updatedCount = 0;
let skippedCount = 0;

// affiliates 배열 업데이트
const updatedAffiliates = affiliates.map(affiliate => {
  const imageData = affiliateImages[affiliate.id];

  if (imageData && imageData.images && imageData.images.length > 0) {
    // 첫 번째 이미지를 썸네일로 사용
    console.log(`✓ Updated: ${affiliate.name} (${imageData.images.length} images)`);
    updatedCount++;

    return {
      ...affiliate,
      image: imageData.images[0], // 첫 번째 이미지를 메인 이미지로
      images: imageData.images     // 전체 이미지 배열 추가
    };
  } else {
    console.log(`  Skipped: ${affiliate.name} (no images)`);
    skippedCount++;
    return affiliate;
  }
});

// 파일 저장
const outputPath = path.join(__dirname, '../data/affiliates.json');
fs.writeFileSync(outputPath, JSON.stringify(updatedAffiliates, null, 2), 'utf8');

console.log('\n✅ Done! Updated affiliates.json');
console.log(`\n📊 Statistics:`);
console.log(`   Updated: ${updatedCount}`);
console.log(`   Skipped: ${skippedCount}`);
console.log(`   Total: ${affiliates.length}`);
