#!/usr/bin/env python3
import json

# 데이터 파일 경로
DATA_FILE = "data/affiliates.json"

# 파일 읽기
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    affiliates = json.load(f)

# 기존 업체 수정 (박물관은 살아있다, 런닝맨 제주점, 감귤카트)
existing_ids = ["104", "121", "120"]

for affiliate in affiliates:
    if affiliate["id"] in existing_ids:
        affiliate["category"] = "기업제휴"
        affiliate["subcategory"] = "문화"
        affiliate["sectionTitle"] = "도내문화"
        print(f"✓ {affiliate['name']} - 카테고리 변경 완료")

# 새로운 ID 찾기
max_id = max(int(a["id"]) for a in affiliates)
new_id_1 = str(max_id + 1)
new_id_2 = str(max_id + 2)

# 981파크 추가
park_981 = {
    "id": new_id_1,
    "name": "981파크",
    "category": "기업제휴",
    "subcategory": "문화",
    "sectionTitle": "도내문화",
    "region": "",
    "address": "",
    "description": "",
    "image": "",  # 나중에 사용자가 추가
    "latitude": 0,
    "longitude": 0
}

# 하리보월드 추가
haribo = {
    "id": new_id_2,
    "name": "하리보월드",
    "category": "기업제휴",
    "subcategory": "문화",
    "sectionTitle": "도내문화",
    "region": "",
    "address": "",
    "description": "",
    "image": "",  # 나중에 사용자가 추가
    "latitude": 0,
    "longitude": 0
}

affiliates.append(park_981)
affiliates.append(haribo)

print(f"✓ 981파크 추가 완료 (ID: {new_id_1})")
print(f"✓ 하리보월드 추가 완료 (ID: {new_id_2})")

# 파일 저장
with open(DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(affiliates, f, ensure_ascii=False, indent=2)

print(f"\n데이터 업데이트 완료!")
print(f"총 {len(affiliates)}개의 제휴 업체")
