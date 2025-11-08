const fs = require('fs');
const path = require('path');

const affiliatesPath = path.join(__dirname, '../data/affiliates.json');
const docsPath = path.join(__dirname, '../docs/data/affiliates.json');

const affiliates = JSON.parse(fs.readFileSync(affiliatesPath, 'utf8'));
console.log(`현재 업체 수: ${affiliates.length}`);

const newCafes = [
  {
    name: "나이체",
    address: "제주 제주시 인다6길 35 1층",
    description: "",
    region: "제대, 아라동"
  },
  {
    name: "장산다방",
    address: "제주특별자치도 제주시 서부두2길 26 휘슬락호텔 1층",
    description: "",
    region: "구제주"
  },
  {
    name: "하이리보",
    address: "제주시 도련동길 19 1층",
    description: "애견 입장료 40% 할인",
    region: "구제주"
  },
  {
    name: "트윗스터 윗",
    address: "제주 제주시 고산동산1길 11 1층",
    description: "매장 방문시 10% 할인, 5개 구매 시 1개 서비스",
    region: "제대, 아라동"
  },
  {
    name: "좋수다",
    address: "제주특별자치도 제주시 고마로 11길 45",
    description: "20% 할인 + 리뷰이벤트 시 미니 요거트볼",
    region: "제대, 아라동"
  },
  {
    name: "뭉실뭉실",
    address: "제주 제주시 구남동6길 15 1층",
    description: "음료 20% 할인 또는 휘낭시에 1개 제공",
    region: "제대, 아라동"
  },
  {
    name: "청연 디저트",
    address: "제주 제주시 도남로 189 1층",
    description: "음료 5% 할인 (네이버리뷰 작성시 10% 적용)",
    region: "제대, 아라동"
  },
  {
    name: "브레드버프",
    address: "제주 제주시 우정로3길 4 1층",
    description: "5~10% 할인 (당선 이후 방문 원하심)",
    region: "구제주"
  },
  {
    name: "모찌롱",
    address: "제주시 관덕로6길 12 1층",
    description: "디저트류 10% 할인",
    region: "구제주"
  },
  {
    name: "플레르",
    address: "제주 제주시 구산로 22-7 102호",
    description: "꽃 + 케이크 10% 할인",
    region: "제대, 아라동"
  },
  {
    name: "카페 블레스",
    address: "제주특별자치도 제주시 서광로 297",
    description: "음료 주문 시 쿠키 무료 제공",
    region: "제대, 아라동"
  },
  {
    name: "라스트플라츠커피",
    address: "제주 제주시 구남로8길 26 1층",
    description: "모든음료 10% 할인",
    region: "제대, 아라동"
  },
  {
    name: "베이커리우빵",
    address: "제주 제주시 동고산로 34 1층",
    description: "10% 할인",
    region: "제대, 아라동"
  },
  {
    name: "제주트립티산지",
    address: "제주시 관덕로 17길 29",
    description: "음료 15% 할인",
    region: "구제주"
  },
  {
    name: "커피스트릿16",
    address: "제주시 용두암길 16",
    description: "전 메뉴 10% 할인",
    region: "용담"
  },
  {
    name: "킥커피",
    address: "제주특별자치도 제주시 연북로 12 1층",
    description: "동일 혜택 적용",
    region: "노형"
  }
];

let nextId = Math.max(...affiliates.map(a => parseInt(a.id))) + 1;

newCafes.forEach(cafe => {
  const newAffiliate = {
    id: String(nextId),
    name: cafe.name,
    category: "카페",
    region: cafe.region,
    address: cafe.address,
    description: cafe.description,
    image: "https://placehold.co/200x200",
    latitude: 33.4996,
    longitude: 126.5312
  };
  affiliates.push(newAffiliate);
  console.log(`+ ${cafe.name} 추가 (ID: ${nextId})`);
  nextId++;
});

const jsonData = JSON.stringify(affiliates, null, 2);
fs.writeFileSync(affiliatesPath, jsonData, 'utf8');
console.log('✓ /data/affiliates.json 저장됨');

fs.writeFileSync(docsPath, jsonData, 'utf8');
console.log('✓ docs/data/affiliates.json 복사됨');

console.log(`\n완료! 총 업체 수: ${affiliates.length}`);
console.log(`신규 카페 추가: 16개`);
