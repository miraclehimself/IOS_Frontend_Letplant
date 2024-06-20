/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {StatusBar, StyleSheet, View, useColorScheme} from 'react-native';
import StackNav from './src/navigation/Stack';
import {Provider, useDispatch} from 'react-redux';
import {store} from './src/redux/store';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { storage } from './src/redux/api';
import { setToken } from './src/redux/authenticationSlice';
function App() {
  const isDarkMode = useColorScheme() === 'dark';


  useEffect(() => {
    const auth = storage.getString("token");
    if(auth){
     store.dispatch(setToken(auth));
    }
  }, []);

  return (
    <>
      <Toast />
      <View style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="#1ABC76"
        />
        <Provider store={store}>
        <NavigationContainer>
        <StackNav />
        </NavigationContainer>
        </Provider>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
});

export default App;
