import { CATEGORIES } from "@/constants/categories";
import { getImageSource, isLogoImage } from "@/constants/imageMap";
import { useAllAffiliates } from "@/hooks/useAffiliates";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";

export default function HomeScreen() {
  const router = useRouter();
  const { data: affiliates } = useAllAffiliates();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Android 네비게이션 바 숨김
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync('#E7F3F1');
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setPositionAsync('absolute');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {/* 헤더 */}
        <View style={s.header}>
          <View style={s.heroCard}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={s.heroLogo}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel="Dream 로고"
            />
            <Text style={s.heroCaption}>제주대학교 58대 DREAM 총학생회 선거운동본부</Text>
          </View>
        </View>

        {/* 카테고리 */}
        <Text style={[s.sectionTitle, s.sectionSpacing]}>카테고리</Text>
        <View style={s.categoryGrid}>
          {[{ title: "전체" }, ...CATEGORIES].map((category) => (
            <TouchableOpacity
              key={category.title}
              style={s.categoryWrapper}
              activeOpacity={0.85}
              onPress={() => router.push(`../category/${encodeURIComponent(category.title)}`)}
            >
              <View style={s.categoryCard}>
                {category.title === "전체" && <Ionicons name="grid-outline" size={38} color="#10B981" />}
                {category.title === "음식점" && <Ionicons name="restaurant-outline" size={38} color="#F59E0B" />}
                {category.title === "카페・베이커리" && <Ionicons name="cafe-outline" size={38} color="#3B82F6" />}
                {category.title === "문화생활・복지" && <Ionicons name="musical-notes-outline" size={38} color="#8B5CF6" />}
                {category.title === "미용・뷰티・패션" && <Ionicons name="cut-outline" size={38} color="#F472B6" />}
                {category.title === "레저・스포츠" && <Ionicons name="basketball-outline" size={38} color="#14B8A6" />}
                {category.title === "기업제휴" && <Ionicons name="briefcase-outline" size={38} color="#6366F1" />}
                {category.title === "교육" && <Ionicons name="school-outline" size={38} color="#0EA5E9" />}
              </View>
              <Text style={s.categoryText}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 기업 제휴 */}
        <View style={[s.sectionDivider, s.sectionDividerTight]} />
        <Text style={[s.sectionTitle, s.sectionSpacingTight]}>기업 제휴</Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={Platform.OS === 'web' ? undefined : undefined}
          style={s.majorSlider}
          onScroll={(event) => {
            const slideWidth = Dimensions.get('window').width;
            const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
            setCurrentSlide(index);
          }}
          scrollEventThrottle={16}
        >
          {affiliates
            .filter(item => item.category === "기업제휴")
            .sort(() => 0.5 - Math.random())
            .slice(0, 5)
            .map((item, i) => (
              <TouchableOpacity
                key={`major-${item.name}-${i}`}
                style={s.majorSlide}
                activeOpacity={0.95}
                onPress={() => router.push(`../details/${encodeURIComponent(item.name)}`)}
              >
                <View style={s.majorCard}>
                  <Image
                    source={getImageSource(item.image)}
                    style={s.majorImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                    style={s.majorOverlay}
                  >
                    <Text style={s.majorTitle}>{item.name}</Text>
                    {item.description && (
                      <Text style={s.majorBenefits}>{item.description}</Text>
                    )}
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* 페이지 인디케이터 */}
        <View style={s.pageIndicator}>
          {[0, 1, 2, 3, 4].map((index) => (
            <View
              key={index}
              style={[
                s.dot,
                currentSlide === index && s.activeDot
              ]}
            />
          ))}
        </View>

        {/* 추천 제휴 */}
        <View style={[s.sectionDivider, s.sectionDividerTight]} />
        <Text style={[s.sectionTitle, s.sectionSpacingTight]}>추천 제휴</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={170}
          decelerationRate="fast"
          contentContainerStyle={s.recommendRow}
        >
          {affiliates
            .filter(item => item.category !== "기업제휴")
            .sort(() => 0.5 - Math.random())
            .slice(0, 5)
            .map((item, i) => (
              <TouchableOpacity
                key={`${item.name}-${i}`}
                style={[s.recommendCardHorizontal, i === 4 && { marginRight: 0 }]}
                activeOpacity={0.9}
                onPress={() => router.push(`../details/${encodeURIComponent(item.name)}`)}
              >
                <Image
                  source={getImageSource(item.image)}
                  style={s.recommendImage}
                  contentFit={isLogoImage(item.image) ? "contain" : "cover"}
                />
                <Text style={s.recommendTitle}>{item.name}</Text>
                <Text style={s.recommendDesc}>{item.category}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* SNS */}
        <View style={[s.sectionDivider, s.sectionDividerTight]} />
        <View style={[s.sectionHeaderCenter, s.sectionSpacingTight]}>
          <Text style={[s.sectionTitle, s.sectionTitleCenter]}>DREAM 공식 SNS</Text>
          <Text style={s.sectionSubtitle}>제주대학교 58대 DREAM 총학생회 선거운동본부</Text>
        </View>
        <View style={s.snsContainer}>
          <TouchableOpacity
            style={[s.snsButtonWide, { backgroundColor: "#E1306C" }]}
            activeOpacity={0.8}
            onPress={() => {
              if (Platform.OS === 'web' && typeof window !== 'undefined') {
                window.location.href = "https://www.instagram.com/jnu_dream_2026?igsh=MWd4MXQxbDBzbWwzbA==";
              } else {
                router.push("https://www.instagram.com/jnu_dream_2026?igsh=MWd4MXQxbDBzbWwzbA==");
              }
            }}
          >
            <Ionicons name="logo-instagram" size={32} color="#fff" />
            <Text style={s.snsTextWide}>DREAM 인스타그램</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.snsButtonWide, { backgroundColor: "#FEE500" }]}
            activeOpacity={0.8}
            onPress={() => {
              if (Platform.OS === 'web' && typeof window !== 'undefined') {
                window.location.href = "https://tr.ee/Fp6OL6ZuO6";
              } else {
                router.push("https://tr.ee/Fp6OL6ZuO6");
              }
            }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={32} color="#3C1E1E" />
            <Text style={s.snsTextWide}>DREAM 카카오톡</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  header: {
    paddingTop: 28,
    paddingBottom: 18,
  },
  heroCard: {
    width: "100%",
    backgroundColor: "#ECFDF5",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 6,
  },
  heroLogo: {
    width: 200,
    height: 56,
  },
  heroCaption: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 22,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  sectionTitleCenter: {
    textAlign: "center",
  },
  sectionSpacing: {
    marginTop: 32,
  },
  sectionSpacingTight: {
    marginTop: 14,
  },
  sectionHeaderCenter: {
    alignItems: "center",
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 20,
    columnGap: 12,
  },
  categoryWrapper: {
    width: "22%",
    alignItems: "center",
  },
  categoryCard: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  categoryText: {
    color: "#1F2937",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 12,
  },
  recommendRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  recommendCardHorizontal: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 7,
    elevation: 5,
  },
  recommendImage: {
    width: "100%",
    height: 110,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
  },
  recommendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  recommendDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  snsContainer: {
    alignItems: "center",
    gap: 16,
    marginBottom: 40,
  },
  snsButtonWide: {
    width: "90%",
    height: 80,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  snsTextWide: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  sectionDivider: {
    height: 12,
    backgroundColor: "#F3F4F6",
    marginVertical: 36,
    marginHorizontal: -20,
  },
  sectionDividerTight: {
    marginVertical: 16,
  },
  majorSlider: {
    marginHorizontal: -20,
  },
  majorSlide: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
  },
  majorCard: {
    width: '100%',
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  majorImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  majorOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 80,
    justifyContent: 'flex-end',
  },
  majorTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  majorBenefits: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    backgroundColor: '#4EA49B',
    width: 24,
    borderRadius: 4,
  },
});
