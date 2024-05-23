import React, { useEffect } from "react";
import { View, Text, Animated } from "react-native";
import { rs } from "react-native-full-responsive";
import styles from "./styles";

const ProgressBar = ({ progress }) => {
  const width = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(width, {
      toValue: progress,
      duration: 500, // adjust duration as needed
      useNativeDriver: false, // make sure to set useNativeDriver to false
    }).start();
  }, [progress]);

  const animatedWidth = {
    width: width.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    }),
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "#1ABC76",
          fontSize: rs(16),
        }}
      >
        {progress}%
      </Text>
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progress, animatedWidth]} />
      </View>
    </View>
  );
};

export default ProgressBar;
