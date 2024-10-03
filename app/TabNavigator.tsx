import { StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import StackNavigator from "./StackNavigator";
import UserScreen from "@/screens/UserScreen";
import HomeScreen from "@/screens/HomeScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Asigna el ícono según la ruta
          if (route.name === "Rutinas") {
            iconName = "barbell"; // Ícono de pesa
          } else if (route.name === "Estadisticas") {
            iconName = "person-circle-outline"; // Ícono de persona en círculo
          }

          // Retorna el ícono correspondiente
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#246EE9', // Color para el ícono activo
        tabBarInactiveTintColor: "gray", // Color para el ícono inactivo
      })}
    >
      <Tab.Screen
        name="Rutinas"
        component={StackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Estadisticas"
        component={UserScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({});
