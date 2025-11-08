const fs = require('fs');
const path = require('path');

// 파일 경로
const affiliatesPath = path.join(__dirname, '../data/affiliates.json');

// 데이터 읽기
const affiliates = JSON.parse(fs.readFileSync(affiliatesPath, 'utf8'));

console.log(`현재 업체 수: ${affiliates.length}`);

// 1. 기존 업체에 혜택 추가
const updates = [
  { id: "1", description: "2인당 음료 1개 제공" },
  { id: "2", description: "볶음밥, 음료수 1.25L 중 택 1 서비스" },
  { id: "3", description: "제주대 학생증 지참시 3000원 할인" },
  { id: "9", description: "포장 시 음료 1.25L 제공" },
  { id: "67", description: "" }
];

updates.forEach(update => {
  const affiliate = affiliates.find(a => a.id === update.id);
  if (affiliate) {
    affiliate.description = update.description;
    console.log(`✓ ${affiliate.name} - 혜택 추가됨`);
  }
});

// 2. 신규 업체 추가 - 주소 완전
const newRestaurantsComplete = [
  {
    name: "한양고깃집 제주아라점",
    address: "제주 제주시 도남로 199 1층",
    description: "사이드메뉴(주류 포함) 1개 제공",
    region: "제대, 아라동"
  },
  {
    name: "오라방 솥뚜껑",
    address: "제주 제주시 도남로 48-1",
    description: "",
    region: "제대, 아라동"
  },
  {
    name: "친정집",
    address: "제주시 일주동로 260",
    description: "20% 할인",
    region: "제대, 아라동"
  },
  {
    name: "아구듬뿍 알곤마니",
    address: "제주시 정든로 5길 24",
    description: "음료 1.25L 무료 제공",
    region: "제대, 아라동"
  },
  {
    name: "부지깽이",
    address: "제주 제주시 광양13길 11-2",
    description: "테이블 당 음료 2개 제공",
    region: "제대, 아라동"
  },
  {
    name: "못난이 꽈배기",
    address: "제주 제주시 구남동1길 32 1층",
    description: "",
    region: "제대, 아라동"
  },
  {
    name: "두끼 노형점",
    address: "제주특별자치도 제주시 연북로 48 2층 203호",
    description: "1000원 할인",
    region: "노형"
  }
];

// 3. 신규 업체 추가 - 주소 불완전
const newRestaurantsIncomplete = [
  {
    name: "별미돈",
    description: "2인분 이상 주문시 음료 1개, 3인분 이상 계란찜 서비스",
    region: ""
  },
  {
    name: "행복한족발",
    description: "음주 시: 현금결제 시 5% 할인 및 순대국 서비스 / 비음주 시: 2인 기준 음료 1개 제공",
    region: ""
  },
  {
    name: "돗깨비",
    description: "동일하게 진행(대리협약)",
    region: "이호일동"
  },
  {
    name: "착한괴기",
    description: "2인 이상 방문시 음료수 제공",
    region: "하효동"
  },
  {
    name: "훔쳐온뒷고기화북점",
    description: "동일 혜택 적용",
    region: "화북일동"
  },
  {
    name: "백제삼계",
    description: "삼계탕 10% 할인",
    region: "삼양이동"
  },
  {
    name: "제주 함덕흑돼지 왕표고기",
    description: "10% 할인",
    region: "조천읍"
  },
  {
    name: "면주막 제주본점",
    description: "10% 할인",
    region: "조천읍"
  }
];

// 다음 ID 계산
let nextId = Math.max(...affiliates.map(a => parseInt(a.id))) + 1;

// 주소 완전한 업체 추가
newRestaurantsComplete.forEach(restaurant => {
  const newAffiliate = {
    id: String(nextId),
    name: restaurant.name,
    category: "음식점",
    region: restaurant.region,
    address: restaurant.address,
    description: restaurant.description,
    image: "https://placehold.co/200x200",
    latitude: 33.4996,
    longitude: 126.5312
  };
  affiliates.push(newAffiliate);
  console.log(`+ ${restaurant.name} 추가 (ID: ${nextId})`);
  nextId++;
});

// 주소 불완전한 업체 추가
newRestaurantsIncomplete.forEach(restaurant => {
  const newAffiliate = {
    id: String(nextId),
    name: restaurant.name,
    category: "음식점",
    region: restaurant.region,
    address: "",
    description: restaurant.description,
    image: "https://placehold.co/200x200",
    latitude: 33.4996,
    longitude: 126.5312
  };
  affiliates.push(newAffiliate);
  console.log(`+ ${restaurant.name} 추가 (ID: ${nextId}) - 주소 불완전`);
  nextId++;
});

// 파일 저장
fs.writeFileSync(affiliatesPath, JSON.stringify(affiliates, null, 2), 'utf8');

console.log(`\n완료! 총 업체 수: ${affiliates.length}`);
console.log(`기존 업체 업데이트: 5개`);
console.log(`신규 업체 추가: 15개`);
