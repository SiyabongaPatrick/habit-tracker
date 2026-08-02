import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function HabitCard({ habit, onPress, onTogglePress, doneToday }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[styles.colorDot, { backgroundColor: habit.color }]} />
      <View style={styles.info}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.streak}>
          🔥 {habit.current_streak} day streak · best {habit.longest_streak}
        </Text>
      </View>
      <Pressable
        onPress={onTogglePress}
        style={[styles.checkButton, doneToday && { backgroundColor: habit.color }]}
      >
        <Text style={[styles.checkMark, doneToday && { color: "#fff" }]}>✓</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#111827" },
  streak: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: { fontSize: 16, color: "#D1D5DB", fontWeight: "700" },
});
