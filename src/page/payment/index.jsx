import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import calculateResponsiveFontSize from "../../utils/font";
import { HStack, Stack } from "native-base";
import {
  useFreePlanMutation,
  useGetUserQuery,
  useMakePaymentMutation,
} from "../../redux/api";
import Toast from "react-native-toast-message";
import WebView from "react-native-webview";
import { rs } from "react-native-full-responsive";

const PaymentScreen = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const { data } = useGetUserQuery();

  const [makePayment, { isLoading }] = useMakePaymentMutation();
  const [uri, setUri] = useState("");
  const [freePlan, { isLoading: freeIsLoading }] = useFreePlanMutation();
  const handlePlan = async () => {
    try {
      const data = await makePayment().unwrap();
      if (data?.authorised_link) {
        setUri(data?.authorised_link);
      }
  
    } catch (error) {
      console.log(error);
    }
  };

  const handleFreePlan = async () => {
    try {
      const data = await freePlan({ plan: "FREE" }).unwrap();
      if (data?.message) {
        navigation.goBack();
      }
    } catch (error) {
      if (error) {
        console.log(error);
        Toast.show({
          type: "error",
          text1: "",
          text2: error?.error ?? "",
        });
      }
    }
  };

  const handleNavigationStateChange = (navState) => {
    // Check if the WebView navigation has finished
    if (navState.navigationType === "other" && navState.url === "about:blank") {
      navigateToAnotherPage();
    }
  };

  const navigateToAnotherPage = () => {
    // Function to navigate the user to another page
    navigation.goBack();
  };

  if (uri) {
    return (
      <WebView
        source={{ uri: uri }}
        onNavigationStateChange={handleNavigationStateChange}
      />
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <HStack space={calculateResponsiveFontSize(1)} alignItems="center">
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image source={require("../../images/XCircle.png")} alt="cancel" />
          </TouchableWithoutFeedback>
          <Text style={styles.mainText}>Full Access</Text>
        </HStack>
        <HStack alignItems="center" space={2}>
          <View style={styles.blackDot} />
          <Text style={styles.font}>Unlimited Snap Plant Id</Text>
        </HStack>

        <HStack alignItems="center" space={2}>
          <View style={styles.blackDot} />
          <Text style={styles.font}>Enhance Faste Identification</Text>
        </HStack>

        <HStack alignItems="center" space={2}>
          <View style={styles.blackDot} />
          <Text style={styles.font}>100 No Ads</Text>
        </HStack>
      </View>

      <View style={styles.buttonContainer}>
        {data?.data?.user.used_free_trial ? null : (
          <TouchableOpacity
            style={[
              styles.button,
              {
                height: rs(45),
                backgroundColor: "#ffff",
                borderColor: "#1ABC76",
              },
            ]}
            onPress={handleFreePlan}
          >
            {freeIsLoading ? (
              <ActivityIndicator color="#1ABC76" />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: "#1ABC76",
                  },
                ]}
              >
                Start 30-Days For Free Trial
              </Text>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            {
              height: rs(45),
              backgroundColor: "#1ABC76",
              borderColor: "#1ABC76",
            },
          ]}
          onPress={handlePlan}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.buttonText, { color: "#fff" }]}>
              4.99GDP/Month Premium
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(0, 255, 0, 0.1)",
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
  blackDot: {
    width: rs(5),
    height: rs(5),
    borderRadius: rs(5),
    backgroundColor: "black",
  },
  mainContainer: {
    padding: calculateResponsiveFontSize(10),
    gap: calculateResponsiveFontSize(5),
  },
  font: {
    fontSize: rs(16),
    fontWeight: "500",
    color: "#000",
  },
  mainText: {
    fontSize: rs(18),
    fontWeight: "500",
    color: "#000",
  },
});

export default PaymentScreen;
