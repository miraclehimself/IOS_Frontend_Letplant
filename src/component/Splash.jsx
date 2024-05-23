import { StyleSheet, Text, View, Image, StatusBar } from "react-native";
import React from "react";

const Splash = () => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar backgroundColor="#79D8AF"  />
      <Image
        source={require("../images/splashscreen.png")}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
