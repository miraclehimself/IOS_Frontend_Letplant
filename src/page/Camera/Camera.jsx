import {useIsFocused, useNavigation} from '@react-navigation/native';
import {HStack, Image, Spinner, Stack, Text} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useCameraPermission,
} from 'react-native-vision-camera';
import calculateResponsiveFontSize from '../../utils/font';
import {useGetUserQuery, useUploadDocumentMutation} from '../../redux/api';
import * as Progress from 'react-native-progress';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import {AxiosCall} from '../../redux/axios';
import {setItem} from '../../redux/authenticationSlice';
import {rs, rw} from 'react-native-full-responsive';
import useAppState from './useAppState';
const CameraScreen = () => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice("back");
  const navigation = useNavigation();
  const camera = useRef(null);
  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActiveFocused = isFocused && appState === "active";
  const [uri, seturi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useSelector(state => state.auth.location);
  const {data} = useGetUserQuery();
  const dispatch = useDispatch();
  const [progressBar, setProgressBar] = useState(0);
  const token = useSelector(state => state.auth.token);
  const photo = async () => {
    if (uri === null) {
      try {
        const p = await camera.current.takePhoto({
          flash: 'auto',
          skipMetadata: false,
        });
        seturi(p?.path);
      } catch (error) {}
    } else {
      const formData = new FormData();
      formData.append('plant_image', {
        uri: `file://${uri}`,
        type: 'image/jpeg', // Change the type if needed
        name: 'image.jpg',
      });
      formData.append('latitude', location?.latitude);
      formData.append('longitude', location?.longitude);
      formData.append('user', data?.data?.user.id);
      setIsLoading(true);
      const config = {
        onUploadProgress: progressEvent => {
          const {loaded, total} = progressEvent;
          const percentCompleted = (loaded / total) * 100;
          const step = total / 100; // Calculate step value to reach 100 steps
          const currentStep = Math.ceil(loaded / step); // Calculate the current step
          setProgressBar(Math.min(currentStep, 100)); // Ensure the progress doesn't exceed 100%
        },
      };

      try {
        const data = await AxiosCall(
          {
            path: 'https://letsplant-e2f1ec719b84.herokuapp.com/app/processplant',
            method: 'POST',
            data: formData,
            contentType: 'multipart/form-data', // Set content type for file upload
            token, // Pass the token
          },
          config, // Pass the config object
        );
        setIsLoading(false);
        if (data?.status === 'success') {
          navigation.navigate('AnalyzeResult');
          dispatch(
            setItem({
              ...data?.data,
              isShowButton: true,
            }),
          );
          seturi(null);
        }
      } catch (error) {
        setIsLoading(false);
        const formatError = formatError(error);
        if (formatError) {
          Toast.show({
            type: 'error',
            text1: '',
            text2: formatError ?? '',
          });
        }
      } finally {
      }
    }
  };
  const handleCameraErrror =(error)=>{
console.log(error)
  }
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (device && hasPermission) {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.closeIcon}
            source={require('../../images/XCircle.png')}
            alt="editor"
          />
        </TouchableWithoutFeedback>
        <Camera
          style={styles.camera}
          ref={camera}
          isActive={isActiveFocused}
          device={device}
          photo={true}
          onError={handleCameraErrror}
        />
        <View style={styles.cameraContainer}>
          <View style={styles.arcTopLeft} />
          <View style={styles.arcTopRight} />
          <View style={styles.arcBottomLeft} />
          <View style={styles.arcBottomRight} />
        </View>
        {isLoading && (
          <Stack mt="6" mb="2">
            <Progress.Bar
              color="#1ABC76"
              animated={true}
              indeterminate={true}
              width={rw(80)}
            />
          </Stack>
        )}

        {!isLoading && (
          <TouchableOpacity
            style={[
              styles.roundedButton,
              {
                backgroundColor: uri ? 'white' : '#1ABC76',
              },
            ]}
            onPress={photo}>
            {uri && (
              <Image
                h="7"
                w="7"
                source={require('../../images/sendletplant.png')}
                alt="editor"
              />
            )}
            {/* Your button icon or text here */}
          </TouchableOpacity>
        )}

        <Stack
          bg="transparent"
          px="1"
          position="absolute"
          bottom="15%"
          justifyContent="center"
          alignItems="center"
          w="100%"
          maxW="350">
          <Text
            textAlign="center"
            my="3"
            fontSize={rs(16)}
            color="#fff"
            fontWeight="500">
            {' '}
            When shooting, make sure the subject is in focus
          </Text>
          <HStack w="60%" justifyContent="center" alignItems="center">
            <Stack style={styles.conBorder}>
              <Image
                h="50"
                w="50"
                source={
                  uri
                    ? {uri: `file://${uri}`}
                    : require('../../images/small.png')
                }
                alt="editor"
              />
            </Stack>
          </HStack>
        </Stack>
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text fontSize="md" color="#000" fontWeight="600">
          Camera permission deny, Please try again.
        </Text>
      </View>
    );
  }
};
const buttonSize = 60; // Adjust the size of the rounded button
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // Place the Camera component in the background
  },
  cameraContainer: {
    backgroundColor: 'transparent',
    width: '80%',
    aspectRatio: 4 / 3,
    position: 'relative',
    overflow: 'hidden',
  },
  arcTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: rs(40),
    height: rs(40),
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderTopWidth: rs(8),
    borderLeftWidth: rs(8),
    borderRadius: rs(8),
    transform: [{rotate: '0deg'}, {rotate: '0deg'}],
  },
  arcTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: rs(40),
    height: rs(40),
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderTopWidth: rs(8),
    borderRightWidth: rs(8),
    borderRadius: rs(8),
    transform: [{rotate: '90deg'}, {rotate: '-90deg'}],
  },
  arcBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: rs(40),
    height: rs(40),
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderBottomWidth: rs(8),
    borderLeftWidth: rs(9),
    borderRadius: rs(8),
    transform: [{rotate: '-90deg'}, {rotate: '90deg'}],
  },
  arcBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: rs(40),
    height: rs(40),
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderRadius: 8,
    transform: [{rotate: '-90deg'}, {rotate: '90deg'}],
  },
  roundedButton: {
    position: 'absolute',
    bottom: rs(20),
    alignSelf: 'center',
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: rs(3),
    borderColor: '#1ABC76',
    left: '40%',
  },
  closeIcon: {
    position: 'absolute',
    top: rs(20),
    alignSelf: 'center',
    left: rs(20),
  },
  conBorder: {
    borderWidth: rs(0.8),
    borderColor: '#1ABC76',
    backgroundColor: 'rgba(1, 171, 118, 0.1)',
    borderRadius: rs(3),
    // padding:20
  },
});

export default CameraScreen;
