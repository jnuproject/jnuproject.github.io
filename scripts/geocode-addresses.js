const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'AIzaSyDt7ieN0wG23Zy5ZCuxg0pjHNqowquaZHI';
const affiliatesPath = path.join(__dirname, '../data/affiliates.json');
const docsPath = path.join(__dirname, '../docs/data/affiliates.json');
const affiliates = JSON.parse(fs.readFileSync(affiliatesPath, 'utf8'));

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}&region=kr`;
  try {
    const data = await httpsGet(url);
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { latitude: location.lat, longitude: location.lng };
    }
    return null;
  } catch (error) {
    console.log(`  ❌ 오류: ${error.message}`);
    return null;
  }
}

async function findPlace(name, address) {
  const query = `${name} ${address}`;
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,photos&key=${API_KEY}&region=kr`;
  try {
    const data = await httpsGet(url);
    if (data.status === 'OK' && data.candidates.length > 0) {
      const place = data.candidates[0];
      if (place.photos && place.photos.length > 0) {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${place.photos[0].photo_reference}&key=${API_KEY}`;
      }
    }
    return 'https://placehold.co/200x200';
  } catch (error) {
    return 'https://placehold.co/200x200';
  }
}

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function main() {
  console.log('🔍 주소가 있는 업체 중 좌표가 기본값인 업체를 찾습니다...\n');
  let updatedCount = 0;
  const defaultLat = 33.4996;
  const defaultLng = 126.5312;

  for (let i = 0; i < affiliates.length; i++) {
    const affiliate = affiliates[i];
    if (affiliate.address && affiliate.address.trim() !== '' && 
        affiliate.latitude === defaultLat && affiliate.longitude === defaultLng) {
      console.log(`\n[${updatedCount + 1}] ${affiliate.name}`);
      console.log(`  주소: ${affiliate.address}`);
      
      const geoResult = await geocodeAddress(affiliate.address);
      if (geoResult) {
        affiliates[i].latitude = geoResult.latitude;
        affiliates[i].longitude = geoResult.longitude;
        console.log(`  ✓ 좌표: ${geoResult.latitude}, ${geoResult.longitude}`);
        
        const imageUrl = await findPlace(affiliate.name, affiliate.address);
        affiliates[i].image = imageUrl;
        console.log(`  ✓ 이미지: ${imageUrl.substring(0, 50)}...`);
        
        updatedCount++;
        await delay(200);
      }
    }
  }

  if (updatedCount > 0) {
    const jsonData = JSON.stringify(affiliates, null, 2);
    fs.writeFileSync(affiliatesPath, jsonData, 'utf8');
    console.log('✓ /data/affiliates.json 저장됨');

    fs.writeFileSync(docsPath, jsonData, 'utf8');
    console.log('✓ docs/data/affiliates.json 복사됨');

    console.log(`\n✅ 완료! ${updatedCount}개 업체 업데이트됨`);
  } else {
    console.log('\n✅ 업데이트할 업체가 없습니다.');
  }
}

main().catch(console.error);
