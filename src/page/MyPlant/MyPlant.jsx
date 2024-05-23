import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView,
} from "react-native";

import React, { useMemo } from "react";
import {
  Box,
  HStack,
  Image,
  Skeleton,
  Stack,
  StatusBar,
  Text,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useGetAllProcessPlantQuery } from "../../redux/api";
import calculateResponsiveFontSize from "../../utils/font";
import FastImage from "react-native-fast-image";
import { useDispatch } from "react-redux";
import { setItem } from "../../redux/authenticationSlice";
import { returnArray } from "../../utils/generalItem";
import { rs } from "react-native-full-responsive";

const MyPlant = () => {
  const navigation = useNavigation();
  const { data, isLoading, isError, error, isSuccess } =
    useGetAllProcessPlantQuery();
  const dispatch = useDispatch();
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date,
    );

    const day = date.getDate();
    const suffix = getDaySuffix(day);

    return formattedDate.replace(/\d{1,2}/, day + suffix);
  }

  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  const renderItem = useMemo(
    () =>
      ({ item }) => {
        return (
          <>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("AnalyzeResult");
                dispatch(
                  setItem({
                    ...item,
                    isShowButton: false,
                  }),
                );
              }}
            >
              <HStack
                style={styles.conBorderC}
                my="2"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack w="20" h="20">
                  {item?.plant_image ? (
                    <FastImage
                      style={{ width: "100%", height: "100%" }}
                      source={{
                        uri: item?.image_url,
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
                <Stack>
                  <Text
                    style={{
                      fontSize: calculateResponsiveFontSize(5),
                    }}
                  >
                    {returnArray(item?.name)}
                  </Text>
                  <Text fontSize="md" color="#000" fontWeight="600">
                    Plant Name
                  </Text>
                  <Text fontSize={calculateResponsiveFontSize(4)} mt="2">
                    {formatDate(item?.created_at)}
                  </Text>
                </Stack>
              </HStack>
            </TouchableWithoutFeedback>
          </>
        );
      },
    [],
  );
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar bg="#fff" barStyle="dark-content" />

      <Stack mx="2" my="1">
        <Text
          color="#000"
          fontSize={rs(20)}
          fontWeight="500"
        >
          Recommendations
        </Text>
      </Stack>

      <Stack bg="transparent" px="1" mt="1" flex="1" w="100%">
        {isLoading && (
          <Stack space={3}>
            <Skeleton h="24" />
            <Skeleton h="24" />
            <Skeleton h="24" />
            <Skeleton h="24" />
            <Skeleton h="24" />
            <Skeleton h="24" />
          </Stack>
        )}
        {isSuccess && data && data?.length > 0 && (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={{
              paddingHorizontal: calculateResponsiveFontSize(2),
              marginBottom: calculateResponsiveFontSize(40),
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
        {isSuccess && data && data?.length === 0 && (
          <Stack flex="1" justifyContent="center" alignItems="center">
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <Image
                size="2xl"
                source={require("../../images/nodata.png")}
                alt="no data"
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </Stack>
        )}
        {isError && (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("AnalyzeResult");
            }}
          >
            <HStack
              style={[
                styles.conBorderC,
                { height: calculateResponsiveFontSize(40) },
              ]}
              justifyContent="center"
              alignItems="center"
            >
              <Text
                textAlign="center"
                fontSize="md"
                color="#000"
                fontWeight="600"
              >
                {error?.message ? error?.message : "something went wrong"}
              </Text>
            </HStack>
          </TouchableWithoutFeedback>
        )}
      </Stack>
    </SafeAreaView>
  );
};

export default MyPlant;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
  conBorder: {
    width: "98%",
    paddingHorizontal: 5,
    borderWidth: 0.8,
    borderColor: "#1ABC76",
    backgroundColor: "rgba(1, 171, 118, 0.1)",
    borderRadius: 3,
    paddingVertical: 20,
  },
  conBorderB: {
    width: "48%",
    paddingHorizontal: 5,
    borderWidth: 0.8,
    borderColor: "#1ABC76",
    backgroundColor: "rgba(1, 171, 118, 1)",
    borderRadius: 3,
    paddingVertical: 20,
  },

  conBorderC: {
    width: "100%",

    borderWidth: 0.8,
    borderColor: "#1ABC76",
    backgroundColor: "rgba(1, 171, 118, 0.1)",
    borderRadius: 3,
    padding: 20,
  },
});
