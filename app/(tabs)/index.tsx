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
  const CATEGORY_ICON_COLOR = "#2CA69A";
  const CATEGORY_ICON_MAP: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
    "전체": "grid-outline",
    "음식점": "restaurant-outline",
    "카페・베이커리": "cafe-outline",
    "문화생활・복지": "musical-notes-outline",
    "미용・뷰티・패션": "cut-outline",
    "레저・스포츠": "basketball-outline",
    "기업제휴": "briefcase-outline",
    "교육": "school-outline",
  };
  const SOCIAL_LINKS = [
    {
      title: "DREAM 인스타그램",
      icon: "logo-instagram" as const,
      url: "https://www.instagram.com/jnu_dream_2026?igsh=MWd4MXQxbDBzbWwzbA==",
      gradient: ["#8EC5FC", "#3BA99F"],
    },
    {
      title: "DREAM 카카오톡",
      icon: "chatbubble-ellipses-outline" as const,
      url: "https://tr.ee/Fp6OL6ZuO6",
      gradient: ["#6FE3C4", "#30B89F"],
    },
  ];
  const router = useRouter();
  const { data: affiliates } = useAllAffiliates();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileSafari, setIsMobileSafari] = useState(false);
  const [carouselWidth, setCarouselWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    // Android 네비게이션 바 숨김
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync('#E7F3F1');
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setPositionAsync('absolute');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof navigator === 'undefined') {
      return;
    }

    const vendor = navigator.vendor || '';
    const userAgent = navigator.userAgent || '';
    const hasTouch =
      typeof navigator.maxTouchPoints === 'number'
        ? navigator.maxTouchPoints > 0
        : /Mobile|iP(hone|od|ad)/i.test(userAgent);
    const isAppleVendor = vendor.includes('Apple');
    const isiOSFamily = /iP(hone|od|ad)/i.test(userAgent) || (isAppleVendor && hasTouch);
    const isSafariEngine = /Safari/i.test(userAgent) && !/CriOS/i.test(userAgent) && !/FxiOS/i.test(userAgent);

    setIsMobileSafari(Boolean(isiOSFamily && isSafariEngine && isAppleVendor));
  }, []);

  const scrollContainerStyles = [s.scrollContent, isMobileSafari && s.scrollContentSafari];

  const openExternalLink = (url: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = url;
    } else {
      router.push(url);
    }
  };

  const pageContent = (
    <>
      {/* 헤더 */}
      <View style={s.header}>
        <View style={s.logoContainer}>
          <Image
            source={require("../../assets/images/logo-white.png")}
            style={s.logo}
            contentFit="contain"
            transition={0}
            placeholder={null}
            accessibilityRole="image"
            accessibilityLabel="Dream 로고"
          />
        </View>
      </View>

      {/* 카테고리 */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>카테고리</Text>
        <View style={s.categoryGrid}>
          {[{ title: "전체" }, ...CATEGORIES].map((category) => (
            <TouchableOpacity
              key={category.title}
              style={s.categoryWrapper}
              activeOpacity={0.85}
              onPress={() => router.push(`../category/${encodeURIComponent(category.title)}`)}
            >
              <View style={s.categoryCard}>
                {CATEGORY_ICON_MAP[category.title] && (
                  <Ionicons
                    name={CATEGORY_ICON_MAP[category.title]}
                    size={38}
                    color={CATEGORY_ICON_COLOR}
                  />
                )}
              </View>
              <Text style={s.categoryText} numberOfLines={1}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 기업 제휴 */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>기업 제휴</Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={Platform.OS === 'web' ? undefined : undefined}
          style={s.majorSlider}
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;
            if (width > 0 && width !== carouselWidth) {
              setCarouselWidth(width);
            }
          }}
          onScroll={(event) => {
            const slideWidth = carouselWidth || Dimensions.get('window').width;
            if (!slideWidth) {
              return;
            }
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
              style={[s.majorSlide, { width: carouselWidth }]}
              activeOpacity={0.95}
              onPress={() => router.push(`../details/${encodeURIComponent(item.name)}`)}
            >
              <View style={s.majorCard}>
                <Image
                  source={getImageSource(item.image)}
                  style={s.majorImage}
                  contentFit="contain"
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
      </View>

      {/* 실시간 제휴 */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>실시간 제휴</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={170}
        decelerationRate="fast"
        contentContainerStyle={s.recommendRow}
      >
        {affiliates
          .filter(item => item.isRealtime === true)
          .map((item, i) => (
            <TouchableOpacity
              key={`realtime-${item.name}-${i}`}
              style={[s.recommendCardHorizontal, i === 0 && { marginRight: 0 }]}
              activeOpacity={0.9}
              onPress={() => router.push(`../details/${encodeURIComponent(item.name)}`)}
            >
              <View style={s.realtimeBadge}>
                <Text style={s.realtimeBadgeText}>지금 진행 중</Text>
              </View>
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
      </View>

      {/* 추천 제휴 */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>추천 제휴</Text>
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
      </View>

      {/* SNS */}
      <View style={s.sectionCard}>
        <Text style={[s.sectionTitle, s.sectionTitleCenter]}>DREAM 공식 SNS</Text>
        <Text style={s.sectionSubtitle}>제주대학교 58대 DREAM 총학생회 선거운동본부</Text>
        <View style={s.snsContainer}>
          {SOCIAL_LINKS.map((link) => (
            <TouchableOpacity
              key={link.title}
              style={s.snsCard}
              activeOpacity={0.88}
              onPress={() => openExternalLink(link.url)}
            >
              <LinearGradient colors={link.gradient} style={s.snsCardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={s.snsCardHeader}>
                  <Ionicons name={link.icon} size={30} color="#FFFFFF" />
                  <View style={s.snsBadge}>
                    <Text style={s.snsBadgeText}>공식</Text>
                  </View>
                </View>
                <Text style={s.snsCardTitle}>{link.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 참조사항 */}
      <View style={s.footerNote}>
        <Text style={s.footerNoteText}>
          ※ 본 앱은 앱 개발 및 2025년 이후 지속적인 운영 가능성을 입증하기 위해 제작되었습니다.
        </Text>
      </View>
    </>
  );

  return (
    <LinearGradient
      colors={['#00a99c', '#98d2c6']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={[s.safe, isMobileSafari && s.safeSafari]} edges={['left', 'right']}>
        {isMobileSafari ? (
          <View style={scrollContainerStyles}>{pageContent}</View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={scrollContainerStyles}
            scrollEventThrottle={16}
          >
            {pageContent}
          </ScrollView>
        )}
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
  safeSafari: {
    flex: undefined,
    flexGrow: 0,
    alignSelf: "stretch",
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 28,
    paddingBottom: 60,
  },
  scrollContentSafari: {
    width: "100%",
  },
  header: {
    paddingTop: Platform.OS === "web" ? 28 : 0,
    paddingBottom: 18,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    maxWidth: 220,
    height: 64,
  },
  heroCaption: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
    lineHeight: 24,
    marginTop: 14,
    letterSpacing: -0.2,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    marginTop: 20,
    shadowColor: "#FFFFFF",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 60,
    elevation: 20,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  sectionTitleCenter: {
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
    letterSpacing: -0.2,
    lineHeight: 18,
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
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  categoryText: {
    color: "#334155",
    fontWeight: "700",
    fontSize: 11.5,
    marginTop: 14,
    letterSpacing: -0.2,
    textAlign: "center",
    width: "100%",
    lineHeight: 16,
  },
  recommendRow: {
    paddingLeft: 0,
    paddingRight: 24,
    paddingBottom: 0,
  },
  recommendCardHorizontal: {
    width: 150,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  recommendImage: {
    width: "100%",
    height: 110,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    marginBottom: 14,
    padding: 12,
  },
  recommendTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  recommendDesc: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
    letterSpacing: -0.1,
    lineHeight: 18,
  },
  realtimeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#2CA69A",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  realtimeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  snsContainer: {
    flexDirection: "column",
    gap: 14,
    marginTop: 10,
  },
  snsCard: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#38B5AB",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 10,
  },
  snsCardGradient: {
    padding: 22,
    borderRadius: 24,
  },
  snsCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  snsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
  },
  snsBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  snsCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  majorSlider: {
    marginHorizontal: -24,
    marginBottom: -24,
  },
  majorSlide: {
    paddingHorizontal: 24,
  },
  majorCard: {
    width: '100%',
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 10,
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
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  majorBenefits: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 26,
    letterSpacing: -0.2,
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
    backgroundColor: '#62A89C',
    width: 24,
    borderRadius: 4,
  },
  footerNote: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  footerNoteText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
