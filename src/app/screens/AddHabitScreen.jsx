import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { createHabit } from "../../api/habits";
import { useRouter } from "expo-router"

const COLOR_OPTIONS = ["#4F46E5", "#DC2626", "#059669", "#D97706", "#7C3AED", "#DB2777"];

export default function AddHabitScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [targetPerWeek, setTargetPerWeek] = useState("7");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Name required", "Give your habit a name first.");
      return;
    }
    setSaving(true);
    try {
      await createHabit({
        name: name.trim(),
        color,
        target_per_week: parseInt(targetPerWeek, 10) || 7,
      });
      router.back();
    } catch (err) {
      Alert.alert("Error", "Couldn't save the habit. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Habit name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Read for 20 minutes"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Color</Text>
      <View style={styles.colorRow}>
        {COLOR_OPTIONS.map((c) => (
          <Pressable
            key={c}
            onPress={() => setColor(c)}
            style={[
              styles.colorSwatch,
              { backgroundColor: c },
              color === c && styles.colorSwatchSelected,
            ]}
          />
        ))}
      </View>

      <Text style={styles.label}>Target days per week</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={targetPerWeek}
        onChangeText={setTargetPerWeek}
      />

      <Pressable style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? "Saving…" : "Save habit"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20, paddingTop: 30 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
  },
  colorRow: { flexDirection: "row", gap: 12 },
  colorSwatch: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  colorSwatchSelected: { borderWidth: 3, borderColor: "#111827" },
  button: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
