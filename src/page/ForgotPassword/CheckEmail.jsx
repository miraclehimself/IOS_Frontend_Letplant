import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import calculateResponsiveFontSize from '../../utils/font';
import OtpInputs from 'react-native-otp-inputs';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setPasswordAction} from '../../redux/authenticationSlice';
import CustomButton from '../../component/CustomButton';
import {rs} from 'react-native-full-responsive';
import {Stack, useTheme} from 'native-base';

const CheckEmail = () => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    password: '',
    errors: {
      password: '',
    },
  });
  const otpRef = useRef(null); // Ref for OTP input
  const {colors} = useTheme();

  // Access the color from the theme
  const bgColor = colors.brand.bg;
  const navigation = useNavigation();

  const handleChange = value => {
    setFormValues({
      ...formValues,
      password: value,
      errors: {
        ...formValues.errors,
        password: '', // Clear the error message for this field
      },
    });
  };
  const handleSubmit = async () => {
    const {password} = formValues;
    const errors = {};

    if (password === '') {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password length must be 4';
    }

    // Update the state with the errors object
    setFormValues({
      ...formValues,
      errors,
    });

    // Check if there are no errors before proceeding with form submission
    if (Object.keys(errors).length === 0) {
      const d = {
        password: formValues.password,
      };
      dispatch(setPasswordAction(d?.password));
      navigation.navigate('CreateNewPassword');
    }
  };

  // Function to focus on OTP input when component mounts
  React.useEffect(() => {
    if (otpRef.current) {
      otpRef.current.focus();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Stack my="5" justifyContent="flex-end" alignItems="flex-end">
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={require('../../images/XCircle.png')} />
          </TouchableWithoutFeedback>
        </Stack>

        <Stack mt="5" mb="10">
          <Text
            style={[
              {
                fontSize: rs(16),
                color: '#000',
                fontWeight: '500',
                marginBottom: 1,
              },
            ]}>
            Check your Email!
          </Text>
          <Text
            style={[
              {
                fontSize: rs(16),
                color: '#000',
                fontWeight: '500',
                marginBottom: 1,
              },
            ]}>
            To input your OTP.
          </Text>
        </Stack>

        <View style={{flex: 0.5, marginRight: rs(10)}}>
          <OtpInputs
            handleChange={handleChange}
            numberOfInputs={4}
            inputStyles={styles.inputStyles}
            focusedBorderColor="#000"
            selectTextOnFocus={false}
            keyboardType="phone-pad"
          />
        </View>
        {formValues?.errors?.password && (
          <Text style={styles.error}>{formValues?.errors?.password}</Text>
        )}

        <Stack flex="1" justifyContent="center" alignItems="center" w="100%">
          <CustomButton
            bg={bgColor}
            color="#fff"
            w="100"
            borderColor={bgColor}
            handlePress={handleSubmit}
            isLoading={false}
            text="Request OTP"
          />
        </Stack>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputStyles: {
    borderWidth: rs(1),
    borderBottomColor: 'gray',
    padding: rs(15),
  },
  container: {
    paddingHorizontal: rs(25),
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  error: {
    color: 'red',
    marginBottom: rs(10),
  },
});

export default CheckEmail;
