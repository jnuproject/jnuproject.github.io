const fs = require('fs');
const path = require('path');

const affiliatesPath = path.join(__dirname, '../data/affiliates.json');
const docsPath = path.join(__dirname, '../docs/data/affiliates.json');

const affiliates = JSON.parse(fs.readFileSync(affiliatesPath, 'utf8'));
console.log(`현재 업체 수: ${affiliates.length}`);

const newBeauty = [
  {
    name: "플루즈(pelouse)",
    address: "제주 제주시 서광로32길 42 1층",
    description: "카드 5%, 현금 10% 할인",
    region: "구제주"
  },
  {
    name: "네일해나",
    address: "제주 제주시 신성로13길 25-1 1층",
    description: "3천원 할인 + 네이버 포토리뷰 5천원 할인 (중복가능, 케어제외)",
    region: "구제주"
  },
  {
    name: "크롬웰 안경제주점",
    address: "제주시 중앙로 206 1층 (시청)",
    description: "추가할인 15%, 콘텍트렌즈 제주 최저가, 원데이렌즈 30p 15,000원",
    region: "구제주"
  },
  {
    name: "디테일 안경 제주점",
    address: "제주 제주시 아란7길 10-1 1층",
    description: "안경, 안경렌즈, 선글라스 품목 10% 할인",
    region: "제대, 아라동"
  },
  {
    name: "소모소빈티지샵",
    address: "제주시 중앙로2길 21",
    description: "제주대학교 학생 전제품 5% 할인",
    region: "구제주"
  },
  {
    name: "베베뷰티",
    address: "제주 제주시 중앙로7길 19 3층",
    description: "케어제외, 젤시술 시 15% 할인",
    region: "구제주"
  },
  {
    name: "라라라",
    address: "제주 제주시 신성로13길 16 1층",
    description: "카드 5%, 현금 10% 할인",
    region: "구제주"
  },
  {
    name: "뢰임안경",
    address: "제주 제주시 중앙로 350",
    description: "20% 할인",
    region: "구제주"
  },
  {
    name: "지니스안경 제주외도점",
    address: "제주 제주시 우정로 62-1 1층",
    description: "",
    region: "외도"
  },
  {
    name: "명동안경",
    address: "제주 제주시 서문로 23-1 1층",
    description: "",
    region: "구제주"
  },
  {
    name: "프로디헤어 본점",
    address: "제주 제주시 한라대학로 37 2층",
    description: "",
    region: "제대, 아라동"
  },
  {
    name: "추나헤어",
    address: "제주 제주시 노형6길 18 1층",
    description: "",
    region: "노형"
  },
  {
    name: "진스헤어살롱",
    address: "제주 제주시 노형로 388 1층",
    description: "",
    region: "노형"
  },
  {
    name: "주바뷰티샵",
    address: "제주 제주시 도령로 129 2층",
    description: "",
    region: "구제주"
  }
];

let nextId = Math.max(...affiliates.map(a => parseInt(a.id))) + 1;

newBeauty.forEach(business => {
  const newAffiliate = {
    id: String(nextId),
    name: business.name,
    category: "미용/뷰티/패션",
    region: business.region,
    address: business.address,
    description: business.description,
    image: "https://placehold.co/200x200",
    latitude: 33.4996,
    longitude: 126.5312
  };
  affiliates.push(newAffiliate);
  console.log(`+ ${business.name} 추가 (ID: ${nextId})`);
  nextId++;
});

const jsonData = JSON.stringify(affiliates, null, 2);
fs.writeFileSync(affiliatesPath, jsonData, 'utf8');
console.log('✓ /data/affiliates.json 저장됨');

fs.writeFileSync(docsPath, jsonData, 'utf8');
console.log('✓ docs/data/affiliates.json 복사됨');

console.log(`\n완료! 총 업체 수: ${affiliates.length}`);
console.log(`신규 미용/뷰티/패션 추가: 14개`);
