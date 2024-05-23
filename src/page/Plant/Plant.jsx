import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

import React from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Stack,
  StatusBar,
  Text,
  useTheme,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import calculateResponsiveFontSize from "../../utils/font";
import { rs } from "react-native-full-responsive";

const Plant = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.screen}>
      <StatusBar bg="#fff" barStyle="light-content" />
      <Box safeAreaTop bg="violet.600" />
      <Center p="2">
        <HStack
          bg="transparent"
          px="1"
          py="3"
          mt="5"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          maxW="350"
        >
          <HStack alignItems="center" space={2}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={require("../../images/backArrow.png")}
                alt="editor"
              />
            </TouchableWithoutFeedback>
            <Stack></Stack>
          </HStack>
          <Stack></Stack>
        </HStack>
      </Center>
      <Center p="2">
        <Stack
          bg="transparent"
          px="1"
          mt="5"
          h={calculateResponsiveFontSize(120)}
          w="100%"
          maxW="350"
        >
          <Image
            h="100%"
            w="100%"
            source={require("../../images/Rose.jpg")}
            alt="editor"
          />
        </Stack>
      </Center>
      <Center p="2">
        <Stack
          bg="transparent"
          px="1"
          justifyContent="center"
          alignItems="center"
          w="100%"
          maxW="350"
        >
          <HStack w="60%" space={3}>
            <Stack style={styles.conBorder}>
              <Image
                h="50"
                w="50"
                source={require("../../images/small.png")}
                alt="editor"
              />
            </Stack>
            <Stack style={styles.conBorder}>
              <Image
                h="50"
                w="50"
                source={require("../../images/small.png")}
                alt="editor"
              />
            </Stack>
            <Stack style={styles.conBorder}>
              <Image
                h="50"
                w="50"
                source={require("../../images/small.png")}
                alt="editor"
              />
            </Stack>
          </HStack>
        </Stack>
      </Center>
      <Stack my="5" p="5">
        <Text fontSize="lg" color="#000" fontWeight="600">
          Recommendations
        </Text>
        <HStack alignItems="center" space={2}>
          <View style={styles.blackDot} />
          <Text fontSize="md" color="#000" fontWeight="400">
            Increase Temperature by 2℃
          </Text>
        </HStack>
      </Stack>
    </View>
  );
};

export default Plant;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
  conBorder: {
    borderWidth: rs(0.8),
    borderColor: "#1ABC76",
    backgroundColor: "rgba(1, 171, 118, 0.1)",
    borderRadius: rs(2),
    // padding:20
  },
  blackDot: {
    width: rs(5),
    height: rs(5),
    borderRadius: rs(5),
    backgroundColor: "black",
  },
});
