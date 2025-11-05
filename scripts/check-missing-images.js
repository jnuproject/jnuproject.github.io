const affiliates = require('../data/affiliates.json');

const noImage = affiliates.filter(a => !a.image || a.image === 'https://placehold.co/200x200');

console.log(`이미지 없는 업체 (${noImage.length}개):\n`);

// 카테고리별로 그룹화
const byCategory = {};
noImage.forEach(a => {
  if (!byCategory[a.category]) {
    byCategory[a.category] = [];
  }
  byCategory[a.category].push(a.name);
});

// 출력
Object.keys(byCategory).sort().forEach(category => {
  console.log(`\n[${category}]`);
  byCategory[category].forEach(name => {
    console.log(`  - ${name}`);
  });
});

console.log(`\n\n총계: ${noImage.length}개`);
