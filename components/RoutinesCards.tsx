import { StyleSheet, Text, Pressable, Image, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {backendURL} from '@/config'

const Routines = ({ userId }) => {
  const navigation = useNavigation<any>();
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${backendURL}/routines`); 
      const json = await response.json();
      setRoutines(json); 
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
              userId: userId,
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

