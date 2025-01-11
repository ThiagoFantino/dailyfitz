import { StyleSheet, Text, Pressable, Image, ScrollView, View, ActivityIndicator } from "react-native";
import React, { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { backendURL } from "@/config";

const Routines = ({ userId }) => {
  const navigation = useNavigation();
  const [routines, setRoutines] = useState([]);
  const [loadingImages, setLoadingImages] = useState({});

  const fetchData = async () => {
    try {
      const response = await fetch(`${backendURL}/routines?userId=${userId}`);
      const json = await response.json();
      setRoutines(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userId])
  );

  const handleImageLoadStart = useCallback((id) => {
    setLoadingImages((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleImageLoad = useCallback((id) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
  }, []);

  const customRoutines = routines.filter((item) => item.isCustom && item.userId === userId);
  const predefinedRoutines = routines.filter((item) => !item.isCustom);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Mostrar rutinas personalizadas si existen */}
      {customRoutines.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Tus Rutinas Personalizadas</Text>
          {customRoutines.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                navigation.navigate("Routine", {
                  image: item.image,
                  id: item.id,
                  userId,
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
                  onLoadStart={() => handleImageLoadStart(item.id)}
                  onLoad={() => handleImageLoad(item.id)}
                />
              </View>
              <Text style={styles.text}>{item.name}</Text>
            </Pressable>
          ))}
        </>
      )}

      {/* Mostrar rutinas predefinidas si existen */}
      {predefinedRoutines.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Rutinas Predefinidas</Text>
          {predefinedRoutines.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                navigation.navigate("Routine", {
                  image: item.image,
                  id: item.id,
                  userId,
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
                  onLoadStart={() => handleImageLoadStart(item.id)}
                  onLoad={() => handleImageLoad(item.id)}
                />
              </View>
              <Text style={styles.text}>{item.name}</Text>
            </Pressable>
          ))}
        </>
      )}

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
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "flex-start",
    marginLeft: 10,
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


