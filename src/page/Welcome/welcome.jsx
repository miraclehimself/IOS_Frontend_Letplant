import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Video from "react-native-video";
import { useNavigation } from "@react-navigation/native";
import calculateResponsiveFontSize from "../../utils/font";
import { rh, rw, rs } from "react-native-full-responsive";
import { StatusBar } from "native-base";

const VideoBackgroundScreen = () => {
  const navigation = useNavigation();
  const goToLogin = () => {
    navigation.navigate("Login");
  };

  const goToRegister = () => {
    navigation.navigate("Registration");
  };
  return (
    <View style={styles.container}>
          <StatusBar
          barStyle={"black" }
        />
      <Video
        source={require("../../images/plantVideo.mp4")} // Can be a URL or a local file.
        style={styles.video}
        controls={false} // Hide controls
        resizeMode="cover"
        repeat={true} // Loop the video
        autoplay={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              height: rs(45),
              backgroundColor: "#1ABC76",
            },
          ]}
          onPress={goToLogin}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              height: rs(45),
              backgroundColor: "#ffff",
              borderColor: "#1ABC76",
            },
          ]}
          onPress={goToRegister}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: "#1ABC76",
              },
            ]}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  buttonContainer: {
    position: "absolute",
    bottom: rs(20),
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    gap: rs(10),
  },
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
    fontSize: rs(16),
    fontWeight: "500",
    textAlign: "center",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default VideoBackgroundScreen;
