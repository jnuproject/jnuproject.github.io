const fs = require('fs');
const path = require('path');

const affiliatesPath = path.join(__dirname, '../data/affiliates.json');
const docsPath = path.join(__dirname, '../docs/data/affiliates.json');

const affiliates = JSON.parse(fs.readFileSync(affiliatesPath, 'utf8'));
console.log(`현재 업체 수: ${affiliates.length}`);

const newCulture = [
  {
    name: "이제주고속관광",
    address: "제주 제주시 노형로 120-1",
    description: "차량 임차 시 10% 할인",
    region: "노형"
  },
  {
    name: "달토록도자공방",
    address: "제주 제주시 도남로7길 44 4층",
    description: "2인 이상 방문 시 20% 할인",
    region: "제대, 아라동"
  },
  {
    name: "삼다자동차운전전문학원",
    address: "제주시 서회천길 88",
    description: "수강료 10% 할인",
    region: "제대, 아라동"
  },
  {
    name: "그램 필라테스 아라점",
    address: "제주시 아봉로 56 이수빌 2층",
    description: "그룹수업 등록 시 횟수 추가 (8+1, 16+2, 24+3, 48+4)",
    region: "제대, 아라동"
  },
  {
    name: "그램 필라테스 노형점",
    address: "제주시 노형로 367 3층",
    description: "그룹수업 등록 시 횟수 추가 (8+1, 16+2, 24+3, 48+4)",
    region: "노형"
  },
  {
    name: "아하 필라테스 & 발레",
    address: "제주시 건주로 43 4층",
    description: "그룹수업 등록 시 횟수 추가 (8+1, 16+2, 24+3, 48+4)",
    region: "구제주"
  },
  {
    name: "묘량묘다 미술공방",
    address: "제주 제주시 수덕11길 1 1층 코너",
    description: "오일파스텔 (a4) 수강 시 액자 무료 증정 (혜택 변경 가능)",
    region: "구제주"
  },
  {
    name: "파랑책방",
    address: "제주 제주시 인다5길 11-7 102호",
    description: "책 구매 시 파랑로고 양말 증정",
    region: "제대, 아라동"
  },
  {
    name: "몸냥공작소",
    address: "제주 제주시 애월읍 하소로 594",
    description: "와펜 체험시 와펜 1개 무료 증정",
    region: "애월"
  },
  {
    name: "WISE 퍼스널컬러",
    address: "제주 제주시 남광로4길 15 1층",
    description: "20% 할인",
    region: "구제주"
  },
  {
    name: "고수의 운전면허",
    address: "제주 제주시 서광로 291 1층",
    description: "제주대학교 재학생 이용권 10% 할인",
    region: "구제주"
  },
  {
    name: "114 칼라 스튜디오",
    address: "제주 제주시 과원북2길 50",
    description: "원본 파일 전송, 추가 인화 2장 이상",
    region: "구제주"
  },
  {
    name: "에브리블룸",
    address: "제주시 동문로 62",
    description: "꽃다발 5만원이상 10% 할인",
    region: "구제주"
  },
  {
    name: "린플라워",
    address: "제주 제주시 구남동1길 10 1층",
    description: "꽃 구입 시 10% 할인",
    region: "제대, 아라동"
  },
  {
    name: "자연인글램핑",
    address: "",
    description: "제주대 학생증 지참시 10% 할인",
    region: ""
  },
  {
    name: "그림리조트",
    address: "",
    description: "10% 할인",
    region: "용담삼동"
  },
  {
    name: "모루티스테이",
    address: "",
    description: "1층 20% 할인, 2층 10% 할인",
    region: "법환동"
  },
  {
    name: "더쉼팡스파앤풀빌라",
    address: "",
    description: "동일 혜택 적용",
    region: "표선면"
  }
];

let nextId = Math.max(...affiliates.map(a => parseInt(a.id))) + 1;

newCulture.forEach(business => {
  const newAffiliate = {
    id: String(nextId),
    name: business.name,
    category: "문화생활/복지",
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
console.log(`신규 문화생활/복지 추가: 18개`);
