import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CORPORATE_SUBCATEGORIES } from "../../constants/subcategories";

export default function SubCategorySelector({
  selected, onSelect
}: { selected: string; onSelect: (sub: string) => void }) {
  return (
    <View style={s.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[ "전체", ...CORPORATE_SUBCATEGORIES ].map((sub) => {
          const active = selected === sub;
          return (
            <Pressable key={sub} onPress={() => onSelect(sub)} style={[s.btn, active ? s.btnActive : s.btnIdle]}>
              <Text style={[s.text, active ? s.textActive : s.textIdle]}>{sub}</Text>
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