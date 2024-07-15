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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import calculateResponsiveFontSize from '../../utils/font';
import OTPTextView from 'react-native-otp-textinput';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setPasswordAction} from '../../redux/authenticationSlice';
import CustomButton from '../../component/CustomButton';
import {rs} from 'react-native-full-responsive';
import {Stack, useTheme} from 'native-base';
const CheckEmail = () => {
  const dispatch = useDispatch();
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const input = useRef(null);

  const clear = () => input.current?.clear();

  const updateOtpText = () => input.current?.setValue(otpInput);

  const handleCellTextChange = async (text, i) => {
    if (i === 0) {
      const clippedText = await Clipboard.getString();
      if (clippedText.slice(0, 1) === text) {
        input.current?.setValue(clippedText, true);
        setOtpError('');
      }
    }
  };

  const {colors} = useTheme();

  // Access the color from the theme
  const bgColor = colors.brand.bg;
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (otpInput.length === 4) {
      dispatch(setPasswordAction(otpInput));
      navigation.navigate('CreateNewPassword');
    } else {
      setOtpError('Otp must be 4 digits');
    }
  };

  return (
    <SafeAreaView style={styles.box}>
     <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style={styles.box}>
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
          <OTPTextView
            ref={input}
            containerStyle={styles.textInputContainer}
            handleTextChange={setOtpInput}
            handleCellTextChange={handleCellTextChange}
            inputCount={4}
            keyboardType="numeric"
          />
        </View>
        {otpError && <Text style={styles.error}>{otpError}</Text>}

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
     </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputStyles: {
    borderWidth: rs(1),
    borderBottomColor: 'gray',
    padding: rs(15),
  },
  box:{ flex:1},
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
