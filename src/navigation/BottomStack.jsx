import React from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Define your screens here

import Home from "../page/Home/Home";
import { Image, Text } from "native-base";
import More from "../page/More/More";
import MyPlant from "../page/MyPlant/MyPlant";
import { useNavigation } from "@react-navigation/native";
import { rs } from "react-native-full-responsive";
const Tab = createBottomTabNavigator();
const getIconColor = (focused) => ({
  tintColor: focused ? "#1ABC76" : "#000",
});
const BottomStack = () => {
  const navigation = useNavigation();

  const handleTabPress = (screenName) => {
    navigation.navigate(screenName);
  };
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarItemStyle: {
            height: 0,
          },
          tabBarIcon: ({ focused }) => (
            <View
              style={styles.tabIconContainer}
              onTouchEnd={() => handleTabPress("Home")} // Directly handle the press event
            >
              <Image
                source={require("../images/Home.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
                alt="Home"
              />
              <Text
                fontSize="sm"
                fontWeight="400"
                color={focused ? "#1ABC76" : "#000"}
              >
                Home
              </Text>
            </View>
          ),
        }}
        component={Home}
      />
      <Tab.Screen
        name="Plant"
        component={MyPlant}
        options={{
          tabBarItemStyle: {
            height: 0,
          },
          tabBarIcon: ({ focused }) => (
            <View
              style={styles.tabIconContainer}
              onTouchEnd={() => handleTabPress("Plant")} // Directly handle the press event
            >
              <Image
                source={require("../images/Plant.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
                alt="Home"
              />
              <Text
                fontSize="sm"
                fontWeight="400"
                color={focused ? "#1ABC76" : "#000"}
              >
                My Plant
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={More}
        options={{
          tabBarItemStyle: {
            height: 0,
          },
          tabBarIcon: ({ focused }) => (
            <View
              style={styles.tabIconContainer}
              onTouchEnd={() => handleTabPress("Profile")} // Directly handle the press event
            >
              <Image
                source={require("../images/More.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
                alt="Home"
              />
              <Text
                fontSize="sm"
                fontWeight="400"
                color={focused ? "#1ABC76" : "#000"}
              >
                More
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    padding: 0,
    left: rs(16),
    right: rs(16),
    bottom: rs(12),
    height: rs(80),
    borderRadius: rs(19),
    borderWidth: rs(2),
    marginHorizontal: rs(10),
    backgroundColor: "#fff",
    borderColor: "#1ABC76",
    shadowColor: "#000",
    shadowOffset: {
      height: 6,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabIconContainer: {
    position: "absolute",
    top: rs(12),
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    width: rs(25),
    height: rs(25),
  },
});

export default BottomStack;
