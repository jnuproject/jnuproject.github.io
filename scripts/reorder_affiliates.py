#!/usr/bin/env python3
import json

# Read the affiliates.json file
with open('/Users/goyehun/myApp/data/affiliates.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Define the desired order for 기업제휴 items
desired_order = [
    "세이프닥", "GS안과", "롯데시네마", "오션월드", "젠지 (E-sports)", "키움",
    "LG전자", "쏘카", "카카오", "네이버", "LG트윈스", "아이티렛츠고",
    "렛츠커리어", "시원스쿨", "한국검정평가원", "중앙병원", "아르떼뮤지엄",
    "이월드", "제주아쿠아플라넷", "여기어때", "이사대학", "LG U+",
    "정후문 원룸", "칠성로 상인회", "미리캔버스", "VIPS", "YBM",
    "다산에듀", "잡플래닛", "포시즌", "제주유스호스텔", "제주한화리조트",
    "사람휘트니스", "어도비", "삼성스토어", "이제주 버스 회사",
    "삼다자동차학원", "유동커피"
]

# Separate items by category
기업제휴_items = []
other_items = []

for item in data:
    if item['category'] == '기업제휴':
        기업제휴_items.append(item)
    else:
        other_items.append(item)

# Create a dictionary for quick lookup
기업제휴_dict = {item['name']: item for item in 기업제휴_items}

# Print current 기업제휴 items
print(f"Found {len(기업제휴_items)} items with category '기업제휴'")
print("\nCurrent 기업제휴 items:")
for item in 기업제휴_items:
    print(f"  - {item['name']}")

# Check if all items in desired_order exist
print(f"\nChecking if all {len(desired_order)} items in desired order exist:")
missing_items = []
for name in desired_order:
    if name not in 기업제휴_dict:
        print(f"  WARNING: '{name}' not found in current 기업제휴 items")
        missing_items.append(name)
    else:
        print(f"  ✓ {name}")

# Check for extra items not in desired_order
extra_items = []
for name in 기업제휴_dict.keys():
    if name not in desired_order:
        print(f"  WARNING: '{name}' exists but not in desired order")
        extra_items.append(name)

if missing_items or extra_items:
    print(f"\nERROR: Mismatch detected!")
    print(f"Missing items: {missing_items}")
    print(f"Extra items: {extra_items}")
    exit(1)

# Reorder 기업제휴 items according to desired_order
reordered_기업제휴 = []
for idx, name in enumerate(desired_order, start=1):
    item = 기업제휴_dict[name]

    # Update specific items
    if name == "VIPS":
        item['category'] = '지역상생'
        print(f"\n✓ Changed category for VIPS to '지역상생'")
    elif name == "유동커피":
        item['category'] = '지역상생'
        print(f"✓ Changed category for 유동커피 to '지역상생'")
    elif name == "어도비":
        item['subcategory'] = '편의'
        print(f"✓ Changed subcategory for 어도비 to '편의'")
    elif name == "LG전자":
        old_desc = item.get('description', '')
        item['description'] = "apple 제품 및 iPhone 할인 티켓 선착순 제공, LG gram 신학기 할인 프로모션 진행"
        print(f"✓ Updated description for LG전자")
        print(f"  Old: {old_desc}")
        print(f"  New: {item['description']}")

    # Only assign new ID if staying in 기업제휴 category
    if item['category'] == '기업제휴':
        item['id'] = idx
        reordered_기업제휴.append(item)
    else:
        # If moved to 지역상생, add to other_items
        other_items.append(item)

print(f"\n✓ Reordered {len(reordered_기업제휴)} items in 기업제휴 category")
print(f"✓ Moved 2 items to 지역상생 category")

# Combine all items
final_data = reordered_기업제휴 + other_items

# Sort to maintain consistency (기업제휴 first, then others)
# But keep 기업제휴 in the new order
result = []
result.extend(reordered_기업제휴)
result.extend(other_items)

print(f"\nTotal items in final data: {len(result)}")

# Write back to file
with open('/Users/goyehun/myApp/data/affiliates.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"\n✓ Successfully updated /Users/goyehun/myApp/data/affiliates.json")

# Also update the docs version
with open('/Users/goyehun/myApp/docs/data/affiliates.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"✓ Successfully updated /Users/goyehun/myApp/docs/data/affiliates.json")

print("\n=== SUMMARY ===")
print(f"- Reordered {len(reordered_기업제휴)} items in 기업제휴 category")
print(f"- Changed category for VIPS: 기업제휴 → 지역상생")
print(f"- Changed category for 유동커피: 기업제휴 → 지역상생")
print(f"- Changed subcategory for 어도비: 가전 → 편의")
print(f"- Updated description for LG전자")
