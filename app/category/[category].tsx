import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAllAffiliates } from "../../hooks/useAffiliates";
import * as NavigationBar from "expo-navigation-bar";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryScreen() {
  const { category } = useLocalSearchParams();
  const categoryTitle = typeof category === "string" ? category : Array.isArray(category) ? category[0] : "전체";
  const [selectedSub, setSelectedSub] = useState("전체");
  const router = useRouter();
  const { data } = useAllAffiliates();
  const fadeAnim = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    // Android 네비게이션 바 표시
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('visible');
    }

    // 페이지 페이드 인 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

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
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* 헤더 with 뒤로가기 버튼 */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{categoryTitle}</Text>
          <View style={{ width: 40 }} />
        </View>
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
            (() => {
              // 섹션별로 그룹화
              const sections: { sectionTitle: string | undefined; items: typeof filtered }[] = [];
              let currentSection: typeof sections[0] | null = null;

              filtered.forEach((item) => {
                if (item.sectionTitle) {
                  if (!currentSection || currentSection.sectionTitle !== item.sectionTitle) {
                    currentSection = { sectionTitle: item.sectionTitle, items: [] };
                    sections.push(currentSection);
                  }
                  currentSection.items.push(item);
                } else {
                  if (!currentSection || currentSection.sectionTitle !== undefined) {
                    currentSection = { sectionTitle: undefined, items: [] };
                    sections.push(currentSection);
                  }
                  currentSection.items.push(item);
                }
              });

              return sections.map((section, sectionIdx) => (
                <React.Fragment key={sectionIdx}>
                  {section.sectionTitle ? (
                    <View style={s.sectionContainer}>
                      <View style={s.sectionHeader}>
                        <Text style={s.sectionHeaderText}>{section.sectionTitle}</Text>
                        <View style={s.sectionHeaderLine} />
                      </View>
                      <View style={s.sectionContent}>
                        {section.items.map((item, i) => (
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
                        ))}
                      </View>
                    </View>
                  ) : (
                    section.items.map((item, i) => (
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
                  )}
                </React.Fragment>
              ));
            })()
          ) : (
            <Text style={{ textAlign: "center", color: "#6B7280" }}>
              {emptyMessage}
            </Text>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFB",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  filterContainer: {
    height: 60,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  filterScroll: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  filterBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    transition: "all 0.2s ease",
    shadowColor: "#62A89C",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: "rgba(98, 168, 156, 0.15)",
  },
  active: {
    backgroundColor: "#62A89C",
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderColor: "#62A89C",
  },
  filterText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  activeText: {
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#62A89C",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(98, 168, 156, 0.1)",
    transition: "all 0.2s ease",
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
    color: "#1F2937",
    letterSpacing: 0.2,
  },
  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 5,
    lineHeight: 19,
  },
  cardSubcategory: {
    fontSize: 12,
    color: "#62A89C",
    marginTop: 7,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  cardRegion: {
    fontSize: 12,
    color: "#62A89C",
    marginTop: 7,
    fontWeight: "600",
    letterSpacing: 0.3,
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
  sectionContainer: {
    marginTop: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#62A89C",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#62A89C",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#62A89C",
    letterSpacing: 0.5,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(98, 168, 156, 0.3)",
    borderRadius: 1,
  },
  sectionContent: {
    gap: 12,
  },
});
