import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { rs } from "react-native-full-responsive";
import { Spinner } from "native-base";
import calculateResponsiveFontSize from "../utils/font";

export default function CustomButton({
  bg,
  borderColor,
  w = 100,
  color,
  text,
  handlePress,
  isLoading,
}) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        {
          height: rs(45),
          backgroundColor: borderColor,
          borderColor: bg,
          width: `${w}%`,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: color,
            fontSize: rs(16),
          },
        ]}
      >
        {isLoading ? (
          <Spinner accessibilityLabel="Loading posts" color="#fff" />
        ) : (
          text
        )}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    borderWidth: rs(1),
    borderRadius: rs(5),
    padding: rs(10),
    marginBottom: rs(10),
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "500",
    textAlign: "center",
  },
});
