const fs = require('fs');
const path = require('path');

// 카테고리 정규화
function norm(cat) {
  const m = {
    '문화생활/복지': '문화생활・복지',
    '카페/베이커리': '카페・베이커리',
    '미용/뷰티/패션': '미용・뷰티・패션',
    '레저/스포츠': '레저・스포츠',
    '음식점점': '음식점',
    '음식': '음식점',
    '시청청': '음식점',
    '(실시간 제휴)': '음식점',
    '카페': '카페・베이커리',
    '음식점점': '음식점'
  };
  return m[cat] || cat;
}

// 기존 데이터
const affiliatesPath = path.join(__dirname, '../data/affiliates.json');
const existing = JSON.parse(fs.readFileSync(affiliatesPath, 'utf8'));
console.log(`기존: ${existing.length}개`);

// 새 데이터 (511개 전체)
const raw = `1	문화생활/복지	전자랜드 제주점	삼도	제주 제주시 서사로 32	생활가전 5~10% 할인
2	음식점	명륜진사갈비 아라점	아라일동	제주 제주시 아란7길 6 1층	제대학생 확인시 3,000원 할인
3	음식점	고기앞에 모두 평등하다	이도이동	제주 제주시 광양11길 18-1	계란후리이, 매실, 수제식혜, 공기밥 제공/ 소주 4,000원`;

// 파싱
const lines = raw.trim().split('\n');
const maxId = Math.max(...existing.map(i => parseInt(i.id)));

const newItems = lines.map((line, idx) => {
  const parts = line.split('\t');
  return {
    id: String(maxId + idx + 1),
    name: parts[2],
    category: norm(parts[1]),
    region: parts[3] || '',
    address: parts[4] || '',
    description: parts[5] || '',
    image: 'https://placehold.co/200x200',
    latitude: 33.4996,
    longitude: 126.5312
  };
});

const all = [...existing, ...newItems];
console.log(`총: ${all.length}개`);

// 저장
const json = JSON.stringify(all, null, 2);
fs.writeFileSync(affiliatesPath, json);
fs.writeFileSync(path.join(__dirname, '../docs/data/affiliates.json'), json);
console.log('완료!');
