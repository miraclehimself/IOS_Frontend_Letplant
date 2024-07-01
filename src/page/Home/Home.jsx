import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Linking,
  Alert,
  ToastAndroid,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Box,
  Card,
  Center,
  HStack,
  Image,
  Skeleton,
  Stack,
  Text,
} from 'native-base';
import calculateResponsiveFontSize from '../../utils/font';
import {useNavigation} from '@react-navigation/native';
import {useGetAllProcessPlantQuery, useGetUserQuery} from '../../redux/api';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch, useSelector} from 'react-redux';
import {setItem, setLocationAction} from '../../redux/authenticationSlice';
import {useIsFocused} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import {returnArray} from '../../utils/generalItem';
import {format} from 'date-fns';
import {rs} from 'react-native-full-responsive';
const key = '9a1e9c857bbf04988d1d8201eeba3f6e';
const Home = () => {
  const {data, isLoading, isSuccess, error} = useGetUserQuery();
  const {
    data: Plant,
    isLoading: isLoadingPlant,
    isSuccess: isSuccessPlant,
  } = useGetAllProcessPlantQuery();
  const [weatherLoading, setWeatherLoading] = useState(false);
  const navigation = useNavigation();
  const location = useSelector(state => state.auth.location);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [weatherForcast, setWeatherForcast] = useState(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      setIsPermissionGranted(true);
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      setIsPermissionGranted(false);
      Alert.alert(
        `Turn on Location Services to allow "Your App Name" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (isFocused) {
      if (Platform.OS === 'ios') {
        const hasPermission = await hasPermissionIOS();
        return hasPermission;
      }

      if (Platform.OS === 'android' && Platform.Version < 23) {
        setIsPermissionGranted(true);
        return true;
      }

      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (hasPermission) {
          setIsPermissionGranted(true);
          return true;
        }

        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Your App Name needs location Permission',
            message:
              'Your App Name needs access to your location ' +
              'so we can have access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) {
          setIsPermissionGranted(true);
          return true;
        }

        if (status === PermissionsAndroid.RESULTS.DENIED) {
          setIsPermissionGranted(false);

          ToastAndroid.show(
            'Location permission denied by user.',
            ToastAndroid.LONG,
          );
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setIsPermissionGranted(false);

          ToastAndroid.show(
            'Location permission revoked by user.',
            ToastAndroid.LONG,
          );
        }
        setIsPermissionGranted(false);

        return false;
      } catch (error) {
        // console.error(error);
      }
    }
    setIsPermissionGranted(false);

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      // Handle when permission is denied
      return;
    } else {
      Geolocation.getCurrentPosition(
        position => {
          dispatch(
            setLocationAction({
              latitude: position?.coords?.latitude,
              longitude: position?.coords?.longitude,
            }),
          );
          // console.log(position);
        },
        error => {
          // Handle error when getting location
          // console.error(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
        },
      );
    }
  };

  function getGreeting() {
    var currentDate = new Date();
    var currentHour = currentDate.getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning!';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good afternoon!';
    } else {
      return 'Good evening!';
    }
  }
  function formatDate(dateString) {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
      date,
    );

    const day = date.getDate();
    const suffix = getDaySuffix(day);

    return formattedDate.replace(/\d{1,2}/, day + suffix);
  }

  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
  // console.log(data);
  const item = Plant && Plant[0];

  const getWeatherData = async lat => {
    setWeatherLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat.latitude}&lon=${lat.longitude}&appid=${key}&units=metric`,
      );
      setWeatherForcast(response?.data);
    } catch (error) {
    } finally {
      setWeatherLoading(false);
    }
  };
  // console.log(weatherForcast, "weather")
  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      getWeatherData(location);
    }
  }, [location]);
  const goChangeProfile = () => {
    navigation.navigate('ProfileTab');
  };
  const goHistoryScreen = () => {
    navigation.navigate('paymenthistory');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <Center>
        <Box
          bg="white"
          borderRadius="md"
          p={4}
          mt={4}
          style={styles.shadow}
          width="95%"
          _light={{borderColor: 'gray.200'}}
          _dark={{borderColor: 'gray.700'}}
          borderWidth={1}>
          <HStack
            h="auto"
            bg="transparent"
            py="3"
            mt="2"
            justifyContent="space-between"
            alignItems="center"
            w="100%">
            <HStack space={2}>
              <TouchableWithoutFeedback onPress={goChangeProfile}>
                <Stack
                  w={calculateResponsiveFontSize(25)}
                  h={calculateResponsiveFontSize(25)}
                  borderRadius="20">
                  {data?.data?.user.avatar_url ? (
                    <FastImage
                      style={{
                        width: calculateResponsiveFontSize(25),
                        height: calculateResponsiveFontSize(25),
                        borderRadius: calculateResponsiveFontSize(30),
                      }}
                      source={{
                        uri: data?.data?.user.avatar_url,
                        // headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  ) : (
                    <Image
                      source={require('../../images/Profile.png')}
                      alt="image"
                      borderRadius="md"
                    />
                  )}
                </Stack>
              </TouchableWithoutFeedback>
              <Stack>
                <Text color="#000" fontSize="lg" fontWeight="bold">
                  Hello!
                </Text>
                <Text color="#000" fontSize="md" fontWeight="400">
                  {getGreeting()}
                </Text>
                {isLoading && <Skeleton.Text />}

                {isSuccess && (
                  <Text color="#000" fontSize="md" fontWeight="400">
                    {data?.data?.user?.name}
                  </Text>
                )}
              </Stack>
            </HStack>

            <TouchableWithoutFeedback onPress={goHistoryScreen}>
              <Image
                source={require('../../images/history-icon.png')}
                alt="image"
                borderRadius="md"
              />
            </TouchableWithoutFeedback>
          </HStack>
          {data?.data?.user?.subscription_status && (
            <HStack w="100%" justifyContent="space-between" alignItems="center">
              <HStack space={1} alignItems="center">
                <Text style={[styles.font, {textTransform: 'uppercase'}]}>
                  Subscription:
                </Text>
                <Text style={{textTransform: 'uppercase'}}>
                  {data?.data?.user?.subscription_status}
                </Text>
              </HStack>
              {data?.data?.user?.subscription_status === 'FREE' ||
                ('EXPIRED' && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('payment');
                    }}
                    style={{
                      backgroundColor: '#1ABC76',
                      padding: rs(6),
                      borderRadius: rs(5),
                    }}>
                    <Text
                      style={{
                        fontSize: rs(16),
                        color: '#fff',
                        fontWeight: '400',
                      }}>
                      Subscribe
                    </Text>
                  </TouchableOpacity>
                ))}
            </HStack>
          )}

          {data?.data?.user?.subscription_due_date && (
            <HStack w="100%" my="2" space={1} alignItems="center">
              <Text style={[styles.font, {textTransform: 'uppercase'}]}>
                Due Date:
              </Text>
              <Text
                style={{
                  textTransform: 'uppercase',
                  color: '#000',
                }}>
                {format(
                  new Date(data?.data?.user?.subscription_due_date),
                  'EEEE, dd, yyyy',
                )}
              </Text>
            </HStack>
          )}
          {data?.data &&
            typeof data?.data?.remaining_days == 'number' &&
            Number(data?.data?.remaining_days) !== 0 && (
              <HStack w="100%" my="2" space={1} alignItems="center">
                <Text style={styles.font}>Remaining Days:</Text>
                <Text
                  style={{
                    color:
                      Number(data?.data?.remaining_days) < 10 ? 'red' : '#000',
                    textTransform: 'uppercase',
                  }}>
                  {data?.data?.remaining_days}left
                </Text>
              </HStack>
            )}
        </Box>
      </Center>
      <Center>
        <Stack h="auto" bg="transparent" px="1" py="3" mt="1" w="100%">
          <Stack my="1" w="100%" justifyContent="center" alignItems="center">
            {weatherLoading && !weatherForcast && (
              <Skeleton h={calculateResponsiveFontSize(50)} />
            )}
            {weatherForcast && (
              <View style={styles.imageContainer}>
                <HStack
                  justifyContent="space-between"
                  w="90%"
                  alignItems="center">
                  <Text color="#fff" fontSize={rs(25)} fontWeight="800">
                    {weatherForcast?.main?.temp}⁰c
                  </Text>
                  {/* <Image
                    source={{
                      uri: `https://openweathermap.org/img/wn/${weatherForcast?.weather[0]?.icon + "@2x.png"}`,
                    }}
                    h={calculateResponsiveFontSize(25)}
                    w={calculateResponsiveFontSize(25)}
                    alt="image"
                  /> */}
                </HStack>
                <Text color="#fff" w="90%" fontSize={rs(16)} fontWeight="800">
                  {weatherForcast?.weather[0]?.description}
                </Text>
                <Text color="#fff" w="90%" fontSize={rs(12)} fontWeight="800">
                  {weatherForcast?.name}
                </Text>
              </View>
            )}
          </Stack>
        </Stack>
      </Center>

      <Stack bg="transparent" px="1" mt="1" flex="1" w="100%">
        <HStack mx="2" justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" color="#000" fontWeight="600">
            My Plant
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('Plant');
            }}>
            <Text>see more</Text>
          </TouchableWithoutFeedback>
        </HStack>
        {isLoadingPlant && (
          <Stack space={3}>
            <Skeleton h="24" />
          </Stack>
        )}
        {isSuccessPlant && Plant && Plant?.length > 0 && (
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate('AnalyzeResult');
              dispatch(
                setItem({
                  ...item,
                  isShowButton: false,
                }),
              );
            }}>
            <HStack
              style={styles.conBorderC}
              my="1"
              justifyContent="space-between"
              alignItems="center">
              <Stack w="20" h="16">
                {item?.plant_image ? (
                  <FastImage
                    style={{width: '100%', height: '100%'}}
                    source={{
                      uri: item?.image_url,
                      // headers: { Authorization: 'someAuthToken' },
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                ) : (
                  <Image
                    h="100%"
                    w="100%"
                    borderRadius="3"
                    source={require('../../images/flowerBase.png')}
                    alt="editor"
                  />
                )}
              </Stack>
              <Stack>
                <Text
                  style={{
                    fontSize: calculateResponsiveFontSize(5),
                  }}>
                  {returnArray(item?.name)}
                </Text>
                <Text fontSize="md" color="#000" fontWeight="600">
                  Botanica Name
                </Text>
                <Text fontSize={calculateResponsiveFontSize(4)} mt="2">
                  {formatDate(item?.created_at)}
                </Text>
              </Stack>
            </HStack>
          </TouchableWithoutFeedback>
        )}
        {isSuccessPlant && Plant && Plant?.length == 0 && (
          <Stack flex="1" alignItems="center" mt="10">
            <TouchableWithoutFeedback>
              <Image
                size="xl"
                source={require('../../images/nodata.png')}
                alt="no data"
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </Stack>
        )}
      </Stack>

      <TouchableOpacity
        style={styles.camera}
        onPress={() => {
          if (
            !data?.data?.user?.subscription_status ||
            data?.data?.user?.subscription_status === 'EXPIRED'
          ) {
            navigation.navigate('payment');
          } else {
            navigation.navigate('Camera');
          }
        }}>
        <Image source={require('../../images/Camera.png')} alt="ear" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  camera: {
    position: 'absolute',
    bottom: rs(150),
    right: rs(2),
    zIndex: rs(1000),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: rs(1),
    },
    shadowOpacity: rs(0.2),
    shadowRadius: rs(1.41),

    elevation: rs(2),
  },
  carouselItem: {
    width: rs(300),
    height: rs(150),
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationContainer: {
    paddingTop: rs(8),
    paddingBottom: rs(16),
  },
  paginationDot: {
    width: rs(10),
    height: rs(10),
    borderRadius: rs(5),
    marginHorizontal: rs(8),
    backgroundColor: 'blue',
  },

  conBorderC: {
    width: '100%',
    borderWidth: rs(0.8),
    borderColor: '#1ABC76',
    backgroundColor: 'rgba(1, 171, 118, 0.1)',
    borderRadius: rs(3),
    padding: rs(20),
  },
  imageContainer: {
    width: '100%',
    borderRadius: rs(10), // Apply border radius
    overflow: 'hidden', // Ensure content stays within rounded borders
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1ABC76',
    height: calculateResponsiveFontSize(55),
  },
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  font: {
    fontSize: rs(16),
    fontWeight: '500',
    color: '#000',
    textTransform: 'capitalize',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default Home;
