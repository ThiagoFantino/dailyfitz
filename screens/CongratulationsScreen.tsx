import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {backendURL} from '@/config'

const CongratulationsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = global.userId; // Extraer el userId de los parámetros
  
  // Obtener el tiempo total en minutos y el número de ejercicios completados desde los parámetros
  const totalTimeInMinutes = route.params?.totalTime || 0;
  const completedExercises = route.params?.completedExercises || 0;
  const totalCalories = route.params?.totalCalories || 0;

  // Función para convertir minutos en horas, minutos y segundos
  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formattedTime = formatTime(totalTimeInMinutes);

  // Función para actualizar los minutos y entrenamientos en la base de datos
  const postTotalMinutesAndWorkouts = async (userId: string, totalMinutes: number, completedExercises: number, totalCalories: number) => {
    try {
      const totalSeconds = Math.round(totalMinutes * 60);

      // Primero, obtén los datos actuales del usuario
      const response = await fetch(`${backendURL}/users/${userId}`);
      const userData = await response.json();
      
      // Actualizar los minutos
      const updatedMinutes = userData.tiempo + totalSeconds;
      const updatedWorkouts = userData.entrenamientos + completedExercises;
      const updatedCalories = userData.calorias + totalCalories;

      // Ahora, actualiza los minutos y los entrenamientos en la base de datos
      await fetch(`${backendURL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tiempo: updatedMinutes, // Suma de los minutos actuales + nuevos minutos
          entrenamientos: updatedWorkouts, // Suma de los entrenamientos actuales + los nuevos ejercicios completados
          calorias: updatedCalories
        }),
      });

      console.log('Minutos y entrenamientos actualizados correctamente.');
    } catch (error) {
      console.error('Error actualizando los minutos y entrenamientos:', error);
    }
  };

  // Manejar el clic del botón para volver al inicio y actualizar los minutos y entrenamientos
  const handleGoBack = () => {
    if (userId) {
      postTotalMinutesAndWorkouts(userId, totalTimeInMinutes, completedExercises,totalCalories);
    }
    navigation.navigate("Home"); // Navegar al inicio
  };

  return (
    <SafeAreaView style={styles.container}>
      <Icon name="trophy" size={100} color="#246EE9" style={styles.icon} />
      <Text style={styles.title}>¡Felicidades!</Text>
      <Text style={styles.message}>Has completado tu entrenamiento.</Text>

      {/* Mostrar el tiempo total formateado en horas, minutos y segundos */}
      <Text style={styles.timeMessage}>Tiempo total: {formattedTime}</Text>

      {/* Mostrar el número de ejercicios completados */}
      <Text style={styles.exerciseMessage}>Ejercicios completados: {completedExercises}</Text>

      <Text style={styles.exerciseMessage}>Calorias quemadas: {totalCalories}</Text>

      <Pressable
        onPress={handleGoBack} // Llamar a la función handleGoBack al presionar el botón
        style={styles.button}
      >
        <Text style={styles.buttonText}>VOLVER AL INICIO</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default CongratulationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  timeMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
  exerciseMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 20,
    padding: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});


