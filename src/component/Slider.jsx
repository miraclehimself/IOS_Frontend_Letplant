import { Image, Stack, Text } from "native-base";
import React, { useState } from "react";
import { View, FlatList, StyleSheet, Dimensions, Animated } from "react-native";
import calculateResponsiveFontSize from "../utils/font";

const data = [{ id: 1, image: require("../images/p.png") }];

const { width } = Dimensions.get("window");
const itemWidth = width; // Adjust the gap as needed

const ImageSlider = ({ weatherForcast }) => {
  const scrollX = new Animated.Value(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const position = Animated.divide(scrollX, itemWidth);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.image} alt="image" />
      <View style={styles.cover} />
      <Text
        position="absolute"
        left="5"
        color="#fff"
        w="80%"
        top="5"
        fontSize={calculateResponsiveFontSize(18)}
        fontWeight="800"
      >
        {weatherForcast?.main?.temp}⁰c
      </Text>
      <Text
        position="absolute"
        left="5"
        color="#fff"
        w="80%"
        bottom="8"
        fontSize={calculateResponsiveFontSize(7)}
        fontWeight="800"
      >
        {weatherForcast?.weather[0]?.description}
      </Text>
      <Text
        position="absolute"
        left="5"
        color="#fff"
        w="80%"
        bottom="2"
        fontSize={calculateResponsiveFontSize(5)}
        fontWeight="800"
      >
        {weatherForcast?.name}
      </Text>
    </View>
  );

  const renderDot = (index) => {
    const opacity = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0.3, 1, 0.3],
      extrapolate: "clamp",
    });

    return <Animated.View key={index} style={[styles.dot, { opacity }]} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.contentContainer} // Apply the gap here
      />
      <View style={styles.pagination}>
        {data.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10, // Adjust the gap as needed
  },
  imageContainer: {
    width: itemWidth,
    marginHorizontal: 5, // Add horizontal margin for spacing between images
    borderRadius: 10, // Apply border radius
    overflow: "hidden", // Ensure content stays within rounded borders
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 150,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width,
    paddingTop: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1ABC76",
    marginHorizontal: 5,
  },
  cover: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
});

export default ImageSlider;
