import {
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {
  Box,
  Center,
  HStack,
  Image,
  Skeleton,
  Stack,
  StatusBar,
  Text,
} from 'native-base';
import calculateResponsiveFontSize from '../../utils/font';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {clearToken} from '../../redux/authenticationSlice';
import {
  storage,
  useDeleteAccountMutation,
  useGetUserQuery,
} from '../../redux/api';
import FastImage from 'react-native-fast-image';
import DeleteAccount from './deleteModal';
import LogoutAccount from './logOutModal';
import {rs} from 'react-native-full-responsive';

function More() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {data, isLoading, isSuccess, error} = useGetUserQuery();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisibleLogout, setModalVisibleLogOut] = React.useState(false);

  const [deleteAccount, {isLoading: isLoadingDelete}] =
    useDeleteAccountMutation();
  // console.log(data, "data of more")
  const handleSubmit = async () => {
    try {
      const data = await deleteAccount().unwrap();
      // Handle the response data accordingly (e.g., redirect to the home stack)
      if (data) {
        storage.clearAll('token');
        dispatch(clearToken());
      }
    } catch (error) {
      if (error) {
        Toast.show({
          type: 'error',
          text1: '',
          text2: error?.error ?? '',
        });
      }
    }
  };

  const logout = async () => {
    navigation.replace('welcome');
    storage.clearAll('token');
  };
  const goChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const goChangeProfile = () => {
    navigation.navigate('ProfileTab');
  };

  const goChatScreen = () => {
    navigation.navigate('ChatScreen');
  };
  const goHistoryScreen = () => {
    navigation.navigate('paymenthistory');
  };

  const handleEmailPress = async () => {
    const recipientEmail = 'Hi@letplant.com';
    const subject = 'Hi Leplant';
    const body = 'How can we help you?';

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const emailUrl = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;

    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      console.log(canOpen)
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        console.log('error in open link');
      }
    } catch (error) {
      console.error(
        'An error occurred while trying to open the email URL:',
        error,
      );
    }
  };
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <StatusBar bg="#fff" barStyle="dark-content" />

        <Center>
          <HStack
            bg="transparent"
            px="1"
            py="3"
            mt="5"
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            maxW="350">
            <HStack space={2}>
              <Stack w="20" h="20">
                {data?.data?.avatar ? (
                  <FastImage
                    style={{width: '100%', height: '100%', borderRadius: 10}}
                    source={{
                      uri: `https://letsplant-e2f1ec719b84.herokuapp.com${data?.data?.avatar}`,
                      // headers: { Authorization: 'someAuthToken' },
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                ) : (
                  <Image
                    source={require('../../images/Profile.png')}
                    alt="ear"
                  />
                )}
              </Stack>
              <Stack>
                <Text color="#000" fontSize="lg" fontWeight="bold">
                  Hello!
                </Text>
                <Text color="#000" fontSize="md" fontWeight="400">
                  Good Afternoon
                </Text>
                {isLoading && <Skeleton.Text />}

                {/* {
            isSuccess &&  <Text   color="#000" fontSize={calculateResponsiveFontSize(5)} fontWeight="400">
           {
            data?.data?.email
           }
            </Text>
          } */}
                {isSuccess && (
                  <Text color="#000" fontSize="md" fontWeight="400">
                    {data?.data?.name}
                  </Text>
                )}
              </Stack>
            </HStack>
            <Stack></Stack>
          </HStack>
        </Center>
        <Center>
          <Stack bg="transparent" px="1" py="3" mt="2" w="100%" maxW="350">
            <Stack>
              <Text color="#000" fontSize="md" fontWeight="400">
                Account
              </Text>
              <Stack my="2" style={styles.conBorder}>
                <TouchableWithoutFeedback onPress={goChangeProfile}>
                  <HStack alignItems="center" space="2">
                    <Image
                      source={require('../../images/Profile.png')}
                      alt="ear"
                    />
                    <Text color="#000" fontSize="md" fontWeight="400">
                      My Profile
                    </Text>
                  </HStack>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={goHistoryScreen}>
                  <HStack mt="3" alignItems="center" space="2">
                    <Image
                      source={require('../../images/history-p-icon.png')}
                      alt="ear"
                    />
                    <Text color="#000" fontSize="md" fontWeight="400">
                      Payment History
                    </Text>
                  </HStack>
                </TouchableWithoutFeedback>
              </Stack>
            </Stack>

            <Stack my="2">
              <Text color="#000" fontSize="md" fontWeight="400">
                Security
              </Text>
              <Stack my="2" style={styles.conBorder}>
                <TouchableWithoutFeedback onPress={goChangePassword}>
                  <HStack alignItems="center" space="2">
                    <Image
                      source={require('../../images/ChangePassword.png')}
                      alt="ear"
                    />
                    <Text color="#000" fontSize="md" fontWeight="400">
                      Change Password
                    </Text>
                  </HStack>
                </TouchableWithoutFeedback>
                {/* <HStack mt="3" alignItems="center" space="2">
<Image source={require('../../images/ResetPassword.png')} alt="ear"  />
<Text  color="#000" fontSize="md" fontWeight="400">Reset password</Text>
    
</HStack> */}
              </Stack>
            </Stack>

            <Stack my="2">
              <Text color="#000" fontSize="md" fontWeight="400">
                Help
              </Text>
              <Stack my="2" style={styles.conBorder}>
                <TouchableWithoutFeedback onPress={handleEmailPress}>
                  <HStack alignItems="center" space="2">
                    <Image
                      source={require('../../images/CustomerService.png')}
                      alt="ear"
                    />
                    <Text color="#000" fontSize="md" fontWeight="400">
                      Customer Service
                    </Text>
                  </HStack>
                </TouchableWithoutFeedback>

                {/* <TouchableWithoutFeedback onPress={goChatScreen}>
                <HStack mt="3" alignItems="center" space="2">
                  <Image
                    source={require('../../images/ChatUs.png')}
                    alt="ear"
                  />
                  <Text color="#000" fontSize="md" fontWeight="400">
                    Chat with us
                  </Text>
                </HStack>
              </TouchableWithoutFeedback> */}
              </Stack>
            </Stack>
            <Stack my="2">
              <Stack
                my="2"
                mb={calculateResponsiveFontSize(40)}
                style={styles.conBorder}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
                  <HStack alignItems="center" space="2">
                    <Image
                      source={require('../../images/DeleteAccount.png')}
                      alt="ear"
                    />
                    <Text color="#000" fontSize="md" fontWeight="400">
                      Delete Account
                    </Text>
                  </HStack>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => setModalVisibleLogOut(true)}>
                  <HStack mt="3" alignItems="center" space="2">
                    <Image
                      source={require('../../images/LogOut.png')}
                      alt="ear"
                    />
                    <Text color="#000" fontSize="md" fontWeight="400">
                      Log out
                    </Text>
                  </HStack>
                </TouchableWithoutFeedback>
              </Stack>
            </Stack>
          </Stack>
        </Center>
        <DeleteAccount
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          isLoadingDelete={isLoadingDelete}
          handleSubmit={handleSubmit}
        />

        <LogoutAccount
          modalVisible={modalVisibleLogout}
          setModalVisible={setModalVisibleLogOut}
          handleSubmit={logout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    position: 'absolute',
    bottom: rs(150),
    right: rs(3),
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: rs(2),
  },

  conBorder: {
    width: '100%',
    padding: rs(30),
    borderWidth: rs(0.8),
    borderColor: '#1ABC76',
    backgroundColor: 'rgba(1, 171, 118, 0.1)',
    borderRadius: rs(3),
  },
});

export default More;
