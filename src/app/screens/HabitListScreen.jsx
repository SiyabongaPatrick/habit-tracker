import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, RefreshControl } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { getHabits, toggleLog } from "../../api/habits";
import { logout } from "../../api/auth";
import HabitCard from "../../components/HabitCard";

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function HabitListScreen() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = useCallback(async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      console.warn("Failed to load habits", err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits])
  );

  async function handleToggleToday(habit) {
    try {
      const updated = await toggleLog(habit.id, todayStr());
      setHabits((prev) => prev.map((h) => (h.id === habit.id ? updated : h)));
    } catch (err) {
      console.warn("Failed to toggle log", err?.message);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/screens/LoginScreen");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Habits</Text>
        <Pressable onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadHabits} />}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.empty}>No habits yet. Tap + to add your first one.</Text>
          )
        }
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            doneToday={item.logged_dates.includes(todayStr())}
            onPress={() => router.push({
              pathname: "/screens/HabitDetailScreen",
              params: {habitId: item.id}
            })}
            onTogglePress={() => handleToggleToday(item)}
          />
        )}
      />

      <Pressable style={styles.fab} onPress={() => router.push("/screens/AddHabitScreen")}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#111827" },
  logoutText: { color: "#EF4444", fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  empty: { textAlign: "center", color: "#9CA3AF", marginTop: 60, fontSize: 14 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 36,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 28, marginTop: -2 },
});
