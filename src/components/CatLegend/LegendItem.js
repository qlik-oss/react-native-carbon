import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export const LegendItem = ({ item }) => {
  const backgroundColor = item.color;
  return (
    <View style={styles.main}>
      <View style={[styles.box, { backgroundColor }]} />
      <Text style={styles.label} numberOfLines={1}>
        {item.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    margin: 4,
    alignItems: "center",
  },
  label: {
    marginRight: 8,
    marginLeft: 4,
    maxWidth: 80,
    fontSize: 12,
  },
  box: {
    width: 12,
    height: 12,
  },
});
