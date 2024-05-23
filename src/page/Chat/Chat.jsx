import {
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  View,
  useColorScheme,
} from "react-native";
import React from "react";
import { Center, HStack, Image, Stack, Text, useTheme } from "native-base";
import calculateResponsiveFontSize from "../../utils/font";
import { useNavigation } from "@react-navigation/native";
import { rs } from "react-native-full-responsive";

const Chat = () => {
  const { colors } = useTheme();
  const isDarkMode = useColorScheme() === "dark";
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="#C2FFE5"
      />
      <HStack
        bg="#C2FFE5"
        h={calculateResponsiveFontSize(40)}
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
      >
        <HStack pl="5" space={3}>
          <TouchableNativeFeedback onPress={() => navigation.goBack()}>
            <Image
              source={require("../../images/backArrow.png")}
              alt="editor"
            />
          </TouchableNativeFeedback>
          <Stack>
            <Text color="#2F2D2F" fontSize="lg" fontWeight="400">
              Chat with us
            </Text>
            <Text color="#2F2D2F" fontSize="xs" fontWeight="300">
              Currently replying in 45 minutes
            </Text>
          </Stack>
        </HStack>
      </HStack>
      <View style={styles.container}></View>

      <Center>
        <HStack
          w="95%"
          px="2"
          bg="#F6F6F8"
          justifyContent="space-between"
          alignItems="center"
        >
          <TouchableNativeFeedback>
            <Image source={require("../../images/paper.png")} alt="editor" />
          </TouchableNativeFeedback>
          <TextInput style={styles.input} placeholder="Password" />
          <TouchableNativeFeedback>
            <Image source={require("../../images/Send.png")} alt="editor" />
          </TouchableNativeFeedback>
        </HStack>
      </Center>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: rs(55),
    backgroundColor: "transparent",
    borderRadius: rs(5),
    paddingHorizontal: rs(10),
    borderWidth: rs(1),
    borderColor: "transparent",
    width: "75%",
  },
});
