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

    const reversedExercises = selectedExercises.reverse();

    const routineData = {
      name: routineName,
      userId: userId,
      exercises: reversedExercises,
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

  const handleRemoveExercise = (index) => {
    setSelectedExercises((prevState) => prevState.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newExercises = [...selectedExercises];
      const temp = newExercises[index];
      newExercises[index] = newExercises[index - 1];
      newExercises[index - 1] = temp;
      setSelectedExercises(newExercises);
    }
  };

  const handleMoveDown = (index) => {
    if (index < selectedExercises.length - 1) {
      const newExercises = [...selectedExercises];
      const temp = newExercises[index];
      newExercises[index] = newExercises[index + 1];
      newExercises[index + 1] = temp;
      setSelectedExercises(newExercises);
    }
  };

  if (loadingExercises) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
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
        </>
      }
      data={selectedExercises}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.selectedExercise}>
          {/* Información del ejercicio */}
          <View style={styles.exerciseInfoContainer}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text>Sets: {item.sets}</Text>
            <Text>Reps: {item.reps}</Text>
          </View>

          {/* Flechas de reordenar y eliminar */}
          <View style={styles.actionsContainer}>
            <Pressable onPress={() => handleMoveUp(index)} style={styles.reorderButton}>
              <Text style={styles.reorderButtonText}>{"↑"}</Text>
            </Pressable>
            <Pressable onPress={() => handleMoveDown(index)} style={styles.reorderButton}>
              <Text style={styles.reorderButtonText}>{"↓"}</Text>
            </Pressable>
            <Pressable onPress={() => handleRemoveExercise(index)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Eliminar</Text>
            </Pressable>
          </View>
        </View>
      )}
      ListFooterComponent={
        <>
          <Text style={styles.subtitle}>Selecciona una imagen para la rutina</Text>
          <FlatList
            data={routineImages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleImageSelect(item)}
                style={styles.imageContainer}
              >
                <Image source={{ uri: item }} style={styles.image} />
                {selectedImage === item && (
                  <Text style={styles.selectedText}>Seleccionado</Text>
                )}
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
        </>
      }
    />
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
    padding: 15, // Aumenté el padding
  },
  arrowText: {
    fontSize: 36, // Aumenté el tamaño de las flechas
    fontWeight: "bold",
  },
  exerciseContainer: {
    alignItems: "center",
  },
  exercisePressable: {
    alignItems: "center",
  },
  exerciseImage: {
    width: 150,
    height: 100,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseInfoContainer: {
    flex: 1,
    alignItems: "flex-start", // Alineado a la izquierda
    paddingLeft: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20, // Espaciado más grande entre las flechas y el botón eliminar
  },
  reorderButton: {
    backgroundColor: '#f0f0f0',
    padding: 10, // Aumenté el tamaño de los botones
    borderRadius: 5,
    marginLeft: 10, // Separación entre flechas
  },
  reorderButtonText: {
    fontSize: 24, // Flechas más grandes
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
    width: 200,
    height: 120,
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



