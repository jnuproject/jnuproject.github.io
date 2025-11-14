import { useAllAffiliates } from "@/hooks/useAffiliates";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Slot, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSafari, setIsMobileSafari] = useState(false);
  const [safariToolbarOffset, setSafariToolbarOffset] = useState(0);
  const [showTabBar, setShowTabBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const navBottomSpacing = Math.max(insets.bottom > 0 ? insets.bottom - 18 : 12, 8);
  const { data: affiliates } = useAllAffiliates();

  // 검색 필터 로직
  const filtered = affiliates.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isHome = pathname === "/index" || pathname === "/";
  const isExplore = pathname === "/explore";

  // 스크롤 방향 감지 (웹 전용)
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // 스크롤이 최상단에 있으면 항상 보이기
          if (currentScrollY <= 0) {
            setShowTabBar(true);
          }
          // 아래로 스크롤 (50px 이상 이동시)
          else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setShowTabBar(false);
          }
          // 위로 스크롤
          else if (currentScrollY < lastScrollY) {
            setShowTabBar(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof navigator === "undefined") {
      return;
    }

    const vendor = navigator.vendor || "";
    const userAgent = navigator.userAgent || "";
    const isAppleVendor = vendor.includes("Apple");
    const hasTouch =
      typeof navigator.maxTouchPoints === "number"
        ? navigator.maxTouchPoints > 0
        : /Mobile|iP(hone|od|ad)/i.test(userAgent);
    const isiOSFamily = /iP(hone|od|ad)/i.test(userAgent) || (isAppleVendor && hasTouch);
    const isSafariEngine = /Safari/i.test(userAgent) && !/CriOS/i.test(userAgent) && !/FxiOS/i.test(userAgent);
    const detectedMobileSafari = Boolean(isiOSFamily && isAppleVendor && isSafariEngine);

    setIsMobileSafari(detectedMobileSafari);

    if (!detectedMobileSafari || typeof window === "undefined" || !window.visualViewport) {
      return;
    }

    const viewport = window.visualViewport;

    const updateToolbarOffset = () => {
      const baseHeight = window.innerHeight || viewport.height;
      const difference = baseHeight - viewport.height - viewport.offsetTop;
      setSafariToolbarOffset(Math.max(0, difference));
    };

    updateToolbarOffset();

    viewport.addEventListener("resize", updateToolbarOffset);
    viewport.addEventListener("scroll", updateToolbarOffset);
    window.addEventListener("orientationchange", updateToolbarOffset);

    return () => {
      viewport.removeEventListener("resize", updateToolbarOffset);
      viewport.removeEventListener("scroll", updateToolbarOffset);
      window.removeEventListener("orientationchange", updateToolbarOffset);
    };
  }, []);

  const dynamicBottomSpacing = navBottomSpacing + (isMobileSafari ? safariToolbarOffset : 0);

  const handlePress = (side) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (side === "left") router.push("/");
    else if (side === "center") router.push("/explore");
  };

  return (
    <>
      <Slot />
      {/* Custom Bottom Tab Bar & Search Button */}
      <>
        <View style={[
          styles.tabBarContainer,
          {
            bottom: dynamicBottomSpacing,
            transform: [{ translateY: showTabBar ? 0 : 150 }],
            opacity: showTabBar ? 1 : 0,
          }
        ]}>
          <View style={styles.tabBarBlur}>
            <View style={{ flex: 1, flexDirection: "row", position: "relative" }}>
              <Pressable
                style={styles.tabZone}
                onPress={() => handlePress("left")}
              >
                <View style={[styles.tabInner, isHome && styles.tabActive]}>
                  <Ionicons
                    name={isHome ? "home" : "home-outline"}
                    size={24}
                    color={isHome ? "#4EA49B" : "#9CA3AF"}
                  />
                  <Text style={[styles.tabLabel, { color: isHome ? "#4EA49B" : "#9CA3AF" }]}>홈</Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.tabZone}
                onPress={() => handlePress("center")}
              >
                <View style={[styles.tabInner, isExplore && styles.tabActive]}>
                  <Ionicons
                    name={isExplore ? "map" : "map-outline"}
                    size={24}
                    color={isExplore ? "#4EA49B" : "#9CA3AF"}
                  />
                  <Text style={[styles.tabLabel, { color: isExplore ? "#4EA49B" : "#9CA3AF" }]}>지도</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 검색 버튼 */}
        <Pressable
          style={[
            styles.searchButton,
            {
              bottom: dynamicBottomSpacing,
              transform: [{ translateY: showTabBar ? 0 : 150 }],
              opacity: showTabBar ? 1 : 0,
            }
          ]}
          onPress={() => setShowSearch(true)}
          android_ripple={{ color: "rgba(255,255,255,0.3)", borderless: true }}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={28} color="#fff" />
        </Pressable>
      </>

      {/* 검색 모달 */}
      <Modal visible={showSearch} animationType="fade" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? -100 : 0}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>제휴 검색</Text>
              <Text style={styles.modalSubtitle}>찾고 싶은 매장 이름을 입력해주세요.</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="search" size={20} color="#4EA49B" />
              <TextInput
                style={styles.input}
                placeholder="검색어를 입력하세요..."
                placeholderTextColor="#94A3B8"
                autoFocus
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView style={styles.resultList} showsVerticalScrollIndicator={false}>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.resultItem}
                    onPress={() => {
                      setShowSearch(false);
                      router.push(`/details/${encodeURIComponent(item.name)}`);
                    }}
                  >
                    <View>
                      <Text style={styles.resultName}>{item.name}</Text>
                      {item.region && <Text style={styles.resultMeta}>{item.region}</Text>}
                    </View>
                    <Ionicons name="arrow-forward" size={18} color="#0F172A" />
                  </Pressable>
                ))
              ) : (
                <View style={styles.noResultCard}>
                  <Ionicons name="information-circle-outline" size={18} color="#4EA49B" />
                  <Text style={styles.noResult}>검색 결과가 없습니다.</Text>
                </View>
              )}
            </ScrollView>

            <Pressable
              onPress={() => {
                setSearchQuery("");
                setShowSearch(false);
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 30,
    right: 130,
    bottom: 25,
    height: 65,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
    zIndex: 10,
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
  },
  tabBarBlur: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 50,
    overflow: "hidden",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabZone: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    transform: [{ translateY: -2 }],
  },
  tabInner: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "transparent",
    transition: "all 0.2s ease-in-out",
    overflow: "hidden",
  },
  tabActive: {
    backgroundColor: "rgba(78,164,155,0.15)",
    transform: [{ scale: 1.05 }],
    marginHorizontal: 8, // add gap between highlight and outer edge
    overflow: "hidden",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  searchButton: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    bottom: 25,
    right: 40,
    backgroundColor: "rgba(78, 164, 155, 0.9)",
    borderRadius: 50,
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
    zIndex: 11,
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(8, 25, 32, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 28,
    padding: 24,
    elevation: 12,
    maxHeight: "75%",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 50,
  },
  modalHeader: {
    gap: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.4)",
    marginTop: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
    paddingVertical: 0,
  },
  resultList: {
    marginTop: 18,
    width: "100%",
  },
  resultItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  resultMeta: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
  noResultCard: {
    marginTop: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.3)",
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  noResult: {
    textAlign: "center",
    color: "#64748B",
    fontWeight: "600",
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 8,
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#4EA49B",
    shadowColor: "#4EA49B",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
});
