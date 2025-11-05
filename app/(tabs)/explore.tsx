import { CATEGORIES } from "@/constants/categories";
import { REGIONS } from "@/constants/regions";
import affiliatesData from "@/data/affiliates.json";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.4996, lng: 126.5312 });

  // Load Google Maps API for web
  const { isLoaded: isGoogleMapsLoaded } = Platform.OS === 'web' && useJsApiLoader
    ? useJsApiLoader({
        googleMapsApiKey: "AIzaSyDt7ieN0wG23Zy5ZCuxg0pjHNqowquaZHI",
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

  useEffect(() => {
    setAffiliates(affiliatesData);
    setLoading(false);
  }, []);

  const filtered = affiliates.filter(a => {
    const categoryMatch = !selectedCategory || a.category === selectedCategory;
    const regionMatch = selectedRegion === "전체" || a.region === selectedRegion;
    return categoryMatch && regionMatch;
  });

  if (loading || (Platform.OS === 'web' && !isGoogleMapsLoaded))
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#4EA49B" />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 필터 (고정) */}
      <SafeAreaView edges={["top"]} style={styles.regionBar}>
        <Text style={styles.headerTitle}>제휴 지도</Text>
        {filterStep === "category" ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.regionScroll}
          >
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c.title}
                style={styles.regionButton}
                onPress={() => {
                  setSelectedCategory(c.title);
                  setFilterStep("region");
                }}
              >
                <Text style={styles.regionText}>{c.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.regionScroll}
              style={{ flex: 1 }}
            >
              {["전체", ...REGIONS].map((r) => (
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
              onPress={() => {
                setFilterStep("category");
                setSelectedRegion("전체");
              }}
              style={{ paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Text style={{ color: "#4EA49B", fontWeight: "600" }}>카테고리 변경</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>

      {/* 구글 지도 */}
      <View style={[styles.mapContainer, { marginBottom: mapBottomMargin }]}>
        {Platform.OS === 'web' ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%', borderRadius: 20 }}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    textAlign: "left",
    marginTop: Platform.OS === "ios" ? 16 : 12,
    marginBottom: 10,
    marginLeft: 16,
  },
  regionBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    paddingVertical: 6,
    borderBottomWidth: 0,
    shadowColor: "transparent",
    elevation: 0,
  },
  regionScroll: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  regionButton: {
    paddingHorizontal: 18,
    height: 40,
    backgroundColor: "rgba(240,242,241,0.95)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  activeRegion: {
    backgroundColor: "#4EA49B",
    shadowOpacity: 0.15,
  },
  regionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  mapContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 110 : 100, // Adjust for header and filter bar height
    marginBottom: Platform.OS === "web" ? 160 : 140,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 6,
    elevation: 10,
    zIndex: 50,
  },
  gradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  handleBar: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginBottom: 12,
  },
  bottomTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  bottomSubtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    lineHeight: 18,
    minHeight: 30,
  },
  linkButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 4,
    gap: 6,
  },
  linkButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  linkButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginTop: 8,
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
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 6,
    elevation: 10,
    padding: 20,
    paddingBottom: 20,
    minHeight: 160,
    zIndex: 20,
  },
  webBottomContent: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
});
