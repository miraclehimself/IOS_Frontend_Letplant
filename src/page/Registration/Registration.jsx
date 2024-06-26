import React, { useState, useRef, useEffect } from "react";
import { Button, HStack, Spinner, Stack, useTheme } from "native-base";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from "react-native";
import calculateResponsiveFontSize from "../../utils/font";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import {  useRegisterAccountMutation } from "../../redux/api";
import { useDispatch } from "react-redux";
import CustomButton from "../../component/CustomButton";
import { rs } from "react-native-full-responsive";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerAccount, { isLoading, isError, error }] =
    useRegisterAccountMutation();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    errors: {
      name: "",
      email: "",
      password: "",
    },
  });

  const navigation = useNavigation();

  // Refs for input fields
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleChange = (field, value) => {
    setFormValues({
      ...formValues,
      [field]: value,
      errors: {
        ...formValues.errors,
        [field]: "", // Clear the error message for this field
      },
    });
  };
  const handleSubmit = async () => {
    const { name, email, password } = formValues;
    const errors = {};

    if (name === "") {
      errors.name = "Name is required";
    }

    if (email === "") {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email format";
    }

    if (password === "") {
      errors.password = "Password is required";
    }

    // Update the state with the errors object
    setFormValues({
      ...formValues,
      errors,
    });

    // Check if there are no errors before proceeding with form submission
    if (Object.keys(errors).length === 0) {
      const d = {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
      };
      try {
        const data = await registerAccount(d).unwrap();
        if (data?.message) {
          navigation.navigate("verifyemail", {email: data?.data?.email});
          Toast.show({
            type: "success",
            text1: "",
            text2: data?.message ?? "",
          });
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
    }
  };

  const isValidEmail = (email) => {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { colors } = useTheme();

  // Access the color from the theme
  const bgColor = colors.brand.bg;

  return (
   <SafeAreaView style={styles.container}>
     <ScrollView  style={styles.container}>
      <Stack my="5" justifyContent="flex-end" alignItems="flex-end">
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Image source={require("../../images/XCircle.png")} />
        </TouchableWithoutFeedback>
      </Stack>

      <Stack mt="5" mb="6">
        <Text
          style={[
            {
              fontSize: rs(20),
              color: "#000",
              fontWeight: "500",
              marginBottom: 1,
            },
          ]}
        >
          Create an account
        </Text>
        <HStack mt="1" space={1}>
          <Text
            style={[
              styles.textSignup,
              { fontSize: rs(16) },
            ]}
          >
            Already with LetPlant?
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text
              style={[
                styles.textSignup,
                { fontSize: rs(16), color: "#000" },
              ]}
            >
              Sign in
            </Text>
          </TouchableWithoutFeedback>
        </HStack>
      </Stack>
      {isError && (
        <Text
          style={[
            {
              fontSize: calculateResponsiveFontSize(4),
              color: "red",
              textAlign: "center",
            },
          ]}
        >
          {error?.message ? error?.message : "something went wrong"}
        </Text>
      )}
      <Stack my="5">
        <Text style={styles.inputText}> Name</Text>
        <TextInput
          ref={nameInputRef}
          style={styles.input}
          placeholder="Name"
          value={formValues.name}
          onChangeText={(value) => handleChange("name", value)}
          onFocus={() => {
            // Set focus on name input
            if (nameInputRef.current) {
              nameInputRef.current.focus();
            }
          }}
        />
        {formValues?.errors?.name && (
          <Text style={styles.error}>{formValues?.errors?.name}</Text>
        )}
      </Stack>
      <Stack mb="5">
        <Text style={styles.inputText}>Email</Text>
        <TextInput
          ref={emailInputRef}
          style={styles.input}
          placeholder="Email"
          value={formValues.email}
          onChangeText={(value) => handleChange("email", value)}
          onFocus={() => {
            // Set focus on email input
            if (emailInputRef.current) {
              emailInputRef.current.focus();
            }
          }}
        />
        {formValues?.errors?.email && (
          <Text style={styles.error}>{formValues?.errors?.email}</Text>
        )}
      </Stack>

      <Stack mb="5">
        <Text style={styles.inputText}>Password</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordInputRef}
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={formValues.password}
            onChangeText={(value) => handleChange("password", value)}
            autoCapitalize="none"
            onFocus={() => {
              // Set focus on password input
              if (passwordInputRef.current) {
                passwordInputRef.current.focus();
              }
            }}
          />

          <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={togglePasswordVisibility}
          >
          <MaterialCommunityIcons
              size={20}
              name={showPassword ? 'eye' : 'eye-off'}
            />
          </TouchableOpacity>
        </View>
        {formValues?.errors?.password && (
          <Text style={styles.error}>{formValues?.errors?.password}</Text>
        )}
      </Stack>
      <Stack justifyContent="center" mt="4" alignItems="center" w="100%">
        <CustomButton
          bg={bgColor}
          color="#fff"
          w="100"
          borderColor={bgColor}
          handlePress={handleSubmit}
          isLoading={isLoading}
          text="Register"
        />
      </Stack>
    </ScrollView>
   </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputText: {
    fontSize: rs(18),
    fontWeight: "400",
    color: "#000",
    paddingLeft: rs(4),
    paddingBottom: rs(5),
  },
  textContent: {
    fontWeight: "500",
    // lineHeight:18,
    color: "#444444",
    marginBottom: rs(40),
  },

  textSignup: {
    fontWeight: "500",
    // lineHeight:18,
    color: "#444444",
  },
  head: {
    fontWeight: "600",
    lineHeight: rs(20),
  },

  container: {
    paddingHorizontal: rs(25),
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  title: {
    fontSize: rs(24),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: rs(20),
  },
  input: {
    height: rs(55),
    backgroundColor: "transparent",
    borderRadius: rs(5),
    paddingHorizontal: rs(10),
    borderWidth: rs(1),
    borderColor: "#000",
    width: "100%",
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIconContainer: {
    position: "absolute",
    right: rs(10),
  },
  eyeIcon: {
    width: rs(24),
    height: rs(24),
  },
  loginButton: {
    backgroundColor: "#000",
    borderRadius: rs(5),
    paddingVertical: rs(12),
    alignItems: "center",
    marginTop: rs(20),
  },
  buttonText: {
    color: "#fff",
    fontSize: rs(16),
    fontWeight: "bold",
  },
  error: {
    color: "red",
  },
  forgot: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 1,
    marginBottom: rs(10),
  },
  forgotText: {
    color: "#920000",
    fontWeight: "500",
    lineHeight: rs(20),
    fontSize: rs(16),
  },
  signupText: {
    fontWeight: "500",
  },
});

export default Registration;
