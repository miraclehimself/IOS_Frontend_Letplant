import React, {useState, useRef, useEffect} from 'react';
import {HStack, Icon, Stack, useTheme} from 'native-base';
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
} from 'react-native';
import calculateResponsiveFontSize from '../../utils/font';
import {useNavigation} from '@react-navigation/native';
import {storage, useLoginAccountMutation} from '../../redux/api';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {setToken} from '../../redux/authenticationSlice';
import CustomButton from '../../component/CustomButton';
import {rs} from 'react-native-full-responsive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Login = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginAccount, {isLoading, isError, error}] = useLoginAccountMutation();
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    errors: {
      name: '',
      email: '',
      password: '',
    },
  });
  const dispatch = useDispatch();

  // Refs for input fields
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Function to focus on the first input field
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
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
    const {name, email, password} = formValues;
    const errors = {};
    if (email === '') {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email format';
    }

    if (password === '') {
      errors.password = 'Password is required';
    }

    // Update the state with the errors object
    setFormValues({
      ...formValues,
      errors,
    });

    // Check if there are no errors before proceeding with form submission
    if (Object.keys(errors).length === 0) {
      const d = {
        email: formValues.email,
        password: formValues.password,
      };

      try {
        const data = await loginAccount(d).unwrap();
        // Handle the response data accordingly (e.g., redirect to the home stack)
        const {token} = data;
        // console.log(token , "token")
        if (token) {
          storage.set('token', token);
          dispatch(setToken(token));
          navigation.replace('bottom');
        }
      } catch (error) {
        if (error) {
          // console.log(error, "errororo")
          if (
            error?.message.includes(
              'You are yet to verify your email, Another mail has been sent to your email address.',
            )
          ) {
            navigation.navigate('verifyemail', {email: formValues.email});
          } else {
            Toast.show({
              type: 'error',
              text1: '',
              text2: error?.error ?? '',
            });
          }
        }
      }
    }
  };

  const isValidEmail = email => {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const {colors} = useTheme();

  // Access the color from the theme
  const bgColor = colors.brand.bg;

  return (
    <ScrollView style={styles.container}>
      <Stack my="5" justifyContent="flex-end" alignItems="flex-end"></Stack>

      <Stack mt="5" mb="6">
        <Text
          style={[
            {
              fontSize: rs(23),
              color: '#000',
              fontWeight: '500',
              marginBottom: 1,
            },
          ]}>
          Welcome back!
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
      {isError && (
        <Text
          style={[
            {
              fontSize: rs(10),
              color: 'red',
              textAlign: 'center',
            },
          ]}>
          {error?.message ? error?.message : 'something went wrong'}
        </Text>
      )}
      <Stack mb="5" mt="5">
        <Text style={styles.inputText}> Email</Text>
        <TextInput
          ref={emailInputRef}
          style={styles.input}
          placeholder="Email"
          value={formValues.name}
          onChangeText={value => handleChange('email', value)}
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
            onChangeText={value => handleChange('password', value)}
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
            onPress={togglePasswordVisibility}>
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
      <Stack justifyContent="center" mt="10" alignItems="center" w="100%">
        <CustomButton
          bg={bgColor}
          color="#fff"
          w="100"
          borderColor={bgColor}
          handlePress={handleSubmit}
          isLoading={isLoading}
          text="Login"
        />
      </Stack>

      <Stack mt="10" w="100%" justifyContent="center" alignItems="center">
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('ResetPassword');
          }}
          style={{
            width: '50%',
          }}>
          <Text
            style={[
              {
                fontSize: rs(16),
                color: '#000',
                fontWeight: '500',
              },
            ]}>
            Reset password
          </Text>
        </TouchableWithoutFeedback>
      </Stack>
    </ScrollView>
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

export default Login;
