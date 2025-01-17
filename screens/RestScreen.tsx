import { StyleSheet, Text, SafeAreaView, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

const RestScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Obtén el tiempo de descanso desde los parámetros (obtenido previamente por fetch)
  const restTime = route.params?.restTime;  // Si no hay tiempo de descanso, usa 3 por defecto
  const [timeLeft, setTimeLeft] = useState(restTime);
  
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

    startAnimation();
  }, [scaleValue]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        source={{ uri: "https://i.blogs.es/b395b9/descargar-1-/1200_800.webp" }}
        style={[styles.image, { transform: [{ scale: scaleValue }] }]}
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


