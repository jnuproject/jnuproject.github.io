import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

API_KEY = "AIzaSyDt7ieN0wG23Zy5ZCuxg0pjHNqowquaZHI"
DEFAULT_LAT = 33.4996
DEFAULT_LNG = 126.5312
DELAY_SEC = 0.2

ROOT = Path(__file__).resolve().parents[1]
AFFILIATES_PATH = ROOT / "data" / "affiliates.json"
DOCS_PATH = ROOT / "docs" / "data" / "affiliates.json"


def fetch_json(url: str):
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        data = response.read().decode("utf-8")
        return json.loads(data)


def geocode(address: str):
    params = {
        "address": address,
        "key": API_KEY,
        "region": "kr",
    }
    url = "https://maps.googleapis.com/maps/api/geocode/json?" + urllib.parse.urlencode(params)
    data = fetch_json(url)
    if data.get("status") == "OK" and data.get("results"):
        location = data["results"][0]["geometry"]["location"]
        return location["lat"], location["lng"]
    return None


def find_place_photo(name: str, address: str):
    query = f"{name} {address}".strip()
    params = {
        "input": query,
        "inputtype": "textquery",
        "fields": "place_id,photos",
        "key": API_KEY,
        "region": "kr",
    }
    url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?" + urllib.parse.urlencode(params)
    data = fetch_json(url)
    if data.get("status") == "OK" and data.get("candidates"):
        photos = data["candidates"][0].get("photos")
        if photos:
            photo_ref = photos[0].get("photo_reference")
            if photo_ref:
                params = {
                    "maxwidth": 800,
                    "photo_reference": photo_ref,
                    "key": API_KEY,
                }
                return "https://maps.googleapis.com/maps/api/place/photo?" + urllib.parse.urlencode(params)
    return None


def main():
    affiliates = json.loads(AFFILIATES_PATH.read_text(encoding="utf-8"))
    to_update = [a for a in affiliates if a.get("address") and a.get("latitude") == DEFAULT_LAT and a.get("longitude") == DEFAULT_LNG]

    print(f"총 {len(affiliates)}개 중 {len(to_update)}개 업체를 업데이트합니다.\n")
    updated = 0
    failures = []

    for idx, affiliate in enumerate(to_update, 1):
        name = affiliate.get("name")
        address = affiliate.get("address")
        print(f"[{idx}/{len(to_update)}] {name}")
        print(f"  주소: {address}")

        try:
            geo = geocode(address)
        except Exception as exc:
            print(f"  ❌ 지오코딩 오류: {exc}")
            failures.append(name)
            time.sleep(DELAY_SEC)
            continue

        if not geo:
            print("  ❌ 좌표를 찾지 못했습니다.")
            failures.append(name)
            time.sleep(DELAY_SEC)
            continue

        lat, lng = geo
        affiliate["latitude"] = lat
        affiliate["longitude"] = lng
        print(f"  ✓ 좌표: {lat}, {lng}")

        photo_url = None
        try:
            photo_url = find_place_photo(name or "", address)
        except Exception as exc:
            print(f"  ⚠️  이미지 조회 실패: {exc}")

        if photo_url:
            affiliate["image"] = photo_url
            print("  ✓ 이미지 갱신")
        else:
            print("  ⚠️  이미지를 찾지 못해 기본 이미지를 유지합니다.")

        updated += 1
        time.sleep(DELAY_SEC)

    if updated:
        json_data = json.dumps(affiliates, ensure_ascii=False, indent=2)
        AFFILIATES_PATH.write_text(json_data, encoding="utf-8")
        DOCS_PATH.write_text(json_data, encoding="utf-8")
        print(f"\n✅ 완료! {updated}개 업체 업데이트됨")
    else:
        print("\n정보를 업데이트할 업체가 없습니다.")

    if failures:
        print("\n다음 업체는 좌표 또는 이미지를 찾지 못했습니다:")
        for name in failures:
            print(f" - {name}")


if __name__ == "__main__":
    main()
