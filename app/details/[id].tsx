import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useAllAffiliates } from "../../hooks/useAffiliates";
import { getImageSource } from "@/constants/imageMap";
import * as NavigationBar from "expo-navigation-bar";
import { LinearGradient } from "expo-linear-gradient";

const ICON_COLOR = "#0F172A";
const ACCENT_COLOR = "#2CA69A";
type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function DetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data } = useAllAffiliates();
  const item = data.find((d) => d.name === decodeURIComponent(Array.isArray(id) ? id[0] : id || ""));
  const fadeAnim = useState(() => new Animated.Value(0))[0];
  const slideAnim = useState(() => new Animated.Value(50))[0];
  const encodedName = item ? encodeURIComponent(item.name) : "";

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("visible");
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      if (Platform.OS === "android") {
        NavigationBar.setVisibilityAsync("hidden");
      }
    };
  }, []);

  const handleOpenMap = (provider: "naver" | "kakao") => {
    if (!item) return;

    const webUrl =
      provider === "naver"
        ? `https://map.naver.com/v5/search/${encodedName}`
        : `https://map.kakao.com/link/search/${encodedName}`;

    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.location.href = webUrl;
      }
      return;
    }

    const nativeUrl =
      provider === "naver"
        ? `nmap://place?lat=${item.latitude}&lng=${item.longitude}&name=${encodedName}&appname=com.dreamconnect`
        : `kakaomap://look?p=${item.latitude},${item.longitude}`;

    Linking.canOpenURL(nativeUrl).then((supported) => {
      if (supported) {
        Linking.openURL(nativeUrl);
      } else {
        Linking.openURL(webUrl);
      }
    });
  };

  const InfoRow = ({ icon, label, value }: { icon: IconName; label: string; value?: string }) => {
    if (!value) return null;
    return (
      <View style={s.infoRow}>
        <View style={s.infoIcon}>
          <Ionicons name={icon} size={16} color={ICON_COLOR} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.infoLabel}>{label}</Text>
          <Text style={s.infoValue}>{value}</Text>
        </View>
      </View>
    );
  };

  if (!item) {
    return (
      <LinearGradient
        colors={["#00a99c", "#98d2c6"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <SafeAreaView style={[s.safe, s.center]} edges={["top", "left", "right"]}>
          <Text style={s.emptyText}>데이터를 찾을 수 없습니다.</Text>
          <TouchableOpacity style={s.emptyButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={s.emptyButtonText}>뒤로가기</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#00a99c", "#98d2c6"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
        <Animated.View
          style={[
            s.inner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={s.header}>
            <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={s.headerTitle}>업체 정보</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.content}
          >
            <View style={s.heroCard}>
              {item.image ? (
                <Image
                  source={getImageSource(item.image)}
                  style={s.heroImage}
                  contentFit="cover"
                />
              ) : (
                <View style={[s.heroImage, s.heroPlaceholder]}>
                  <Ionicons name="image-outline" size={36} color="#B1DBD5" />
                </View>
              )}
              <LinearGradient
                colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.75)"]}
                style={s.heroOverlay}
              />
              <View style={s.heroContent}>
                <Text style={s.heroEyebrow}>Dream Benefit</Text>
                <Text style={s.title}>{item.name}</Text>
                <View style={s.badgeRow}>
                  <View style={s.badge}>
                    <Text style={s.badgeText}>{item.category}</Text>
                  </View>
                  {item.subcategory && (
                    <View style={[s.badge, s.badgeAlt]}>
                      <Text style={[s.badgeText, s.badgeTextAlt]}>{item.subcategory}</Text>
                    </View>
                  )}
                </View>
                {item.region && (
                  <View style={s.regionChip}>
                    <Ionicons name="location-outline" size={16} color="#fff" />
                    <Text style={s.regionChipText}>{item.region}</Text>
                  </View>
                )}
              </View>
            </View>

            {(item.description || item.benefits) && (
              <View style={s.sectionCard}>
                <Text style={s.sectionTitle}>혜택 안내</Text>
                {item.description && (
                  <Text style={s.sectionBody}>{item.description}</Text>
                )}
                {item.benefits && (
                  <View style={s.highlightBox}>
                    <Ionicons name="star-outline" size={18} color="#4EA49B" />
                    <Text style={s.highlightText}>{item.benefits}</Text>
                  </View>
                )}
              </View>
            )}

            {(item.address || item.phone || item.hours || item.region) && (
              <View style={s.sectionCard}>
                <Text style={s.sectionTitle}>기본 정보</Text>
                <InfoRow icon="location-outline" label="주소" value={item.address} />
                <InfoRow icon="call-outline" label="연락처" value={item.phone} />
                <InfoRow icon="time-outline" label="운영 시간" value={item.hours} />
                <InfoRow icon="compass-outline" label="지역" value={item.region} />
              </View>
            )}

            <View style={s.mapCard}>
              <Text style={s.sectionTitle}>지도 바로가기</Text>
              <Text style={s.sectionBody}>원하는 지도 앱으로 제휴 매장을 확인해보세요.</Text>
              <View style={s.linkButtonsContainer}>
                <TouchableOpacity
                  style={s.linkButton}
                  onPress={() => handleOpenMap("naver")}
                  activeOpacity={0.85}
                >
                  <Ionicons name="navigate-circle-outline" size={26} color={ACCENT_COLOR} />
                  <Text style={s.linkButtonText}>네이버 지도</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.linkButton}
                  onPress={() => handleOpenMap("kakao")}
                  activeOpacity={0.85}
                >
                  <Ionicons name="location-outline" size={26} color={ACCENT_COLOR} />
                  <Text style={s.linkButtonText}>카카오맵</Text>
                </TouchableOpacity>
              </View>
            </View>

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
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  content: {
    paddingBottom: 80,
    gap: 20,
  },
  heroCard: {
    height: 280,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 0,
    shadowColor: "#9FD8D1",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 32,
    elevation: 14,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  heroPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F3F0",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
  },
  heroEyebrow: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  badgeAlt: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: ICON_COLOR,
  },
  badgeTextAlt: {
    color: "#FFFFFF",
  },
  regionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  regionChipText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#A5DFD6",
    shadowOpacity: 0.42,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 12,
    borderWidth: 0,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: ICON_COLOR,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  sectionBody: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  highlightBox: {
    marginTop: 4,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#ECFDF5",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  highlightText: {
    color: "#0F172A",
    fontWeight: "600",
    flex: 1,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 4,
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E2F5F1",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: "#94A3B8",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  infoValue: {
    fontSize: 15,
    color: ICON_COLOR,
    lineHeight: 22,
    fontWeight: "600",
  },
  mapCard: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 28,
    padding: 22,
    borderWidth: 0,
    shadowColor: "#A5DFD6",
    shadowOpacity: 0.42,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 12,
  },
  linkButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  linkButton: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(148, 163, 184, 0.2)",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
    gap: 8,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: ICON_COLOR,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
