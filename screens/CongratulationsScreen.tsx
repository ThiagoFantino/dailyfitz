import { StyleSheet, Text, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { backendURL } from '@/config';

const CongratulationsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const totalTimeInMinutes = route.params?.totalTime || 0;
  const completedExercises = route.params?.completedExercises || 0;
  const totalCalories = route.params?.totalCalories || 0;
  const userId = route.params?.userId || 0;

  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formattedTime = formatTime(totalTimeInMinutes);

  const postTotalSecondsAndWorkouts = async (
    userId: string,
    totalMinutes: number,
    completedExercises: number,
    totalCalories: number
  ) => {
    try {
      const totalSeconds = Math.round(totalMinutes * 60);

      // Enviar solo los datos del ejercicio actual al backend
      await fetch(`${backendURL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tiempo: totalSeconds,
          entrenamientos: completedExercises,
          calorias: totalCalories,
        }),
      });

      // Crear la entrada en la tabla UserStats solo para el ejercicio actual
      const currentDate = new Date().toISOString().split('T')[0]; // Fecha sin hora

      await fetch(`${backendURL}/userStats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          fecha: currentDate,
          tiempo: totalSeconds,
          entrenamientos: completedExercises,
          calorias: totalCalories,
        }),
      });

      console.log('Estadísticas del ejercicio actual registradas correctamente.');
    } catch (error) {
      console.error('Error registrando estadísticas del ejercicio:', error);
    }
  };

  const handleGoBack = () => {
    if (userId) {
      postTotalSecondsAndWorkouts(userId, totalTimeInMinutes, completedExercises, totalCalories);
    }
    navigation.navigate("Home", { id: userId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Icon name="trophy" size={100} color="#246EE9" style={styles.icon} />
      <Text style={styles.title}>¡Felicidades!</Text>
      <Text style={styles.message}>Has completado tu entrenamiento.</Text>

      <Text style={styles.timeMessage}>Tiempo De Entrenamiento: {formattedTime}</Text>
      <Text style={styles.exerciseMessage}>Series De Ejercicios Realizadas: {completedExercises}</Text>

      <Text style={styles.exerciseMessage}>Calorías Quemadas: {totalCalories.toFixed(2)} cal</Text>

      <Pressable onPress={handleGoBack} style={styles.button}>
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




