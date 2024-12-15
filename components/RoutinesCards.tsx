import { StyleSheet, Text, Pressable, Image, ScrollView, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { backendURL } from '@/config';

const Routines = ({ userId }) => {
  const navigation = useNavigation<any>();
  const [routines, setRoutines] = useState<any[]>([]);

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

  const [loadingImages, setLoadingImages] = useState<any>({}); // Mantiene el estado de carga por imagen

  const handleImageLoad = (id: string) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false })); // Cambia el estado de carga para la imagen específica
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
          <View style={styles.imageContainer}>
            {loadingImages[item.id] && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={styles.loadingIndicator}
              />
            )}
            <Image
              style={styles.image}
              source={{ uri: item.image }}
              onLoad={() => handleImageLoad(item.id)} // Cuando la imagen se carga, actualizar el estado
              onLoadStart={() => setLoadingImages((prev) => ({ ...prev, [item.id]: true }))}
            />
          </View>
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
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
    borderRadius: 15,
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
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
