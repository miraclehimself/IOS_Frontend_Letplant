import React, {useEffect, useState} from 'react';
import {Avatar, Button, HStack, Spinner, Stack, useTheme} from 'native-base';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import calculateResponsiveFontSize from '../../utils/font';
import {useNavigation} from '@react-navigation/native';
import {useGetUserQuery, useUploadUserDocumentMutation} from '../../redux/api';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {rs, rw} from 'react-native-full-responsive';

import {openPicker} from 'react-native-image-crop-picker';

const Profile = () => {
  const dispacth = useDispatch();
  const {data, isSuccess} = useGetUserQuery();
  //  console.log(data)
  const navigation = useNavigation();
  const [uploadUserDocument, {isLoading, isError, error}] =
    useUploadUserDocumentMutation();
  const [formValues, setFormValues] = useState({
    email: '',
    fullname: '',
    uri: '',
    errors: {
      first: '',
      last: '',
    },
  });
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version < 33) {
          // Android 12 or below, request READ_EXTERNAL_STORAGE permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Permission to access photos',
              message: 'We need your permission to access your photos',
              buttonPositive: 'OK',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
          } else {
            setHasPermission(false);
          }
        } else {
          // Android 13 (Android S) and higher, request ACCESS_MEDIA_IMAGE permission
          const granted = await PermissionsAndroid.request(
            'android.permission.READ_MEDIA_IMAGES',
            {
              title: 'Permission to access photos',
              message: 'We need your permission to access your photos',
              buttonPositive: 'OK',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
          } else {
            setHasPermission(false);
          }
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (isSuccess || data) {
      setFormValues({
        email: data?.data?.user?.email,
        fullname: data?.data?.user.name,
        uri: data?.data?.user?.avatar_url ? data?.data?.user.avatar_url : '',
        errors: {
          fullname: '',
          uri: '',
        },
      });
    }
  }, [data]);

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
    const {uri, fullname} = formValues;
    const errors = {};

    if (uri === '') {
      errors.uri = 'Photo is required';
    } else if (!uri.endsWith('jpg')) {
      errors.uri = 'new photo is required';
    }

    if (fullname === '') {
      errors.fullname = 'Full Name is required';
    }

    // Update the state with the errors object
    setFormValues({
      ...formValues,
      errors,
    });

    // Check if there are no errors before proceeding with form submission
    if (Object.keys(errors).length === 0) {
      try {
        const formData = new FormData();
        formData.append('avatar', {
          uri: `${formValues?.uri}`,
          type: 'image/jpeg', // Change the type if needed
          name: 'image.jpg',
        });
        formData.append('name', formValues?.fullname);

        const data = await uploadUserDocument(formData).unwrap();
        // Handle the response data accordingly (e.g., redirect to the home stack)
        // console.log(data)
        if (data?.message) {
          Toast.show({
            type: 'success',
            text1: '',
            text2: data?.message,
          });
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

  const handleImagePicker = async () => {
    try {
      const response = await openPicker({
        mediaType: 'photo',
      });
      const asset = response?.path;
      handleChange('uri', asset);
    } catch (error) {
      console.log('Image picking or cropping error:', error);
    }
  };

  const {colors} = useTheme();

  // Access the color from the theme
  const bgColor = colors.brand.bg;
  // console.log(formValues, "fullname")
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          marginHorizontal: rs(20),
          flex: 1,
        }}>
        <HStack alignItems="center" space={rs(8)} mb="4">
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Image
              source={require('../../images/backArrow.png')}
              alt="editor"
            />
          </TouchableWithoutFeedback>
          <Text
            color="#000"
            style={{
              fontSize: calculateResponsiveFontSize(8),
            }}
            fontWeight="500">
            Profile Settings
          </Text>
        </HStack>

        <HStack
          w="full"
          justifyContent="center"
          alignItems="center"
          mb="10"
          position="relative">
          <Avatar
            bg="transparent"
            alignSelf="center"
            size="2xl"
            source={
              formValues?.uri
                ? {
                    uri: formValues.uri.startsWith('file')
                      ? formValues.uri
                      : formValues.uri,
                  }
                : require('../../images/Av.png')
            }>
            RB
          </Avatar>
          <Stack position="absolute" right="30%" bottom="0">
            <TouchableOpacity onPress={handleImagePicker}>
              <Image
                source={require('../../images/AddIcon.png')}
                alt="addicon"
              />
            </TouchableOpacity>
          </Stack>
        </HStack>
        {formValues?.errors?.uri && (
          <Text style={[styles.error, {textAlign: 'center'}]}>
            {formValues?.errors?.uri}
          </Text>
        )}

        <Stack mb="5" mt="5">
          <Text style={styles.inputText}> Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formValues.fullname}
            onChangeText={value => handleChange('fullname', value)}
          />
          {formValues?.errors?.fullname && (
            <Text style={styles.error}>{formValues?.errors?.fullname}</Text>
          )}
        </Stack>
        <Stack mb="5">
          <Text style={styles.inputText}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formValues.email}
            editable={false}
          />
        </Stack>

        <Stack flex="1" justifyContent="center" alignItems="center" w="100%">
          <Button
            bg={bgColor}
            onPress={handleSubmit}
            _hover={{
              backgroundColor: bgColor,
            }}
            px="2"
            py={3}
            w="90%">
            {isLoading ? (
              <Spinner
                accessibilityLabel="Loading posts"
                color={colors.brand.bg3}
              />
            ) : (
              <Text
                style={[
                  {
                    fontSize: calculateResponsiveFontSize(7),
                    color: '#fff',
                    fontWeight: '500',
                  },
                ]}>
                {' '}
                Update
              </Text>
            )}
          </Button>
        </Stack>
      </View>
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
    paddingTop: rs(10),
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
    marginTop: 1,
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

export default Profile;
