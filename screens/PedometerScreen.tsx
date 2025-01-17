import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';

const PedometerScreen = () => {
  const [stepCount, setStepCount] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(null);

  useEffect(() => {
    const checkPedometer = async () => {
      // Verifica si el podómetro está disponible
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);

      if (!isAvailable) {
        Alert.alert("Advertencia", "El podómetro no está disponible en este dispositivo.");
        return;
      }

      // Solicita permisos para usar el podómetro
      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permisos denegados", "No se otorgaron permisos para acceder al podómetro.");
        return;
      }

      // Suscríbete para escuchar los pasos
      const subscription = Pedometer.watchStepCount(result => {
        console.log("Pasos detectados:", result.steps); // Log para depuración
        setStepCount(result.steps);
      });

      // Limpia la suscripción cuando el componente se desmonte
      return () => subscription && subscription.remove();
    };

    checkPedometer();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isPedometerAvailable === null ? (
        <Text>Verificando disponibilidad del podómetro...</Text>
      ) : isPedometerAvailable ? (
        <Text style={{ fontSize: 18 }}>Pasos detectados: {stepCount}</Text>
      ) : (
        <Text>El podómetro no está disponible en este dispositivo.</Text>
      )}
    </View>
  );
};

export default PedometerScreen;
