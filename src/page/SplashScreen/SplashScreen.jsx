import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, View } from "react-native";
import { setToken } from "../../redux/authenticationSlice";
import { useNavigation } from "@react-navigation/native";
import Splash from "../../component/Splash";
import { storage } from "../../redux/api";

const SplashScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const auth = storage.getString("token");
    if (auth) {
      navigation.replace("bottom");
      dispatch(setToken(auth));
    } else {
      navigation.navigate("welcome");
    }
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <Splash />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
