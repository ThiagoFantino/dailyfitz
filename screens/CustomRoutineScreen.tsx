import {
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
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
  const [currentIndex, setCurrentIndex] = useState(0);

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
    "https://img.freepik.com/fotos-premium/atleta-esta-parado-sobre-sus-rodillas-cerca-barra-gimnasio-esta-preparando-hacer-peso-muerto_392761-1698.jpg?w=1060",
    "https://www.manzanaroja.eu/wp-content/uploads/2022/11/core-estabilidad-1536x1024.jpg",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.blogs.es%2F64a82e%2F2560_3000%2F840_560.jpeg&f=1&nofb=1&ipt=ba5da11cc43b337bae60c769b36aba0fb8251a3a50504042248151ea54df0d2f&ipo=images",
    "https://www.cambiatufisico.com/wp-content/uploads/ejercicios-pecho1.jpg",
  ];

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleExercisePress = (exercise) => {
    handleSelectExercise(exercise);
  };

  const moveToNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const moveToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(exercises.length - 1);
    }
  };

  if (loadingExercises) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Rutina Personalizada</Text>

      {/* Nombre de la rutina */}
      <Text style={styles.instruction}>Ingrese el nombre de la rutina:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la rutina"
        value={routineName}
        onChangeText={setRoutineName}
      />

      {/* Instrucción para ejercicios */}
      <Text style={styles.instruction}>
        Ingrese la cantidad de series y repeticiones y seleccione el ejercicio:
      </Text>

      <View style={styles.carouselContainer}>
        <Pressable onPress={moveToPrevious} style={styles.arrowButton}>
          <Text style={styles.arrowText}> {"<"} </Text>
        </Pressable>

        <View style={styles.exerciseContainer}>
          <Pressable
            onPress={() => handleExercisePress(exercises[currentIndex])}
            style={styles.exercisePressable}
          >
            <Image
              source={{ uri: exercises[currentIndex]?.image }}
              style={styles.exerciseImage}
            />
            <Text style={styles.exerciseName}>
              {exercises[currentIndex]?.name}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={moveToNext} style={styles.arrowButton}>
          <Text style={styles.arrowText}> {">"} </Text>
        </Pressable>
      </View>

      {/* Sets y reps */}
      <Text style={styles.instruction}>Ingrese sets y repeticiones para el ejercicio:</Text>
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
        renderItem={({ item }) => (
          <Pressable onPress={() => handleImageSelect(item)} style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            {selectedImage === item && <Text style={styles.selectedText}>Seleccionado</Text>}
          </Pressable>
        )}
        horizontal
        contentContainerStyle={styles.imageList}
      />

      <Pressable style={styles.saveButton} onPress={handleSaveRoutine}>
        <Text style={styles.saveButtonText}>Guardar Rutina</Text>
      </Pressable>

      <Pressable style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.homeButtonText}>Volver a Inicio</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
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
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 24,
  },
  exerciseContainer: {
    alignItems: "center",
  },
  exercisePressable: {
    alignItems: "center",
  },
  exerciseImage: {
    width: 150,
    height: 100, // Cambié la altura para hacerla rectangular
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
    width: 200, // Aumenté el ancho para que sea rectangular
    height: 120, // La altura sigue siendo más pequeña para un formato rectangular
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  selectedText: {
    marginTop: 5,
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default CustomRoutineScreen;














