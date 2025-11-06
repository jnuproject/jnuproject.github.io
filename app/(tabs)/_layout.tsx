import { useAllAffiliates } from "@/hooks/useAffiliates";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Slot, usePathname, useRouter } from "expo-router";
import React, { useState } from "react";
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
        <View style={[styles.tabBarContainer, { bottom: navBottomSpacing }]}>
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
          style={[styles.searchButton, { bottom: navBottomSpacing }]}
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
            <TextInput
              style={styles.input}
              placeholder="검색어를 입력하세요..."
              placeholderTextColor="#999"
              autoFocus
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {/* 검색 결과 */}
            <ScrollView style={{ marginTop: 15 }}>
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
                    <Text style={styles.resultText}>{item.name}</Text>
                  </Pressable>
                ))
              ) : (
                <Text style={styles.noResult}>검색 결과가 없습니다.</Text>
              )}
            </ScrollView>

            {/* 닫기 버튼 */}
            <Pressable
              onPress={() => {
                setSearchQuery("");
                setShowSearch(false);
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#4EA49B" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
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
    position: "absolute",
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 6,
    maxHeight: "70%",
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    color: "#333",
  },
  resultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  noResult: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
});
