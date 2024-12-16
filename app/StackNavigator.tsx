import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoutineScreen from "@/screens/RoutineScreen";
import TrainingScreen from "@/screens/TrainingScreen";
import RestScreen from "@/screens/RestScreen";
import TabNavigator from "@/app/TabNavigator";
import CongratulationsScreen from "@/screens/CongratulationsScreen";
import LoginScreen from "@/screens/LoginScreen";
import SignUpScreen from "@/screens/SignUpScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import ProfilePictureScreen from "@/screens/ProfilePictureScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
      <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Routine"
          component={RoutineScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Training"
          component={TrainingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Rest"
          component={RestScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Congratulations"
          component={CongratulationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfilePicture"
          component={ProfilePictureScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
