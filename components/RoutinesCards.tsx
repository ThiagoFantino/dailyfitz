import { StyleSheet, Text, Pressable, Image, ScrollView, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { backendURL } from '@/config';

const Routines = ({ userId }) => {
  const navigation = useNavigation();
  const [routines, setRoutines] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState<any>({}); // Estado de carga por imagen

  // Función para obtener los datos de las rutinas
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

  // Función de manejo de inicio de carga de imagen
  const handleImageLoadStart = useCallback((id: string) => {
    setLoadingImages(prev => {
      if (prev[id] !== true) {
        return { ...prev, [id]: true }; // Solo actualiza si no está en el estado correcto
      }
      return prev;
    });
  }, []);

  // Función de manejo de fin de carga de imagen
  const handleImageLoad = useCallback((id: string) => {
    setLoadingImages(prev => {
      if (prev[id] !== false) {
        return { ...prev, [id]: false }; // Solo actualiza si no está en el estado correcto
      }
      return prev;
    });
  }, []);

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
              onLoadStart={() => handleImageLoadStart(item.id)} // Cuando empieza la carga
              onLoad={() => handleImageLoad(item.id)} // Cuando termina la carga
            />
          </View>
          <Text style={styles.text}>{item.name}</Text>
        </Pressable>
      ))}

      {/* Botón para crear una rutina personalizada */}
      <Pressable
        onPress={() => navigation.navigate("CustomRoutine", { userId })}
        style={styles.createRoutineButton}
      >
        <Text style={styles.createRoutineButtonText}>Crear Rutina Personalizada</Text>
      </Pressable>
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
  createRoutineButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  createRoutineButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
