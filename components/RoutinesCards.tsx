import { StyleSheet, Text, View, Pressable, Image, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {backendURL} from '@/config'

const Routines = () => {
  const navigation = useNavigation<any>();
  const [routines, setRoutines] = useState([]); // Estado para almacenar las rutinas

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${backendURL}/routines`); // Cambia esta URL a tu endpoint
      const json = await response.json();
      setRoutines(json); // Asumiendo que la API devuelve un array de rutinas
      console.log(json)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {routines.map((item) => (
        <Pressable
          key={item.id}
          onPress={() =>
            navigation.navigate("Routine", {
              image: item.image,
              id: item.id,
            })
          }
          style={styles.pressable}
        >
          <Image style={styles.image} source={{ uri: item.image }} />
          <Text style={styles.text}>{item.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default Routines;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  pressable: {
    alignItems: "center",
    width: "95%",
    justifyContent: "center",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 15,
  },
  text: {
    position: "absolute",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    left: 20,
    top: 20,
  },
});

