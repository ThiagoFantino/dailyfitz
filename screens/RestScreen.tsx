import { StyleSheet, Text, View, SafeAreaView, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

const RestScreen = () => {
  const navigation = useNavigation();
  const [timeLeft, setTimeLeft] = useState(3);
  
  // Definir la animación de escala
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft <= 0) {
        navigation.goBack();
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, navigation]);

  useEffect(() => {
    // Función que inicia la animación de escala en loop
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.spring(scaleValue, {
            toValue: 1.5,
            useNativeDriver: false,
          }),
          Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    startAnimation(); // Iniciar la animación cuando el componente se monte
  }, [scaleValue]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        source={{ uri: "https://www.sport.es/labolsadelcorredor/wp-content/uploads/2021/02/entrenamiento.jpeg" }}
        style={[styles.image, { transform: [{ scale: scaleValue }] }]} // Aplicando la animación de escala
        resizeMode="cover"
      />
      <Text style={styles.title}>DESCANSO</Text>
      <Text style={styles.timer}>{timeLeft}</Text>
    </SafeAreaView>
  );
};

export default RestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 420,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: 50,
    textAlign: 'center',
  },
  timer: {
    fontSize: 40,
    fontWeight: '800',
    marginTop: 50,
    textAlign: 'center',
  },
});

