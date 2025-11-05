const fs = require('fs');
const path = require('path');

const affiliates = require('../data/affiliates.json');

// 기업제휴 업체 순서 (사용자가 제공한 순서)
const companyOrder = [
  '아이티렛츠고',
  '렛츠커리어',
  '시원스쿨',
  '한국검정평가원',
  '미리캔버스',
  'YBM',
  '다산에듀',
  '잡플레닛',
  '세이프닥',
  'GS안과',
  '중앙병원',
  '롯데시네마',
  '오션월드',
  '젠지 (E-sports)',
  '키움',
  'LG트윈스',
  '아르떼뮤지엄',
  '이월드',
  '제주아쿠아플라넷',
  '포시즌',
  'LG전자',
  'LG U+',
  '삼성스토어',
  '어도비',
  '쏘카',
  '이제주 버스 회사',
  '삼다자동차학원',
  '여기어때',
  '정후문 원룸',
  '유스호스텔',
  '제주환화리조트',
  '이사대학',
  '사람휘트니스',
  '카카오',
  '네이버',
  '칠성로 상인회',
  'VIPS',
  '유동커피'
];

// assets/list_images에 있는 이미지 파일 목록 가져오기
const imagesDir = path.join(__dirname, '../assets/list_images');
const imageFiles = fs.readdirSync(imagesDir)
  .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

console.log(`Found ${imageFiles.length} images in assets/list_images\n`);
console.log('Image files:', imageFiles.map(f => f.replace(/\.(png|jpg|jpeg)$/i, '')).join(', '));
console.log('\nMapping images to companies...\n');

// 업체명으로 affiliate 찾기
const companyAffiliates = companyOrder.map(name => {
  return affiliates.find(a => a.name === name);
}).filter(a => a !== undefined);

console.log(`Found ${companyAffiliates.length} matching companies\n`);

// 이미지 번호를 키로 하는 맵 생성
const imageMap = {};
imageFiles.forEach(file => {
  const num = parseInt(file.match(/\d+/)[0]);
  imageMap[num] = file;
});

console.log('Available image numbers:', Object.keys(imageMap).sort((a, b) => a - b).join(', '));
console.log('\n');

// 이미지 매핑
let mappedCount = 0;
const updatedAffiliates = affiliates.map(affiliate => {
  const companyIndex = companyOrder.indexOf(affiliate.name);

  if (companyIndex !== -1) {
    const imageNum = companyIndex + 1;
    const imageFile = imageMap[imageNum];

    if (imageFile) {
      const imagePath = `require('../assets/list_images/${imageFile}')`;
      console.log(`✓ ${affiliate.name} (${imageNum}) → ${imageFile}`);
      mappedCount++;

      return {
        ...affiliate,
        image: imagePath
      };
    } else {
      console.log(`  ${affiliate.name} (${imageNum}) → No image`);
    }
  }

  return affiliate;
});

// 파일 저장
const outputPath = path.join(__dirname, '../data/affiliates.json');
fs.writeFileSync(outputPath, JSON.stringify(updatedAffiliates, null, 2), 'utf8');

console.log('\n✅ Done! Updated affiliates.json with company images');
console.log(`   Mapped: ${mappedCount} images`);
