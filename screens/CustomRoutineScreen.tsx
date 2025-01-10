import {
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  View,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { backendURL } from "@/config";

const CustomRoutineScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [routineName, setRoutineName] = useState("");

  useEffect(() => {
    fetch(`${backendURL}/routines/exercises`)
      .then((response) => response.json())
      .then((data) => {
        setExercises(data);
        setLoadingExercises(false);
      })
      .catch((error) => {
        console.error("Error fetching exercises:", error);
        setLoadingExercises(false);
      });
  }, []);

  const handleSelectExercise = (exercise) => {
    if (!sets || !reps) {
      alert("Por favor, ingresa sets y reps para el ejercicio.");
      return;
    }

    setSelectedExercises((prevState) => [
      ...prevState,
      { ...exercise, sets: parseInt(sets, 10), reps: parseInt(reps, 10) },
    ]);
    setSets("");
    setReps("");
  };

  const handleSaveRoutine = () => {
    if (!routineName.trim()) {
      alert("Por favor, ingresa un nombre para la rutina.");
      return;
    }

    const routineData = {
      name: routineName,
      userId: userId,
      exercises: selectedExercises,
      image: selectedImage || "",
    };

    fetch(`${backendURL}/routines/create-custom-routine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routineData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Rutina guardada:", data);
        navigation.navigate("Home");
      })
      .catch((error) => console.error("Error saving routine:", error));
  };

  const routineImages = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Lionel_Messi_WC2022.jpg/640px-Lionel_Messi_WC2022.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/400px-Cristiano_Ronaldo_2018.jpg",
    "https://images.ctfassets.net/3mv54pzvptwz/55YLwKPDnRXkqMBITRpWbC/0c2aefc04afa455c20e9ca0d209698e0/53174188191_42d4c831ae_o.jpg",
  ];

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const renderImageItem = ({ item }) => (
    <Pressable onPress={() => handleImageSelect(item)} style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      {selectedImage === item && <Text style={styles.selectedText}>Seleccionado</Text>}
    </Pressable>
  );

  if (loadingExercises) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Crear Rutina Personalizada</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la rutina"
            value={routineName}
            onChangeText={setRoutineName}
          />
          <Text style={styles.subtitle}>Selecciona los ejercicios</Text>
        </View>
      }
      data={exercises}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable style={styles.exerciseItem} onPress={() => handleSelectExercise(item)}>
          <View style={styles.exerciseContainer}>
            <Image source={{ uri: item.image }} style={styles.exerciseImage} />
            <Text style={styles.exerciseName}>{item.name}</Text>
          </View>
        </Pressable>
      )}
      
      
      ListFooterComponent={
        <View>
          <TextInput
            style={styles.input}
            placeholder="Sets"
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
          />
          <TextInput
            style={styles.input}
            placeholder="Reps"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />
          <Text style={styles.subtitle}>Ejercicios seleccionados</Text>
          <FlatList
            data={selectedExercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.selectedExercise}>
                <Text>
                  {item.name} - Sets: {item.sets} - Reps: {item.reps}
                </Text>
              </View>
            )}
          />
          <Text style={styles.subtitle}>Selecciona una imagen para la rutina</Text>
          <FlatList
            data={routineImages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderImageItem}
            horizontal
            contentContainerStyle={styles.imageList}
          />
          <Pressable style={styles.saveButton} onPress={handleSaveRoutine}>
            <Text style={styles.saveButtonText}>Guardar Rutina</Text>
          </Pressable>

          {/* Botón adicional para volver a la Home Page */}
          <Pressable
            style={styles.homeButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.homeButtonText}>Volver a Inicio</Text>
          </Pressable>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  exerciseItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 5,
    borderRadius: 5,
  },
  selectedExercise: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
    borderRadius: 5,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  homeButton: {
    marginTop: 10,
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageList: {
    marginBottom: 30,
  },
  imageContainer: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  selectedText: {
    marginTop: 5,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  exerciseItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 5,
    borderRadius: 5,
    flexDirection: "row",  // Alinea los elementos horizontalmente
    alignItems: "center",  // Alinea verticalmente el contenido
  },
  
  exerciseContainer: {
    flexDirection: "row",  // Alinea la imagen y el nombre horizontalmente
    alignItems: "center",  // Centra verticalmente
  },
  
  exerciseImage: {
    width: 50,    // Ajusta el tamaño de la imagen
    height: 50,   // Ajusta el tamaño de la imagen
    borderRadius: 5,
    marginRight: 10,  // Espacio entre la imagen y el nombre
  },
  
  exerciseName: {
    fontSize: 16,   // Ajusta el tamaño de la fuente del nombre
    fontWeight: "bold",  // Opcional: hacer el nombre en negrita
  }  
});

export default CustomRoutineScreen;
