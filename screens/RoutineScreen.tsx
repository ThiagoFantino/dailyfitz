import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import {backendURL} from '@/config'

const RoutineScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();

  const [exercises, setExercises] = useState([]); // Estado para los ejercicios

  useEffect(() => {
    // Obtener los ejercicios de la rutina al cargar la pantalla
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      // Usar el id de la rutina que viene en los parámetros de la ruta
      const routineId = route.params.id; 
      const userId = route.params.userId;
      const response = await fetch(`${backendURL}/routines/${routineId}/exercises`); 
      const json = await response.json();
      setExercises(json); // Asume que la API devuelve un array de ejercicios
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
};


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          style={styles.image}
          source={{ uri: route.params.image }}
        />
        <Ionicons
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
          name="arrow-back-outline"
          size={28}
          color="white"
        />

        {exercises.map((item, index) => (
          <Pressable style={styles.exerciseItem} key={index}>
            <Image
              style={styles.exerciseImage}
              source={{ uri: item.image }} // Asume que cada ejercicio tiene una imagen
            />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseSets}>x{item.sets}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={() => navigation.navigate("Training", { exercises, id: route.params.id,userId:route.params.userId })} // Pasar los ejercicios a la pantalla de entrenamiento
        style={styles.startButton}
      >
        <Text style={styles.startButtonText}>EMPEZAR</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default RoutineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 170,
  },
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  exerciseItem: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseImage: {
    width: 90,
    height: 90,
  },
  exerciseInfo: {
    marginLeft: 10,
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  exerciseSets: {
    marginTop: 4,
    fontSize: 18,
    color: 'gray',
  },
  startButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 20,
    width: 120,
    borderRadius: 6,
  },
  startButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});


