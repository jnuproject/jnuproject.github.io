const axios = require('axios');

const API_KEY = 'AIzaSyDt7ieN0wG23Zy5ZCuxg0pjHNqowquaZHI';

// 한푼리 포차 좌표 (affiliates.json에서)
const latitude = 33.4753;
const longitude = 126.5342;

async function findHanpunriRestaurant() {
  try {
    // "한푼리"로 검색
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&keyword=${encodeURIComponent('한푼리')}&key=${API_KEY}&language=ko`;

    console.log('Searching for 한푼리...\n');
    const searchResponse = await axios.get(searchUrl);

    console.log(`Found ${searchResponse.data.results.length} results:`);
    searchResponse.data.results.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.name} - ${r.vicinity}`);
    });

    if (searchResponse.data.results && searchResponse.data.results.length > 0) {
      const place = searchResponse.data.results[0];
      console.log(`✓ Found: ${place.name}`);
      console.log(`  Place ID: ${place.place_id}`);

      // 사진 가져오기
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos&key=${API_KEY}&language=ko`;
      const detailsResponse = await axios.get(detailsUrl);

      if (detailsResponse.data.result && detailsResponse.data.result.photos) {
        const photos = detailsResponse.data.result.photos;
        const photoUrls = photos.slice(0, 5).map(photo => {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${API_KEY}`;
        });

        console.log(`  Found ${photoUrls.length} photos\n`);
        console.log('Photo URLs:');
        photoUrls.forEach((url, i) => console.log(`  ${i + 1}. ${url.substring(0, 100)}...`));

        return {
          placeId: place.place_id,
          images: photoUrls
        };
      }
    }

    console.log('❌ Place not found');
    return null;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

findHanpunriRestaurant();
