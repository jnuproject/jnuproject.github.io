import { CATEGORIES } from "@/constants/categories";
import { REGIONS } from "@/constants/regions";
import { useAllAffiliates } from "@/hooks/useAffiliates";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";

// Conditionally import MapView for native vs web
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

// Web imports
let GoogleMap: any = null;
let GoogleMarker: any = null;
let useJsApiLoader: any = null;

if (Platform.OS === 'web') {
  const GoogleMapsModule = require('@react-google-maps/api');
  GoogleMap = GoogleMapsModule.GoogleMap;
  GoogleMarker = GoogleMapsModule.Marker;
  useJsApiLoader = GoogleMapsModule.useJsApiLoader;
} else {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
  PROVIDER_GOOGLE = MapModule.PROVIDER_GOOGLE;
}

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filterStep, setFilterStep] = useState<"category" | "region">("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const { data: affiliates, loading } = useAllAffiliates();
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.4996, lng: 126.5312 });

  // Load Google Maps API for web
  const { isLoaded: isGoogleMapsLoaded } = Platform.OS === 'web' && useJsApiLoader
    ? useJsApiLoader({
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      })
    : { isLoaded: true };

  // Animated bottom sheet logic
  const sheetY = useSharedValue(200);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));

  // Reserve enough space so the sheet clears the floating tab/search controls
  const navHeight = 65;
  const navBottomSpacing = Math.max(insets.bottom > 0 ? insets.bottom - 18 : 12, 8);
  const navToSheetGap = 8;
  const sheetBottomOffset = navHeight + navBottomSpacing + navToSheetGap;
  const mapBottomMargin = Platform.OS === "web" ? sheetBottomOffset + 60 : sheetBottomOffset + 20;
  const sheetPaddingBottom = 12 + navBottomSpacing;
  const topPadding = Math.max(insets.top, 16);


  const filtered = affiliates.filter(a => {
    const categoryMatch = !selectedCategory || a.category === selectedCategory;
    const regionMatch = selectedRegion === "전체" || a.region === selectedRegion;
    return categoryMatch && regionMatch;
  });

  useEffect(() => {
    // Android 네비게이션 바 숨김
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync('#E7F3F1');
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setPositionAsync('absolute');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  if (loading || (Platform.OS === 'web' && !isGoogleMapsLoaded))
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#4EA49B" />
      </SafeAreaView>
    );

  return (
    <LinearGradient
      colors={['#00a99c', '#98d2c6']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={[styles.container, { paddingTop: topPadding }]}>
        <View style={styles.regionBar}>
          <Text style={styles.filterEyebrow}>Dream Benefit Map</Text>
          <View style={styles.regionHeaderRow}>
            <Text style={styles.headerTitle}>제휴 지도</Text>
            {selectedCategory && (
              <View style={styles.selectedChip}>
                <Ionicons name="layers-outline" size={16} color="#0F172A" />
                <Text style={styles.selectedChipText}>{selectedCategory}</Text>
              </View>
            )}
          </View>
          <Text style={styles.filterSubtext}>
            {filterStep === "category"
              ? "먼저 카테고리를 선택해주세요."
              : `${selectedCategory ?? "전체"}에 해당하는 지역을 골라보세요.`}
          </Text>
          {filterStep === "category" ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.regionScroll}
            >
              {[{ title: "전체" }, ...CATEGORIES.filter((c) => c.title !== "기업제휴")].map((c) => (
                <TouchableOpacity
                  key={c.title}
                  style={styles.regionButton}
                  onPress={() => {
                    setSelectedCategory(c.title === "전체" ? null : c.title);
                    setFilterStep("region");
                  }}
                >
                  <Text style={styles.regionText}>{c.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.regionScroll}
              >
                {["전체", ...REGIONS.filter((r) => r !== "온라인/전국")].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.regionButton,
                      selectedRegion === r && styles.activeRegion,
                    ]}
                    onPress={() => setSelectedRegion(r)}
                  >
                    <Text
                      style={[
                        styles.regionText,
                        selectedRegion === r && styles.activeText,
                      ]}
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setFilterStep("category");
                  setSelectedCategory(null);
                  setSelectedRegion("전체");
                }}
              >
                <Ionicons name="refresh" size={16} color="#4EA49B" />
                <Text style={styles.resetText}>카테고리 다시 선택</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* 구글 지도 */}
      <View style={[styles.mapContainer, { marginBottom: mapBottomMargin }]}>
        {Platform.OS === 'web' ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%', borderRadius: 28 }}
            center={mapCenter}
            zoom={13}
            options={{
              styles: [
                { featureType: "poi", stylers: [{ visibility: "off" }] },
                { featureType: "transit", stylers: [{ visibility: "off" }] },
              ],
            }}
            onClick={() => {
              setSelectedStore(null);
            }}
          >
            {Array.isArray(filtered) &&
              filtered.map((store) => {
                const lat = Number(store.latitude);
                const lng = Number(store.longitude);
                if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

                return (
                  <GoogleMarker
                    key={store.id}
                    position={{ lat, lng }}
                    title={store.name}
                    onClick={() => {
                      if (selectedStore?.id === store.id) {
                        setSelectedStore(null);
                      } else {
                        setSelectedStore(store);
                        setMapCenter({ lat, lng });
                      }
                    }}
                  />
                );
              })}
          </GoogleMap>
        ) : (
          <MapView
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            style={styles.map}
            initialRegion={{
              latitude: 33.4996,
              longitude: 126.5312,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            customMapStyle={[
              { featureType: "poi", stylers: [{ visibility: "off" }] },
              { featureType: "transit", stylers: [{ visibility: "off" }] },
            ]}
            onPress={(e: any) => {
              // Only close if tapping on empty area (not a marker)
              if (!e.nativeEvent.action || e.nativeEvent.action !== 'marker-press') {
                sheetY.value = withTiming(200, { duration: 200 });
                setTimeout(() => setSelectedStore(null), 200);
              }
            }}
          >
            {Array.isArray(filtered) &&
              filtered.map((store) => {
                const lat = Number(store.latitude);
                const lng = Number(store.longitude);
                if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

                return (
                  <Marker
                    key={store.id}
                    coordinate={{ latitude: lat, longitude: lng }}
                    title={store.name}
                    description={store.benefit}
                    onPress={() => {
                      if (!store) return;

                      // 같은 마커 다시 누르면 닫기
                      if (selectedStore?.id === store.id) {
                        sheetY.value = withTiming(200, { duration: 200 });
                        setTimeout(() => setSelectedStore(null), 200);
                        return;
                      }

                      // 다른 마커 눌렀을 때는 닫지 않고 내용 교체
                      setSelectedStore(store);
                      sheetY.value = withTiming(0, { duration: 200 });
                    }}
                  />
                );
              })}
          </MapView>
        )}
      </View>

      {Platform.OS === 'web' ? (
        // Web: Fixed bottom info panel
        selectedStore && (
          <View style={[styles.webBottomInfo, { bottom: sheetBottomOffset, paddingBottom: 12 + navBottomSpacing }]}>
            <View style={styles.webBottomContent}>
              <Text style={styles.bottomTitle}>{selectedStore.name}</Text>
              <Text style={styles.bottomSubtitle}>{selectedStore.region}</Text>
              {selectedStore.address && (
                <Text style={styles.addressText} numberOfLines={2}>{selectedStore.address}</Text>
              )}

              <View style={styles.linkButtonsContainer}>
                <TouchableOpacity
                  style={styles.linkButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    const webUrl = `https://map.naver.com/v5/search/${encodeURIComponent(selectedStore.name)}`;
                    if (typeof window !== 'undefined') {
                      window.location.href = webUrl;
                    }
                  }}
                >
                  <Ionicons name="navigate-circle-outline" size={32} color="#4EA49B" />
                  <Text style={styles.linkButtonText}>네이버 지도</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    const webUrl = `https://map.kakao.com/link/search/${encodeURIComponent(selectedStore.name)}`;
                    if (typeof window !== 'undefined') {
                      window.location.href = webUrl;
                    }
                  }}
                >
                  <Ionicons name="location-outline" size={32} color="#FEE500" />
                  <Text style={styles.linkButtonText}>카카오맵</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      ) : (
        // Native: Animated bottom sheet
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle, { bottom: sheetBottomOffset }]}>
          <LinearGradient colors={["#ffffff", "#f7f7f7"]} style={[styles.gradient, { paddingBottom: sheetPaddingBottom }]}>
            <View style={styles.handleBar} />
            {selectedStore && (
              <>
                <Text style={styles.bottomTitle}>{selectedStore.name}</Text>
                <Text style={styles.bottomSubtitle}>{selectedStore.region}</Text>
                {selectedStore.address && (
                  <Text style={styles.addressText} numberOfLines={2}>{selectedStore.address}</Text>
                )}

                <View style={styles.linkButtonsContainer}>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => {
                      const naverUrl = `nmap://place?lat=${selectedStore.latitude}&lng=${selectedStore.longitude}&name=${encodeURIComponent(selectedStore.name)}&appname=com.dreamconnect`;
                      const webUrl = `https://map.naver.com/v5/search/${encodeURIComponent(selectedStore.name)}`;
                      Linking.canOpenURL(naverUrl).then(supported => {
                        if (supported) {
                          Linking.openURL(naverUrl);
                        } else {
                          Linking.openURL(webUrl);
                        }
                      });
                    }}
                  >
                    <Ionicons name="navigate-circle-outline" size={24} color="#4EA49B" />
                    <Text style={styles.linkButtonText}>네이버 지도</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => {
                      const kakaoUrl = `kakaomap://look?p=${selectedStore.latitude},${selectedStore.longitude}`;
                      const webUrl = `https://map.kakao.com/link/search/${encodeURIComponent(selectedStore.name)}`;
                      Linking.canOpenURL(kakaoUrl).then(supported => {
                        if (supported) {
                          Linking.openURL(kakaoUrl);
                        } else {
                          Linking.openURL(webUrl);
                        }
                      });
                    }}
                  >
                    <Ionicons name="location-outline" size={24} color="#FEE500" />
                    <Text style={styles.linkButtonText}>카카오맵</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </LinearGradient>
        </Animated.View>
      )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
  },
  regionBar: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.85,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 45,
    elevation: 16,
  },
  regionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  filterEyebrow: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "#E3F3F0",
    gap: 6,
  },
  selectedChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  filterSubtext: {
    marginTop: 10,
    marginBottom: 14,
    color: "#475569",
    fontSize: 13,
  },
  regionScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 10,
  },
  regionButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "rgba(148,163,184,0.3)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 4,
  },
  activeRegion: {
    backgroundColor: "#2CA69A",
    borderColor: "#2CA69A",
    shadowColor: "transparent",
    shadowOpacity: 0,
  },
  regionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  activeText: {
    color: "#FFFFFF",
  },
  resetButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "rgba(78,164,155,0.15)",
  },
  resetText: {
    color: "#2D8C82",
    fontWeight: "700",
    fontSize: 13,
  },
  mapContainer: {
    flex: 1,
    alignSelf: "stretch",
    marginTop: 20,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.85,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 45,
    elevation: 12,
  },
  map: {
    width: "100%",
    height: "100%",
    zIndex: 1,
    borderRadius: 28,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F9F7",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 28,
    elevation: 12,
    zIndex: 50,
  },
  gradient: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 18,
    backgroundColor: "rgba(255,255,255,0.98)",
  },
  handleBar: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#CBD5F5",
    marginBottom: 12,
  },
  bottomTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },
  bottomSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 8,
    lineHeight: 18,
    minHeight: 30,
  },
  linkButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 10,
  },
  linkButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(148, 163, 184, 0.25)",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
    gap: 8,
  },
  linkButtonText: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "700",
    textAlign: "center",
  },
  webListContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  webStoreCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  webStoreName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  webStoreRegion: {
    fontSize: 14,
    color: "#4EA49B",
    fontWeight: "600",
    marginBottom: 8,
  },
  webStoreAddress: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    lineHeight: 18,
  },
  webStoreBenefit: {
    fontSize: 13,
    color: "#777",
    fontStyle: "italic",
  },
  webBottomInfo: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.85,
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 28,
    elevation: 12,
    paddingHorizontal: 24,
    paddingTop: 18,
    minHeight: 160,
    zIndex: 20,
  },
  webBottomContent: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
});
