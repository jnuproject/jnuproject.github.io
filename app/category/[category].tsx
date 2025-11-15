import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated, NativeScrollEvent, NativeSyntheticEvent, LayoutChangeEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAllAffiliates } from "../../hooks/useAffiliates";
import * as NavigationBar from "expo-navigation-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function CategoryScreen() {
  const { category } = useLocalSearchParams();
  const categoryTitle = typeof category === "string" ? category : Array.isArray(category) ? category[0] : "전체";
  const [selectedSub, setSelectedSub] = useState("전체");
  const router = useRouter();
  const { data } = useAllAffiliates();
  const fadeAnim = useState(() => new Animated.Value(0))[0];
  const filterAnim = useRef(new Animated.Value(0)).current;
  const scrollOffset = useRef(0);
  const filterHidden = useRef(false);
  const [filterHeight, setFilterHeight] = useState(0);
  const SCROLL_THRESHOLD = 20;

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
    "신제주", "애월, 한림", "구좌, 조천, 함덕", "서귀포", "성산, 표선"
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

  const animateFilterBar = (hide: boolean) => {
    Animated.timing(filterAnim, {
      toValue: hide ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const delta = offsetY - scrollOffset.current;

    if (delta > SCROLL_THRESHOLD && !filterHidden.current && offsetY > 0) {
      filterHidden.current = true;
      animateFilterBar(true);
    } else if ((delta < -SCROLL_THRESHOLD || offsetY <= 12) && filterHidden.current) {
      filterHidden.current = false;
      animateFilterBar(false);
    }

    scrollOffset.current = offsetY;
  };

  const handleFilterLayout = (event: LayoutChangeEvent) => {
    if (filterHeight === 0) {
      setFilterHeight(event.nativeEvent.layout.height);
    }
  };

  const filterWrapperStyle =
    filterHeight > 0
      ? {
          height: filterAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [filterHeight, 0],
          }),
          marginBottom: filterAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [4, 0],
          }),
          opacity: filterAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        }
      : undefined;

  return (
    <LinearGradient
      colors={['#00a99c', '#98d2c6']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={s.safe}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* 헤더 with 뒤로가기 버튼 */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{categoryTitle}</Text>
          <View style={{ width: 40 }} />
        </View>
        {/* 상단 필터 */}
        <Animated.View style={[s.filterWrapper, filterWrapperStyle]}>
          <View style={s.filterContainer} onLayout={handleFilterLayout}>
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
        </Animated.View>

        {/* 리스트 */}
        <ScrollView
          style={s.list}
          contentContainerStyle={[
            s.listContent,
            filtered.length === 0 && { flex: 1, justifyContent: "center", alignItems: "center" },
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
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
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  filterWrapper: {
    overflow: "hidden",
    marginBottom: 4,
  },
  filterContainer: {
    paddingVertical: 8,
  },
  filterScroll: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  filterBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.28)",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    shadowColor: "#000000",
    shadowOpacity: Platform.OS === "android" ? 0.08 : 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 0,
    gap: 6,
  },
  active: {
    backgroundColor: "rgba(255,255,255,0.92)",
    transform: [{ scale: 1.02 }],
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 25,
    elevation: 8,
  },
  filterText: {
    fontSize: 14,
    color: "#F3FAF9",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  activeText: {
    color: "#256355",
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: "#A5DFD6",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 28,
    elevation: 12,
    borderWidth: 0,
    transition: "all 0.2s ease",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D4F0EC",
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
    color: "#4EA49B",
    marginTop: 7,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  cardRegion: {
    fontSize: 12,
    color: "#4EA49B",
    marginTop: 7,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 20,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.94)",
    shadowColor: "#9CD9CF",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 32,
    elevation: 10,
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
    color: "#4EA49B",
    letterSpacing: 0.5,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 2,
    backgroundColor: "rgba(78, 164, 155, 0.4)",
    borderRadius: 1,
  },
  sectionContent: {
    gap: 12,
  },
});
