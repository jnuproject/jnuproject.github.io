import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAllAffiliates } from "../../hooks/useAffiliates";
import * as NavigationBar from "expo-navigation-bar";

export default function CategoryScreen() {
  const { category } = useLocalSearchParams();
  const categoryTitle = typeof category === "string" ? category : Array.isArray(category) ? category[0] : "전체";
  const [selectedSub, setSelectedSub] = useState("전체");
  const router = useRouter();
  const { data } = useAllAffiliates();

  useEffect(() => {
    // Android 네비게이션 바 표시
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('visible');
    }

    // 페이지를 떠날 때 다시 숨김
    return () => {
      if (Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('hidden');
      }
    };
  }, []);

  // ... (subCategories, regions 정의는 동일) ...
  const subCategories = [
    "전체", "교육취업", "의료", "문화", "숙박", "편의", "가전", "교통", "소셜플랫폼", "지역상생", "식음료"
  ];
  const regions = [
    "전체", "제대, 아라동", "시청, 탑동", "구제주",
    "노형, 연동", "신제주", "애월, 한림", "구좌, 조천, 함덕", "서귀포", "성산, 표선"
  ];
  const isAllCategory = categoryTitle === "전체";
  const filterOptions = isAllCategory ? regions : categoryTitle === "기업제휴" ? subCategories : regions;
  const categoryHasAnyData =
    categoryTitle === "전체" ? data.length > 0 : data.some((item) => item.category === categoryTitle);
  const emptyMessage = categoryHasAnyData ? "해당 항목이 없습니다." : "추후 공개";

  // 데이터 필터링
  const filtered = data.filter((item) => {
    if (isAllCategory) {
      // 전체 카테고리: 모든 제휴를 표시하지만 지역 필터 적용
      return (
        selectedSub === "전체" ||
        item.region?.includes(selectedSub)
      );
    }
    const categoryMatch = item.category === categoryTitle;
    const filterMatch =
      selectedSub === "전체" ||
      item.region?.includes(selectedSub) ||
      item.subcategory?.includes(selectedSub);
    return categoryMatch && filterMatch;
  });

  return (
    <SafeAreaView style={s.safe}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#111827", paddingHorizontal: 16, marginTop: 10 }}>
          {categoryTitle}
        </Text>
        {/* 상단 필터 */}
        <View style={s.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
            <View style={s.filterRow}>
              {filterOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[s.filterBtn, selectedSub === opt && s.active]}
                  onPress={() => setSelectedSub(opt)}
                >
                  <Text style={[s.filterText, selectedSub === opt && s.activeText]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 리스트 */}
        <ScrollView
          style={s.list}
          contentContainerStyle={[
            s.listContent,
            filtered.length === 0 && { flex: 1, justifyContent: "center", alignItems: "center" },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length > 0 ? (
            filtered.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={s.card}
                onPress={() => router.push(`/details/${encodeURIComponent(item.name)}`)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>{item.name}</Text>
                  {item.description && (
                    <Text style={s.cardDesc} numberOfLines={2}>{item.description}</Text>
                  )}
                  {categoryTitle === "기업제휴" ? (
                    item.subcategory && (
                      <Text style={s.cardSubcategory}>{item.subcategory}</Text>
                    )
                  ) : (
                    item.region && (
                      <Text style={s.cardRegion}>{item.region}</Text>
                    )
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: "center", color: "#6B7280" }}>
              {emptyMessage}
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  filterContainer: {
    height: 60,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  filterScroll: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  filterBtn: {
    backgroundColor: "#F3F8F6",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  active: {
    backgroundColor: "#62A89C",
  },
  filterText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#CDE5DE",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 18,
  },
  cardSubcategory: {
    fontSize: 12,
    color: "#10B981",
    marginTop: 6,
    fontWeight: "600",
  },
  cardRegion: {
    fontSize: 12,
    color: "#10B981",
    marginTop: 6,
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  list: {
    flex: 1,
    marginTop: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
    alignItems: "stretch",
    justifyContent: "flex-start",
    flexShrink: 0,
  },
});
