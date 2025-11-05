import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = { title: string; icon?: string };

export default function CategoryButton({ title }: Props) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(`/category/${encodeURIComponent(title)}`)} style={s.wrap}>
      {/* 아이콘은 디자인 시안 느낌만 유지 (심플 원형 배경) */}
      <View style={s.iconBubble} />
      <Text style={s.label} numberOfLines={1}>{title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#F6F9F8",
    borderRadius: 16,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  iconBubble: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#C7E2DB"
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    paddingHorizontal: 6
  }
});