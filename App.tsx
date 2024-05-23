/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, StyleSheet, View, useColorScheme} from 'react-native';
import StackNav from './src/navigation/Stack';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import Toast from 'react-native-toast-message';
function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <>
      <Toast />
      <View style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="#1ABC76"
        />
        <Provider store={store}>
          <StackNav />
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
