import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Pressable, TextInput, View, ActivityIndicator, FlatList, Image, Alert, BackHandler } from "react-native";
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
  const [loadingImages, setLoadingImages] = useState({}); // Estado para la carga de imágenes
  const [restTime, setRestTime] = useState("");

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Salir sin guardar", "Tienes cambios sin guardar. ¿Estás seguro que quieres salir?", [
        {
          text: "Cancelar",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Salir", onPress: () => navigation.goBack() },
      ]);
      return true; // Impide el comportamiento por defecto
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      backHandler.remove(); // Limpia el listener al desmontar el componente
    };
  }, [navigation]);

  const handleGoHome = () => {
    Alert.alert("Salir sin guardar", "Tienes cambios sin guardar. ¿Estás seguro que quieres salir?", [
      {
        text: "Cancelar",
        onPress: () => null,
        style: "cancel",
      },
      { text: "Salir", onPress: () => navigation.navigate("Home") },
    ]);
  };

  const handleSetsChange = (text) => {
    if (text === "") {
      setSets(""); // Permite dejar el campo vacío
    } else {
      const number = parseInt(text, 10);
      if (number <= 0 || isNaN(number)) {
        alert("Por favor, ingresa un valor positivo y entero para las series.");
        setSets(""); // Limpiar el campo en caso de error
      } else {
        setSets(number.toString());
      }
    }
  };
  
  const handleRepsChange = (text) => {
    if (text === "") {
      setReps(""); // Permite dejar el campo vacío
    } else {
      const number = parseInt(text, 10);
      if (number <= 0 || isNaN(number)) {
        alert("Por favor, ingresa un valor positivo y entero para las repeticiones.");
        setReps(""); // Limpiar el campo en caso de error
      } else {
        setReps(number.toString());
      }
    }
  };

  const handleRestTimeChange = (text) => {
    if (text === "") {
      setRestTime("");
    } else {
      const number = parseInt(text, 10);
      if (number < 0 || isNaN(number)) {
        alert("Por favor, ingresa un tiempo de descanso válido (en segundos).");
        setRestTime("");
      } else {
        setRestTime(number.toString());
      }
    }
  };
  
  
  
// Manejador para marcar una imagen como cargada

const handleImageLoad = (index) => {
  setLoadingImages((prevState) => ({
    ...prevState,
    [index]: false, // Marca la imagen como cargada
  }));
};

useEffect(() => {
  if (exercises.length > 0) {
    const initialLoadingState = exercises.reduce(
      (acc, _, index) => ({ ...acc, [index]: true }),
      {}
    );
    setLoadingImages(initialLoadingState);
  }
}, [exercises]);

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
      alert("Por favor, ingresa series y repeticiones para el ejercicio.");
      return;
    }

    const totalCalories = (exercise.calorias * parseInt(sets, 10) * parseInt(reps, 10)).toFixed(2); // Cálculo de calorías

    setSelectedExercises((prevState) => [
      ...prevState,
      { ...exercise, sets: parseInt(sets, 10), reps: parseInt(reps, 10),totalCalories:totalCalories, },
    ]);
    setSets("");
    setReps("");
  };

  const handleSaveRoutine = () => {
    if (!routineName.trim()) {
      alert("Por favor, ingresa un nombre para la rutina.");
      return;
    }
  
    if (selectedExercises.length === 0) {
      alert("Por favor, selecciona al menos un ejercicio para la rutina.");
      return;
    }

    if (!restTime.trim()) {
      alert("Por favor, ingresa un tiempo de descanso para la rutina.");
      return;
    }
    
  
    if (!selectedImage) {
      alert("Por favor, selecciona una imagen para la rutina.");
      return;
    }
  
    const reversedExercises = selectedExercises.reverse();
  
    const routineData = {
      name: routineName,
      userId: userId,
      exercises: reversedExercises,
      image: selectedImage,
      restTime: parseInt(restTime, 10),
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
      <Text style={styles.instruction}>Ingrese el nombre de la rutina:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la rutina"
        value={routineName}
        onChangeText={setRoutineName}
      />
      <Text style={styles.instruction}>Ingrese la cantidad de series y repeticiones:</Text>
      <TextInput
        style={styles.input}
        placeholder="Series"
        keyboardType="numeric"
        value={sets}
        onChangeText={handleSetsChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Repeticiones"
        keyboardType="numeric"
        value={reps}
        onChangeText={handleRepsChange}
      />
      <Text style={styles.instruction}>Seleccione el ejercicio:</Text>
      <View style={styles.carouselContainer}>
        <Pressable onPress={moveToPrevious} style={styles.arrowButton}>
          <Text style={styles.arrowText}> {"<"} </Text>
        </Pressable>
        <View style={styles.exerciseContainer}>
          {loadingImages[currentIndex] && (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
          )}
          <Pressable onPress={() => handleExercisePress(exercises[currentIndex])} style={styles.exercisePressable}>
            <Image
              source={{ uri: exercises[currentIndex]?.image }}
              style={styles.exerciseImage}
              onLoad={() => handleImageLoad(currentIndex)}
            />
            <Text style={styles.exerciseName}>{exercises[currentIndex]?.name}</Text>
            {/* Mostrar las calorías aquí */}
            <Text style={styles.exerciseCalories}>Calorías quemadas por repetición: {exercises[currentIndex]?.calorias}</Text>
          </Pressable>
        </View>
        <Pressable onPress={moveToNext} style={styles.arrowButton}>
          <Text style={styles.arrowText}> {">"} </Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>Ejercicios seleccionados</Text>
    </>
  }
  data={selectedExercises}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item, index }) => (
    <View style={styles.selectedExercise}>
      <View style={styles.exerciseInfoContainer}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text>Series: {item.sets}</Text>
        <Text>Repeticiones: {item.reps}</Text>
        {/* Mostrar las calorías aquí también */}
        <Text>Calorías quemadas en el ejercicio: {item.totalCalories}</Text>
      </View>
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
          <Pressable onPress={() => handleImageSelect(item)} style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            {selectedImage === item && <Text style={styles.selectedText}>Seleccionado</Text>}
          </Pressable>
        )}
        horizontal
        contentContainerStyle={styles.imageList}
      />
            <Text style={styles.instruction}>Ingrese el tiempo de descanso entre series (en segundos):</Text>
<TextInput
  style={styles.input}
  placeholder="Tiempo de descanso (segundos)"
  keyboardType="numeric"
  value={restTime}
  onChangeText={handleRestTimeChange}
/>
      <Pressable style={styles.saveButton} onPress={handleSaveRoutine}>
        <Text style={styles.saveButtonText}>Guardar Rutina</Text>
      </Pressable>
      <Pressable style={styles.homeButton} onPress={handleGoHome}>
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
    justifyContent: "space-between", // Espaciado entre las flechas y el contenido
    marginVertical: 10, // Separación vertical para más claridad
  },
  arrowButton: {
    width: 50, // Ancho fijo para las flechas
    height: 50, // Altura fija para las flechas
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Fondo para distinguirlas
    borderRadius: 25, // Hacerlas circulares
    marginHorizontal: 10, // Espaciado entre flechas y contenido
  },
  arrowText: {
    fontSize: 24, // Tamaño de las flechas
    fontWeight: "bold",
    color: "#333",
  },
  exerciseContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Para permitir la superposición
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
  loadingIndicator: {
    position: "absolute",
    zIndex: 1, // Asegura que esté por encima de la imagen
  },
  exerciseCalories: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },  
});

export default CustomRoutineScreen;




