import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';

const PedometerScreen = ({ navigation }) => {
  const route = useRoute();
  const userId = route.params.id;
  const [stepCount, setStepCount] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const checkPedometer = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable);

        if (!isAvailable) {
          Alert.alert("Advertencia", "El podómetro no está disponible en este dispositivo.");
        }
      } catch (error) {
        console.error("Error al verificar el podómetro:", error);
        Alert.alert("Error", "Ocurrió un error al intentar acceder al podómetro.");
      }
    };

    checkPedometer();
  }, []);

  const startPedometer = () => {
    if (!isPedometerAvailable) {
      Alert.alert("Advertencia", "El podómetro no está disponible en este dispositivo.");
      return;
    }

    const newSubscription = Pedometer.watchStepCount(result => {
      setStepCount(result.steps);
    });

    setStartTime(new Date()); // Registrar el inicio
    setSubscription(newSubscription); // Guardar la suscripción
  };

  const handleEndExercise = () => {
    if (subscription) {
      subscription.remove(); // Detener el podómetro
      setSubscription(null);
    }

    const endTime = new Date();
    const totalTimeInMinutes = startTime
      ? (endTime.getTime() - startTime.getTime()) / (1000 * 60)
      : 0;
    const totalCalories = calculateCalories(stepCount);

    navigation.navigate("Congratulations", {
      totalTime: totalTimeInMinutes,
      completedExercises: 1, // Sesión única de podómetro cuenta como un ejercicio
      totalCalories: totalCalories,
      userId: userId,
    });
    setStepCount(0); // Reiniciar el contador
    
  };

  const calculateCalories = (steps) => {
    return steps * 0.04; // Fórmula para calorías quemadas
  };

  return (
    <View style={styles.container}>
      {isPedometerAvailable === null ? (
        <Text>Verificando disponibilidad del podómetro...</Text>
      ) : isPedometerAvailable ? (
        <View style={styles.box}>
          <Text style={styles.stepText}>Pasos: </Text>
            <Text style={styles.number}>{stepCount}</Text>
          {subscription ? (
            <Button title="Finalizar ejercicio" onPress={handleEndExercise} />
          ) : (
            <Button title="Iniciar podómetro" onPress={startPedometer} />
          )}
        </View>
      ) : (
        <Text>El podómetro no está disponible en este dispositivo.</Text>
      )}
    </View>
  );
};

export default PedometerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stepText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  box:{
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  number:{
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20
  }
});
