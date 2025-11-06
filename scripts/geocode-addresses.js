/**
 * 주소를 좌표로 변환하는 지오코딩 스크립트
 * Google Geocoding API를 사용하여 affiliates.json의 모든 주소를 정확한 좌표로 업데이트합니다.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Google Geocoding API 키
const GOOGLE_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('Error: GOOGLE_GEOCODING_API_KEY not found in .env file');
  process.exit(1);
}

// 파일 경로
const DATA_FILE = path.join(__dirname, '../data/affiliates.json');
const BACKUP_FILE = path.join(__dirname, '../data/affiliates.backup.json');

// API 호출 간격 (밀리초) - Google API 제한을 피하기 위해
const DELAY_MS = 200;

/**
 * Google Geocoding API를 사용하여 주소를 좌표로 변환
 */
async function geocodeAddress(address) {
  if (!address) {
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: data.results[0].formatted_address
      };
    } else {
      console.error(`❌ 지오코딩 실패 (${address}): ${data.status}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ API 호출 오류 (${address}):`, error.message);
    return null;
  }
}

/**
 * 딜레이 함수
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('🗺️  지오코딩 스크립트 시작...\n');

  // API 키 확인
  if (GOOGLE_API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Google API 키를 설정해주세요!');
    console.log('\n📝 Google Cloud Console에서 API 키를 받는 방법:');
    console.log('1. https://console.cloud.google.com/ 접속');
    console.log('2. 프로젝트 생성 또는 선택');
    console.log('3. "API 및 서비스" > "사용자 인증 정보" 메뉴');
    console.log('4. "사용자 인증 정보 만들기" > "API 키" 선택');
    console.log('5. Geocoding API 활성화');
    console.log('6. 생성된 API 키를 이 스크립트의 GOOGLE_API_KEY에 입력\n');
    process.exit(1);
  }

  // 데이터 파일 읽기
  let affiliates;
  try {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    affiliates = JSON.parse(fileContent);
    console.log(`✅ ${affiliates.length}개의 제휴 업체 데이터 로드 완료\n`);
  } catch (error) {
    console.error('❌ 데이터 파일 읽기 실패:', error.message);
    process.exit(1);
  }

  // 백업 생성
  try {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(affiliates, null, 2), 'utf8');
    console.log(`💾 백업 파일 생성: ${BACKUP_FILE}\n`);
  } catch (error) {
    console.error('❌ 백업 파일 생성 실패:', error.message);
    process.exit(1);
  }

  // 지오코딩 시작
  console.log('🚀 지오코딩 시작...\n');

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < affiliates.length; i++) {
    const affiliate = affiliates[i];
    const progress = `[${i + 1}/${affiliates.length}]`;

    if (!affiliate.address) {
      console.log(`${progress} ⏭️  ${affiliate.name} - 주소 없음 (건너뜀)`);
      skipCount++;
      continue;
    }

    console.log(`${progress} 🔍 ${affiliate.name} - ${affiliate.address}`);

    const result = await geocodeAddress(affiliate.address);

    if (result) {
      affiliate.latitude = Number(result.latitude.toFixed(4));
      affiliate.longitude = Number(result.longitude.toFixed(4));
      console.log(`${progress} ✅ 좌표: ${affiliate.latitude}, ${affiliate.longitude}\n`);
      successCount++;
    } else {
      console.log(`${progress} ❌ 실패\n`);
      failCount++;
    }

    // API 호출 제한을 피하기 위한 딜레이
    if (i < affiliates.length - 1) {
      await delay(DELAY_MS);
    }
  }

  // 결과 저장
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(affiliates, null, 2), 'utf8');
    console.log('\n💾 업데이트된 데이터 저장 완료!\n');
  } catch (error) {
    console.error('❌ 데이터 저장 실패:', error.message);
    process.exit(1);
  }

  // 결과 요약
  console.log('=' .repeat(50));
  console.log('📊 지오코딩 결과 요약');
  console.log('=' .repeat(50));
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failCount}개`);
  console.log(`⏭️  건너뜀: ${skipCount}개`);
  console.log(`📁 총: ${affiliates.length}개`);
  console.log('=' .repeat(50));

  if (failCount > 0) {
    console.log('\n⚠️  일부 주소의 좌표 변환에 실패했습니다.');
    console.log('실패한 주소는 기존 좌표를 유지합니다.');
  }

  console.log('\n✨ 완료!');
}

// 스크립트 실행
main().catch(error => {
  console.error('❌ 실행 중 오류 발생:', error);
  process.exit(1);
});
