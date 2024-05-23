import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { rs } from "react-native-full-responsive";
import React from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  ScrollView,
  Spinner,
  Stack,
  StatusBar,
  Text,
  useTheme,
} from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import calculateResponsiveFontSize from "../../utils/font";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { returnArray } from "../../utils/generalItem";
const AnalyzeResult = (props) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const bgColor = colors.brand.bg;

  const data = useSelector((state) => state.auth.item);
  // Access the color from the theme

  function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <StatusBar bg="#fff" barStyle="light-content" />
      <Box safeAreaTop bg="violet.600" />
      <Stack px="4" mx="3" style={styles.boxContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image source={require("../../images/XCircle.png")} alt="cancel" />
        </TouchableWithoutFeedback>
        <Stack>
          <Text
            fontSize={rs(16)}
            color="#000"
            fontWeight="400"
          >
            {" "}
            Plant Name{" "}
          </Text>
          <Text
            fontSize={rs(16)}
            color="#000"
            fontWeight="400"
          >
            {" "}
            {returnArray(data?.name)}
          </Text>
        </Stack>
      </Stack>
      <Center p="2">
        <Stack
          bg="transparent"
          px="1"
          mt="1"
          h={calculateResponsiveFontSize(120)}
          w="100%"
        >
          {data?.image_url ? (
            <FastImage
              style={{ width: "100%", height: "100%" }}
              source={{
                uri: data?.image_url,
                // headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <Image
              h="100%"
              w="100%"
              borderRadius="3"
              source={require("../../images/flowerBase.png")}
              alt="editor"
            />
          )}
        </Stack>
      </Center>

      <Stack px="4">
        <HStack justifyContent="space-between" alignItems="center" mt="3">
          <Text
              fontSize={rs(16)}
            color="#000"
            fontWeight="500"
          >
            {" "}
            Property{" "}
          </Text>
          <Text
             fontSize={rs(16)}
            color="#000"
            fontWeight="500"
          >
            {" "}
            Plant{" "}
          </Text>
        </HStack>
        <HStack
          my="3"
          justifyContent="space-between"
          alignItems="center"
          style={styles.box}
        >
          <HStack alignItems="center" space={2}>
            <View style={styles.blackDot} />

            <Text
               fontSize={rs(16)}
              color="#000"
              fontWeight="400"
            >
              Temperature -
            </Text>
          </HStack>
          <Text
            fontSize={rs(16)}
            color="#000"
            fontWeight="400"
          >
            {" "}
            {kelvinToCelsius(Number(data?.temperature))}℃{" "}
          </Text>
        </HStack>
        <HStack
          my="3"
          justifyContent="space-between"
          alignItems="center"
          style={styles.box}
        >
          <HStack alignItems="center" space={2}>
            <View style={styles.blackDot} />
            <Text
            fontSize={rs(16)}
              color="#000"
              fontWeight="400"
            >
              Pressure-
            </Text>
          </HStack>
          <Text
            fontSize={rs(16)}
            color="#000"
            fontWeight="400"
          >
            {" "}
            {data?.meta_data?.pressure}{" "}
          </Text>
        </HStack>
        <HStack
          my="3"
          justifyContent="space-between"
          alignItems="center"
          style={styles.box}
        >
          <HStack alignItems="center" space={2}>
            <View style={styles.blackDot} />
            <Text
               fontSize={rs(16)}
              color="#000"
              fontWeight="400"
            >
              Humidity level-
            </Text>
          </HStack>
          <Text
            fontSize={rs(16)}
            color="#000"
            fontWeight="400"
          >
            {" "}
            {data?.meta_data?.humidity}{" "}
          </Text>
        </HStack>
        <HStack
          my="3"
          justifyContent="space-between"
          alignItems="center"
          style={styles.box}
        >
          <HStack alignItems="center" space={2}>
            <View style={styles.blackDot} />
            <Text
              fontSize={rs(16)}
              color="#000"
              fontWeight="400"
            >
              Sea level-
            </Text>
          </HStack>
          <Text
             fontSize={rs(16)}
            color="#000"
            fontWeight="400"
          >
            {" "}
            {data.meta_data?.sea_level}{" "}
          </Text>
        </HStack>
        <HStack
          my="3"
          justifyContent="space-between"
          alignItems="center"
          style={styles.box}
        >
          <HStack alignItems="center" space={2}>
            <View style={styles.blackDot} />
            <Text
              fontSize={rs(16)}
              color="#000"
              fontWeight="400"
            >
              Ground level-
            </Text>
          </HStack>
          <Text
             fontSize={rs(16)}
            color="#000"
            fontWeight="400"
          >
            {" "}
            {data?.meta_data?.grnd_level}{" "}
          </Text>
        </HStack>
      </Stack>
      {data?.recommendation && (
        <Stack px="4" mx="3" style={styles.boxContainer}>
          <Text
            fontSize={rs(16)}
            color="#000"
            fontWeight="500"
          >
            {" "}
            Recommendation{" "}
          </Text>

          <Text
            fontSize={rs(14)}
            lineHeight={calculateResponsiveFontSize(10)}
          >
            {data?.recommendation}
          </Text>
        </Stack>
      )}

      <Stack justifyContent="center" mt="1" mb="5" alignItems="center" w="100%">
        {data?.isShowButton && (
          <Button
            mt="5"
            bg={bgColor}
            _pressed={{
              backgroundColor: bgColor,
            }}
            _hover={{
              backgroundColor: bgColor,
            }}
            px="2"
            py={3}
            w="90%"
            onPress={() => {
              navigation.navigate("Quiz");
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
              Growth Recommendation
            </Text>
          </Button>
        )}

        {data?.isShowButton && (
          <Button
            mt="2"
            bg="#FF0000"
            _pressed={{
              backgroundColor: "#FF0000",
            }}
            _hover={{
              backgroundColor: "#FF0000",
            }}
            px="2"
            py={3}
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
              Exit
            </Text>
          </Button>
        )}
      </Stack>
    </ScrollView>
  );
};

export default AnalyzeResult;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
  conBorder: {
    borderWidth: rs(0.8),
    borderColor: "#1ABC76",
    backgroundColor: "rgba(1, 171, 118, 0.1)",
    borderRadius: rs(3),
    // padding:20
  },
  blackDot: {
    width: rs(5),
    height: rs(5),
    borderRadius: rs(5),
    backgroundColor: "black",
  },
  box: {
    borderWidth: rs(2),
    borderRadius: rs(8),
    borderColor: "green", // Green border color
    padding: rs(8),
    backgroundColor: "#fff", // White background color
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: rs(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  boxContainer: {
    backgroundColor: "#C2FFE5", // Light grey color for background
    padding: rs(10), // Padding inside the box
  },
});
