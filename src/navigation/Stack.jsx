import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { extendTheme, NativeBaseProvider } from "native-base";

import SplashScreen from "../page/SplashScreen/SplashScreen";
import BottomStack from "./BottomStack";
import VideoBackgroundScreen from "../page/Welcome/welcome";
import Login from "../page/Login/Login";
import CameraScreen from "../page/Camera/Camera";
import Plant from "../page/Plant/Plant";
import Analyze from "../page/Analyze/Analyze";
import AnalyzeResult from "../page/AnalyzeResult/AnalyzeResult";
import CheckEmail from "../page/ForgotPassword/CheckEmail";
import CreateNewPassword from "../page/ForgotPassword/CreateNewPassword";
import ResetPassword from "../page/ForgotPassword/ResetPassword";
import ChangePassword from "../page/changePassword/ChangePassword";
import Profile from "../page/Profile/Profile";
import ChatScreen from "../page/Chat/Chat";
import Registration from "../page/Registration/Registration";
import Quiz from "../page/PlantQuiz/PlantQuiz";
import Toast from "react-native-toast-message";
import PaymentScreen from "../page/payment";
import HistoryScreen from "../page/History";
import VerifyEmail from "../page/VerifiyAccount";

const Stack = createStackNavigator();
const newColorTheme = {
  brand: {
    bg: "#1ABC76",
  },
};
const theme = extendTheme({ colors: newColorTheme });

function StackNav() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="splash">
          <Stack.Screen
            name="splash"
            options={{ headerShown: false }}
            component={SplashScreen}
          />
          <Stack.Screen
            name="bottom"
            options={{ headerShown: false }}
            component={BottomStack}
          />
          <Stack.Screen
            name="welcome"
            options={{ headerShown: false }}
            component={VideoBackgroundScreen}
          />
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={Login}
          />
          <Stack.Screen
            name="Camera"
            options={{ headerShown: false }}
            component={CameraScreen}
          />
          <Stack.Screen
            name="PlantRoute"
            options={{ headerShown: false }}
            component={Plant}
          />
          <Stack.Screen
            name="paymenthistory"
            options={{ headerShown: false }}
            component={HistoryScreen}
          />
          <Stack.Screen
            name="payment"
            options={{ headerShown: false }}
            component={PaymentScreen}
          />
          <Stack.Screen
            name="Analyze"
            options={{ headerShown: false }}
            component={Analyze}
          />
          <Stack.Screen
            name="AnalyzeResult"
            options={{ headerShown: false }}
            component={AnalyzeResult}
          />
          <Stack.Screen
            name="CheckEmail"
            options={{ headerShown: false }}
            component={CheckEmail}
          />
          <Stack.Screen
            name="CreateNewPassword"
            options={{ headerShown: false }}
            component={CreateNewPassword}
          />
          <Stack.Screen
            name="ResetPassword"
            options={{ headerShown: false }}
            component={ResetPassword}
          />
          <Stack.Screen
            name="ChangePassword"
            options={{ headerShown: false }}
            component={ChangePassword}
          />
          <Stack.Screen
            name="ProfileTab"
            options={{ headerShown: false }}
            component={Profile}
          />
          <Stack.Screen
            name="ChatScreen"
            options={{ headerShown: false }}
            component={ChatScreen}
          />
          <Stack.Screen
            name="Registration"
            options={{ headerShown: false }}
            component={Registration}
          />
          <Stack.Screen
            name="Quiz"
            options={{ headerShown: false }}
            component={Quiz}
          />
             <Stack.Screen
            name="verifyemail"
            options={{ headerShown: false }}
            component={VerifyEmail}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </NativeBaseProvider>
  );
}

export default StackNav;
