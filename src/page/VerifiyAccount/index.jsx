import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import calculateResponsiveFontSize from "../../utils/font";
import OtpInputs from "react-native-otp-inputs";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import CustomButton from "../../component/CustomButton";
import { rs } from "react-native-full-responsive";
import { storage, useVerifyAccountMutation } from "../../redux/api";
import Toast from "react-native-toast-message";
import { Stack, useTheme } from "native-base";
import { setToken } from "../../redux/authenticationSlice";

const VerifyEmail = (props) => {
  const dispatch = useDispatch();
  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();
  const [formValues, setFormValues] = useState("");
  const [formError, setFormError] = useState("");

  const navigation = useNavigation();

  const handleChange = (value) => {
    setFormValues(value);
  };
  const { colors } = useTheme();

  // Access the color from the theme
  const bgColor = colors.brand.bg;
  const handleSubmit = async () => {
    // Check if there are no errors before proceeding with form submission
    if (formValues.length === 4) {
      const formData = new FormData();
      formData.append("email", props?.route?.params?.email);
      formData.append("otp", formValues);

      try {
        const response = await verifyAccount(formData).unwrap();
        const { token } = response;
        if (token) {
          storage.set("token", token);
          dispatch(setToken(token));
          navigation.replace("bottom");
        }
      } catch (error) {
        if (error) {
          Toast.show({
            type: "error",
            text1: "",
            text2: error?.error ?? "",
          });
        }
      }
    } else {
      setFormError("OTP length must be 4");
    }
  };

  return (
    <View style={styles.container}>
      <Stack my="5" justifyContent="flex-end" alignItems="flex-end">
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image source={require("../../images/XCircle.png")} />
        </TouchableWithoutFeedback>
      </Stack>

      <Stack mt="5" mb="10">
        <Text
          style={[
            {
              fontSize: calculateResponsiveFontSize(10),
              color: "#000",
              fontWeight: "500",
              marginBottom: 1,
            },
          ]}
        >
          Check your Email!
        </Text>
        <Text
          style={[
            {
              fontSize: calculateResponsiveFontSize(10),
              color: "#000",
              fontWeight: "500",
              marginBottom: 1,
            },
          ]}
        >
          To input your OTP.
        </Text>
      </Stack>

      <View style={{ flex: 0.5, marginRight: calculateResponsiveFontSize(10) }}>
        <OtpInputs
          handleChange={handleChange}
          numberOfInputs={4}
          inputStyles={styles.inputStyles}
          focusedBorderColor="#000"
          selectTextOnFocus={false}
          keyboardType="phone-pad"
        />
      </View>
      {formError && <Text style={styles.error}>{formError}</Text>}

      <Stack flex="1" justifyContent="center" alignItems="center" w="100%">
        <CustomButton
          bg={bgColor}
          color="#fff"
          w="100"
          borderColor={bgColor}
          handlePress={handleSubmit}
          isLoading={isLoading}
          text="Verify Email"
        />
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyles: {
    borderWidth: rs(1),
    borderBottomColor: "gray",
    padding: rs(15),
  },
  container: {
    paddingHorizontal: rs(25),
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  error: {
    color: "red",
    marginBottom: rs(10),
  },
});

export default VerifyEmail;
