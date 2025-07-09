import { StyleSheet, Text, Pressable, Image, ScrollView, View, ActivityIndicator } from "react-native";
import React, { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { backendURL } from "@/config";

const Routines = ({ userId }) => {
  const navigation = useNavigation();
  const [routines, setRoutines] = useState([]);
  const [loadingImages, setLoadingImages] = useState({});

  const fetchData = useCallback(() => {
    async function fetchRoutines() {
      try {
        const response = await fetch(`${backendURL}/routines?userId=${userId}`);
        const json = await response.json();
        setRoutines(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchRoutines();
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleImageLoadStart = useCallback((id) => {
    setLoadingImages((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: true };
    });
  }, []);

  const handleImageLoad = useCallback((id) => {
    setLoadingImages((prev) => {
      if (prev[id] === false) return prev;
      return { ...prev, [id]: false };
    });
  }, []);

  const customRoutines = routines.filter((item) => item.isCustom && item.userId === userId);
  const predefinedRoutines = routines.filter((item) => !item.isCustom);

  const deleteRoutine = async (id) => {
    try {
      const response = await fetch(`${backendURL}/routines/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRoutines(routines.filter((routine) => routine.id !== id));
      } else {
        console.error("Error deleting routine");
      }
    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        onPress={() => navigation.navigate("CustomRoutine", { userId })}
        style={styles.createRoutineButton}
      >
        <Text style={styles.createRoutineButtonText}>Crear Rutina Personalizada</Text>
      </Pressable>

      {customRoutines.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Tus Rutinas Personalizadas</Text>
          {customRoutines.map((item) => (
            <View key={item.id} style={styles.pressable}>
              <Pressable
                onPress={() =>
                  navigation.navigate("Routine", {
                    image: item.image,
                    id: item.id,
                    userId,
                  })
                }
                style={styles.imageContainer}
              >
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
                <Text style={styles.text}>{item.name}</Text>
              </Pressable>

            </View>
          ))}
        </>
      )}

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
    backgroundColor: "#246EE9",
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
  deleteButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});


