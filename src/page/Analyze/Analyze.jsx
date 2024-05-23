import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
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

const Analyze = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  // Access the color from the theme
  const bgColor = colors.brand.bg;
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
                source={require("../../images/XCircle.png")}
                alt="cancel"
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
      <Center p={rs(2)}>
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
                h={rs(50)}
                w={rs(50)}
                source={require("../../images/small.png")}
                alt="editor"
              />
            </Stack>
            <Stack style={styles.conBorder}>
              <Image
                h={rs(50)}
                w={rs(50)}
                source={require("../../images/small.png")}
                alt="editor"
              />
            </Stack>
            <Stack style={styles.conBorder}>
              <Image
                h={rs(50)}
                w={rs(50)}
                source={require("../../images/small.png")}
                alt="editor"
              />
            </Stack>
          </HStack>
        </Stack>
      </Center>
      <Stack justifyContent="center" mt={rs(10)} alignItems="center" w="100%">
        <Button
          mt="10"
          bg={bgColor}
          _hover={{
            backgroundColor: bgColor,
          }}
          px={rs(2)}
          py={rs(3)}
          w="90%"
          onPress={() => {
            navigation.navigate("bottom");
          }}
        >
          <Text
            style={[
              {
                fontSize: rs(17),
                color: "#fff",
                fontWeight: "500",
              },
            ]}
          >
            Analyze & Compare
          </Text>
        </Button>
      </Stack>
    </View>
  );
};

export default Analyze;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
  conBorder: {
    borderWidth: 0.8,
    borderColor: "#1ABC76",
    backgroundColor: "rgba(1, 171, 118, 0.1)",
    borderRadius: 3,
    // padding:20
  },
});
