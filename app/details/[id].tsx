import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useAllAffiliates } from "../../hooks/useAffiliates";
import { getImageSource } from "@/constants/imageMap";
import * as NavigationBar from "expo-navigation-bar";

export default function DetailPage() {
  const { id } = useLocalSearchParams();
  const { data } = useAllAffiliates();
  const item = data.find((d) => d.name === decodeURIComponent(Array.isArray(id) ? id[0] : id || ""));

  useEffect(() => {
    // 상세 페이지에서는 네비게이션 바 표시
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

  if (!item) {
    return (
      <SafeAreaView style={[s.safe, s.center]} edges={["top", "left", "right"]}>
        <Text>데이터를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <View style={s.inner}>
        <ScrollView>
          {item.image && (
            <Image
              source={getImageSource(item.image)}
              style={{
                width: "100%",
                height: 300,
                borderRadius: 20,
                marginBottom: 20,
                backgroundColor: "#FFFFFF",
              }}
              contentFit="contain"
            />
          )}
          <Text style={s.title}>{item.name}</Text>
          <Text style={s.meta}>
            {item.category} {item.subcategory ? `· ${item.subcategory}` : ""} · {item.region}
          </Text>

          {item.address && (
            <Text style={s.address}>{item.address}</Text>
          )}

          {item.description && (
            <Text style={s.description}>{item.description}</Text>
          )}

          <View style={s.linkButtonsContainer}>
            <TouchableOpacity
              style={s.linkButton}
              onPress={() => {
                const webUrl = `https://map.naver.com/v5/search/${encodeURIComponent(item.name)}`;

                if (Platform.OS === 'web') {
                  // Web: Direct navigation
                  if (typeof window !== 'undefined') {
                    window.location.href = webUrl;
                  }
                } else {
                  // Native: Try app deep link first, fallback to web
                  const naverUrl = `nmap://place?lat=${item.latitude}&lng=${item.longitude}&name=${encodeURIComponent(item.name)}&appname=com.dreamconnect`;
                  Linking.canOpenURL(naverUrl).then(supported => {
                    if (supported) {
                      Linking.openURL(naverUrl);
                    } else {
                      Linking.openURL(webUrl);
                    }
                  });
                }
              }}
            >
              <Ionicons name="navigate-circle-outline" size={28} color="#4EA49B" />
              <Text style={s.linkButtonText}>네이버 지도</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.linkButton}
              onPress={() => {
                const webUrl = `https://map.kakao.com/link/search/${encodeURIComponent(item.name)}`;

                if (Platform.OS === 'web') {
                  // Web: Direct navigation
                  if (typeof window !== 'undefined') {
                    window.location.href = webUrl;
                  }
                } else {
                  // Native: Try app deep link first, fallback to web
                  const kakaoUrl = `kakaomap://look?p=${item.latitude},${item.longitude}`;
                  Linking.canOpenURL(kakaoUrl).then(supported => {
                    if (supported) {
                      Linking.openURL(kakaoUrl);
                    } else {
                      Linking.openURL(webUrl);
                    }
                  });
                }
              }}
            >
              <Ionicons name="location-outline" size={28} color="#FEE500" />
              <Text style={s.linkButtonText}>카카오맵</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  desc: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  address: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
    lineHeight: 20,
  },
  description: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  linkButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 30,
    gap: 12,
  },
  linkButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 16,
    paddingHorizontal: 10,
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
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
});