import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

// Renders the last N weeks as a GitHub-style contribution grid.
// loggedDates: array of "YYYY-MM-DD" strings
// onDayPress(dateString): called when a cell is tapped
export default function HeatmapCalendar({ loggedDates = [], color = "#4F46E5", weeks = 12, onDayPress }) {
  const loggedSet = useMemo(() => new Set(loggedDates), [loggedDates]);

  const days = useMemo(() => {
    const totalDays = weeks * 7;
    const today = new Date();
    const result = [];
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      result.push(d.toISOString().slice(0, 10));
    }
    return result;
  }, [weeks]);

  // Group into columns of 7 (weeks), Sunday-first
  const columns = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {columns.map((col, colIdx) => (
          <View key={colIdx} style={styles.column}>
            {col.map((dateStr) => {
              const isLogged = loggedSet.has(dateStr);
              return (
                <Pressable
                  key={dateStr}
                  onPress={() => onDayPress && onDayPress(dateStr)}
                  style={[
                    styles.cell,
                    { backgroundColor: isLogged ? color : "#E5E7EB" },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
      <Text style={styles.caption}>Last {weeks} weeks · tap a day to toggle it</Text>
    </View>
  );
}

const CELL_SIZE = 14;
const CELL_GAP = 3;

const styles = StyleSheet.create({
  container: { alignItems: "flex-start" },
  grid: { flexDirection: "row" },
  column: { marginRight: CELL_GAP },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
    marginBottom: CELL_GAP,
  },
  caption: { marginTop: 8, fontSize: 12, color: "#6B7280" },
});
