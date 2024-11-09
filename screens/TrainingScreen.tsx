import { StyleSheet, Text, View, SafeAreaView, Image, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {backendURL} from '@/config'

const TrainingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();

  const [exercises, setExercises] = useState([]); // Estado para los ejercicios
  const [index, setIndex] = useState(0); // Estado para el índice actual
  const [startTime, setStartTime] = useState<Date | null>(null); // Almacena la hora de inicio del entrenamiento
  const [elapsedTime, setElapsedTime] = useState(0); // Almacena el tiempo transcurrido en segundos
  const [completedExercises, setCompletedExercises] = useState(1); // Estado para contar los ejercicios completados
  const [totalCalories, setTotalCalories] = useState(0); // Estado para contar las calorías
  const id = route.params?.id; // Obtener el routineId de los parámetros de la ruta
  const current = exercises[index]; // Ejercicio actual

  // Inicia el temporizador y obtiene los ejercicios
  useEffect(() => {
    fetchExercises();
    setStartTime(new Date()); // Registrar la hora de inicio
    const interval = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1); // Incrementa el tiempo transcurrido cada segundo
    }, 1000);

    return () => clearInterval(interval); // Limpia el intervalo al salir de la pantalla
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${backendURL}/routines/${id}/exercises`);
      const json = await response.json();
      setExercises(json); // Guardar los ejercicios obtenidos en el estado
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  // Convertir el tiempo en formato horas, minutos y segundos
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleFinish = () => {
    const endTime = new Date(); // Registrar la hora de finalización
    const totalTimeInMinutes = (endTime.getTime() - (startTime?.getTime() || 0)) / (1000 * 60); // Calcular el tiempo total en minutos
    navigation.navigate("Congratulations", { totalTime: totalTimeInMinutes, completedExercises, totalCalories: totalCalories+current.calorias });
  };

  return (
    <SafeAreaView style={styles.container}>
      {current && (
        <>
          <Image
            style={styles.image}
            source={{ uri: current.image }}
            resizeMode="contain"
          />
          <Text style={styles.exerciseName}>{current.name}</Text>
          <Text style={styles.exerciseSets}>x{current.sets}</Text>
          <Text style={styles.exerciseSets}>Calorias perdidas con este ejercicio: {current.calorias}</Text>

          {/* Muestra el tiempo transcurrido en tiempo real */}
          <Text style={styles.timer}>Tiempo: {formatTime(elapsedTime)}</Text>

          {index + 1 >= exercises.length ? (
            <Pressable
              onPress={() => {
                setCompletedExercises(completedExercises + 1); 
                setTotalCalories(totalCalories + current.calorias); // Acumular las calorías
                handleFinish();
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>FINALIZADO</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setCompletedExercises(completedExercises + 1); // Incrementar contador de ejercicios completados
                setTotalCalories(totalCalories + current.calorias); // Acumular las calorías
                navigation.navigate("Rest");
                setTimeout(() => setIndex(index + 1), 2000);
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>FINALIZADO</Text>
            </Pressable>
          )}

          <View style={styles.buttonContainer}>
            <Pressable 
              onPress={() => {
                navigation.navigate("Home");
              }} 
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>SALIR</Text>
            </Pressable>

            {index + 1 >= exercises.length ? (
              <Pressable
                onPress={() => {
                  setCompletedExercises(completedExercises + 1); // Incrementar contador de ejercicios completados antes de finalizar
                  setTotalCalories(totalCalories + current.calorias); // Acumular las calorías
                  handleFinish();
                }}
                style={styles.actionButton}
              >
                <Text style={styles.actionButtonText}>SALTEAR</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  // No incrementamos el contador si se salta el ejercicio
                  navigation.navigate("Rest");
                  setTimeout(() => setIndex(index + 1), 2000);
                }}
                style={styles.actionButton}
              >
                <Text style={styles.actionButtonText}>SALTEAR</Text>
              </Pressable>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default TrainingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 370,
  },
  exerciseName: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exerciseSets: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timer: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 20,
    padding: 10,
    width: 150,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
  },
  actionButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 20,
    width: 100,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


