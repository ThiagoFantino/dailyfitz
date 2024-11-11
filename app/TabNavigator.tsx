import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import UserScreen from "@/screens/UserScreen";
import HomeScreen from "@/screens/HomeScreen";
import { useRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const route = useRoute();
  const id = route.params?.id;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Rutinas") {
            iconName = "barbell";
          } else if (route.name === "Perfil") {
            iconName = "person-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#246EE9', 
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Rutinas"
        component={HomeScreen}
        options={{ headerShown: false }}
        initialParams={{ id: id }}
      />
      <Tab.Screen
        name="Perfil"
        component={UserScreen}
        options={{ headerShown: false }}
        initialParams={{ id: id }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
