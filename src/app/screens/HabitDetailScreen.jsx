import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { getHabits, toggleLog, deleteHabit } from "../../api/habits";
import HeatmapCalendar from "../../components/HeatmapCalendar";

export default function HabitDetailScreen() {
  const { habitId } = useLocalSearchParams();
  const [habit, setHabit] = useState(null);

  const loadHabit = useCallback(async () => {
    const habits = await getHabits();
    const found = habits.find((h) => h.id === habitId);
    setHabit(found || null);
  }, [habitId]);

  useFocusEffect(
    useCallback(() => {
      loadHabit();
    }, [loadHabit])
  );

  async function handleDayPress(dateStr) {
    const updated = await toggleLog(habitId, dateStr);
    setHabit(updated);
  }

  function confirmDelete() {
    Alert.alert("Delete habit?", `"${habit?.name}" and its history will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteHabit(habitId);
          router.back();
        },
      },
    ]);
  }

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.name}>{habit.name}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{habit.current_streak}</Text>
          <Text style={styles.statLabel}>Current streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{habit.longest_streak}</Text>
          <Text style={styles.statLabel}>Longest streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{habit.completions_last_30_days}</Text>
          <Text style={styles.statLabel}>Last 30 days</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Activity</Text>
      <HeatmapCalendar
        loggedDates={habit.logged_dates}
        color={habit.color}
        weeks={16}
        onDayPress={handleDayPress}
      />

      <Pressable style={styles.deleteButton} onPress={confirmDelete}>
        <Text style={styles.deleteText}>Delete habit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loading: { textAlign: "center", marginTop: 60, color: "#9CA3AF" },
  name: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 20 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "700", color: "#111827" },
  statLabel: { fontSize: 11, color: "#6B7280", marginTop: 4, textAlign: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 12 },
  deleteButton: { marginTop: 36, alignItems: "center", padding: 12 },
  deleteText: { color: "#EF4444", fontSize: 14, fontWeight: "600" },
});
