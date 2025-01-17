import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';

const PedometerScreen = () => {
  const [stepCount, setStepCount] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(null);

  useEffect(() => {
    const checkPedometer = async () => {
      try {
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
      } catch (error) {
        console.error("Error al verificar el podómetro:", error);
        Alert.alert("Error", "Ocurrió un error al intentar acceder al podómetro.");
      }
    };

    checkPedometer();
  }, []);

  return (
    <View style={styles.background}>
      {isPedometerAvailable === null ? (
        <Text>Verificando disponibilidad del podómetro...</Text>
      ) : isPedometerAvailable ? (
        <View style={styles.container}>
          <Text style={{ fontSize: 18 }}>Pasos detectados:</Text>
          <Text style={styles.stepnumber}>{stepCount}</Text>
        </View>
            ) : (
        <Text>El podómetro no está disponible en este dispositivo.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  container:{
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
  stepnumber: {
    fontSize: 50,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default PedometerScreen;
