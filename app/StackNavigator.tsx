import { StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/HomeScreen";
import RoutineScreen from "@/screens/RoutineScreen";
import TrainingScreen from "@/screens/TrainingScreen";
import RestScreen from "@/screens/RestScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
