import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import calculateResponsiveFontSize from '../../utils/font';
import {useNavigation} from '@react-navigation/native';
import {useResetPasswordInitiateMutation} from '../../redux/api';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {setEmailAction} from '../../redux/authenticationSlice';
import CustomButton from '../../component/CustomButton';
import {rs} from 'react-native-full-responsive';
import {HStack, Stack, useTheme} from 'native-base';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [resetPasswordInitiate, {isLoading, isError, error}] =
    useResetPasswordInitiateMutation();
  const [formValues, setFormValues] = useState({
    email: '',
    errors: {
      email: '',
    },
  });

  const emailRef = useRef(null);

  useEffect(() => {
    // Focus on the email input field when the component is mounted
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleChange = (field, value) => {
    setFormValues({
      ...formValues,
      [field]: value,
      errors: {
        ...formValues.errors,
        [field]: '', // Clear the error message for this field
      },
    });
  };

  const handleSubmit = async () => {
    const {email} = formValues;
    const errors = {};

    if (email === '') {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email format';
    }

    // Update the state with the errors object
    setFormValues({
      ...formValues,
      errors,
    });

    // Check if there are no errors before proceeding with form submission
    if (Object.keys(errors).length === 0) {
      try {
        const d = formValues.email;

        const data = await resetPasswordInitiate(d).unwrap();
        // Handle the response data accordingly (e.g., redirect to the home stack)
        // console.log(data)
        if (data?.message) {
          Toast.show({
            type: 'success',
            text1: '',
            text2: data?.message,
          });
          navigation.navigate('CheckEmail');
          dispatch(setEmailAction(formValues.email));
        }
      } catch (error) {
        // Handle any registration error
        console.log(error);
        if (error) {
          Toast.show({
            type: 'error',
            text1: '',
            text2: error?.error ?? '',
          });
        }
      }
    }
  };

  const isValidEmail = email => {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
  };

  const {colors} = useTheme();

  // Access the color from the theme
  const bgColor = colors.brand.bg;

  return (
    <SafeAreaView style={styles.container}>
      <Stack style={styles.container}>
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
                fontSize: rs(20),
                color: '#000',
                fontWeight: '500',
                marginBottom: 1,
              },
            ]}>
            Reset password!
          </Text>
          <HStack mt="1" space={1}>
            <Text style={[styles.textSignup, {fontSize: rs(16)}]}>
              Don’t have an account?
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('Registration');
              }}>
              <Text
                style={[styles.textSignup, {fontSize: rs(16), color: bgColor}]}>
                Create one
              </Text>
            </TouchableWithoutFeedback>
          </HStack>
        </Stack>

        <Stack mb="5">
          <Text style={styles.inputText}>Email</Text>
          <TextInput
            ref={emailRef}
            style={styles.input}
            placeholder="Email"
            value={formValues.email}
            onChangeText={value => handleChange('email', value)}
          />
          {formValues?.errors?.email && (
            <Text style={styles.error}>{formValues?.errors?.email}</Text>
          )}
        </Stack>

        <Stack flex="1" justifyContent="center" alignItems="center" w="100%">
          <CustomButton
            bg={bgColor}
            color="#fff"
            w="100"
            borderColor={bgColor}
            handlePress={handleSubmit}
            isLoading={isLoading}
            text=" Request OTP"
          />
        </Stack>
      </Stack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputText: {
    fontSize: rs(18),
    fontWeight: '400',
    color: '#000',
    paddingLeft: rs(4),
    paddingBottom: rs(5),
  },
  textContent: {
    fontWeight: '500',
    // lineHeight:18,
    color: '#444444',
    marginBottom: rs(40),
  },

  textSignup: {
    fontWeight: '500',
    // lineHeight:18,
    color: '#444444',
  },
  head: {
    fontWeight: '600',
    lineHeight: rs(20),
  },

  container: {
    paddingHorizontal: rs(25),
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  title: {
    fontSize: rs(24),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: rs(20),
  },
  input: {
    height: rs(55),
    backgroundColor: 'transparent',
    borderRadius: rs(5),
    paddingHorizontal: rs(10),
    borderWidth: rs(1),
    borderColor: '#000',
    width: '100%',
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: rs(10),
  },
  eyeIcon: {
    width: rs(24),
    height: rs(24),
  },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: rs(5),
    paddingVertical: rs(12),
    alignItems: 'center',
    marginTop: rs(20),
  },
  buttonText: {
    color: '#fff',
    fontSize: rs(16),
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: rs(10),
  },
  forgot: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: rs(1),
    marginBottom: rs(10),
  },
  forgotText: {
    color: '#920000',
    fontWeight: '500',
    lineHeight: rs(20),
    fontSize: rs(16),
  },
  signupText: {
    fontWeight: '500',
  },
});

export default ResetPassword;
