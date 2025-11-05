import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { REGIONS } from "../../constants/regions";

export default function RegionSelector({
  selected, onSelect
}: { selected: string; onSelect: (region: string) => void }) {
  return (
    <View style={s.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {REGIONS.map((r) => {
          const active = selected === r;
          return (
            <Pressable key={r} onPress={() => onSelect(r)} style={[s.btn, active ? s.btnActive : s.btnIdle]}>
              <Text style={[s.text, active ? s.textActive : s.textIdle]}>{r}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingVertical: 10, paddingHorizontal: 12 },
  btn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  btnIdle: { backgroundColor: "#F2F4F3" },
  btnActive: { backgroundColor: "#4EA49B" },
  text: { fontSize: 13, fontWeight: "700" },
  textIdle: { color: "#374151" },
  textActive: { color: "#fff" }
});