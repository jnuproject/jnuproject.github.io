const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyDt7ieN0wG23Zy5ZCuxg0pjHNqowquaZHI';
const affiliates = require('../data/affiliates.json');

async function findPlaceByLocation(name, latitude, longitude) {
  try {
    // Nearby Search로 장소 찾기
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50&keyword=${encodeURIComponent(name)}&key=${API_KEY}&language=ko`;

    const searchResponse = await axios.get(searchUrl);

    if (searchResponse.data.results && searchResponse.data.results.length > 0) {
      const place = searchResponse.data.results[0];
      return place.place_id;
    }

    return null;
  } catch (error) {
    console.error(`Error finding place for ${name}:`, error.message);
    return null;
  }
}

async function getPlacePhotos(placeId) {
  try {
    // Place Details로 사진 정보 가져오기
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}&language=ko`;

    const detailsResponse = await axios.get(detailsUrl);

    if (detailsResponse.data.result && detailsResponse.data.result.photos) {
      const photos = detailsResponse.data.result.photos;

      // Photo reference를 실제 URL로 변환
      const photoUrls = photos.slice(0, 5).map(photo => {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${API_KEY}`;
      });

      return photoUrls;
    }

    return [];
  } catch (error) {
    console.error(`Error getting photos for place ${placeId}:`, error.message);
    return [];
  }
}

async function fetchAllImages() {
  const results = {};

  // 기업제휴 카테고리 제외
  const filteredAffiliates = affiliates.filter(a => a.category !== '기업제휴');

  console.log('Starting to fetch images for all affiliates...\n');
  console.log(`Total: ${affiliates.length}, Excluding 기업제휴: ${filteredAffiliates.length}\n`);

  for (let i = 0; i < filteredAffiliates.length; i++) {
    const affiliate = filteredAffiliates[i];

    console.log(`[${i + 1}/${filteredAffiliates.length}] Processing: ${affiliate.name}`);

    if (!affiliate.latitude || !affiliate.longitude) {
      console.log(`  ⚠️  Skipping (no coordinates)\n`);
      results[affiliate.id] = {
        name: affiliate.name,
        images: [],
        error: 'No coordinates'
      };
      continue;
    }

    try {
      // 1. Place ID 찾기
      const placeId = await findPlaceByLocation(
        affiliate.name,
        affiliate.latitude,
        affiliate.longitude
      );

      if (!placeId) {
        console.log(`  ❌ Place not found\n`);
        results[affiliate.id] = {
          name: affiliate.name,
          images: [],
          error: 'Place not found'
        };
        continue;
      }

      console.log(`  ✓ Place ID: ${placeId}`);

      // 2. 사진 가져오기
      const photos = await getPlacePhotos(placeId);

      console.log(`  ✓ Found ${photos.length} photos\n`);

      results[affiliate.id] = {
        name: affiliate.name,
        images: photos,
        placeId: placeId
      };

      // API 호출 제한을 피하기 위해 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}\n`);
      results[affiliate.id] = {
        name: affiliate.name,
        images: [],
        error: error.message
      };
    }
  }

  // 결과를 파일로 저장
  const outputPath = path.join(__dirname, '../data/affiliate-images.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

  console.log('\n✅ Done! Results saved to:', outputPath);

  // 통계 출력
  const withImages = Object.values(results).filter(r => r.images.length > 0).length;
  const withoutImages = Object.values(results).filter(r => r.images.length === 0).length;

  console.log(`\n📊 Statistics:`);
  console.log(`   Total processed: ${filteredAffiliates.length}`);
  console.log(`   Excluded (기업제휴): ${affiliates.length - filteredAffiliates.length}`);
  console.log(`   With images: ${withImages}`);
  console.log(`   Without images: ${withoutImages}`);
}

// 실행
fetchAllImages().catch(console.error);
