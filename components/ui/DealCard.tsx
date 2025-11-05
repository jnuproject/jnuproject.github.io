import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Affiliate } from "../../types/affiliate";

export default function DealCard(props: Affiliate) {
  const router = useRouter();
  const { id, name, benefit, image } = props;

  return (
    <Pressable onPress={() => router.push(`/details/${id}`)} style={s.card}>
      <Image source={{ uri: image }} style={s.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={s.title} numberOfLines={1}>{name}</Text>
        <Text style={s.desc} numberOfLines={1}>{benefit}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  thumb: {
    width: 64, height: 64, borderRadius: 12, marginRight: 12, backgroundColor: "#E5E7EB"
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  desc: { fontSize: 13, color: "#6B7280", marginTop: 4 }
});