import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { backendURL } from '@/config';

const RoutineScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();

  const [routineExercises, setRoutineExercises] = useState<any[]>([]);
  const [restTime, setRestTime] = useState<number>(0); // Estado para almacenar el tiempo de descanso
  const [loadingImages, setLoadingImages] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutineExercises();
    fetchRestTime(); // Cargar el tiempo de descanso
  }, []);

  // Función para obtener los ejercicios de la rutina
  const fetchRoutineExercises = async () => {
    try {
      const routineId = route.params.id;
      const response = await fetch(`${backendURL}/routines/${routineId}/exercises`);
      const data = await response.json();
      console.log('Ejercicios de la rutina:', data); 
  
      // Transformamos los datos para manejar `RoutineExercise` correctamente
      const formattedExercises = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        sets: item.sets,
        reps: item.reps,
        calories: item.calories, // Incluimos el campo de calorías
      }));
  
      setRoutineExercises(formattedExercises);
    } catch (error) {
      console.error('Error fetching routine exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el tiempo de descanso de la rutina
  const fetchRestTime = async () => {
    try {
      const routineId = route.params.id;
      const response = await fetch(`${backendURL}/routines/${routineId}/rest-time`);
      const data = await response.json();
      setRestTime(data.restTime); // Actualizar el estado con el tiempo de descanso
    } catch (error) {
      console.error('Error fetching rest time:', error);
    }
  };

  const handleImageLoadStart = useCallback((id: string) => {
    setLoadingImages((prev) => {
      if (!prev[id]) {
        return { ...prev, [id]: true };
      }
      return prev;
    });
  }, []);
  
  const handleImageLoad = useCallback((id: string) => {
    setLoadingImages((prev) => {
      if (prev[id]) {
        return { ...prev, [id]: false };
      }
      return prev;
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#246EE9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image style={styles.image} source={{ uri: route.params.image }} />
        <Ionicons
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
          name="arrow-back-outline"
          size={28}
          color="white"
        />

        {/* Mostrar el tiempo de descanso antes de los ejercicios */}
        <View style={styles.restTimeContainer}>
          <Text style={styles.restTimeTitle}>Tiempo de descanso entre series:</Text>
          <Text style={styles.restTimeValue}>{restTime} segundos</Text>
        </View>

        {/* Iterar sobre los ejercicios y mostrar los detalles */}
        {routineExercises.map((item) => {
          // Calcular calorías totales quemadas
          const totalCalories = item.calories * item.sets * item.reps;

          return (
            <Pressable style={styles.exerciseItem} key={item.id}>
              <View style={styles.imageContainer}>
                {loadingImages[item.id] && (
                  <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={styles.loadingIndicator}
                  />
                )}
                <Image
                  style={styles.exerciseImage}
                  source={{ uri: item.image }}
                  onLoad={() => handleImageLoad(item.id)}
                  onLoadStart={() => handleImageLoadStart(item.id)}
                />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseSets}>
                  {item.sets} series de {item.reps} repeticiones
                </Text>

                {/* Mostrar calorías totales quemadas */}
                <Text style={styles.totalCalories}>
                  Calorías totales quemadas: {totalCalories.toFixed(2)} cal
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        onPress={() =>
          navigation.navigate('Training', {
            exercises: routineExercises,
            id: route.params.id,
            userId: route.params.userId,
            restTime:restTime,
          })
        }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  imageContainer: {
    position: 'relative',
    width: 90,
    height: 90,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
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
  restTimeContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  restTimeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  restTimeValue: {
    fontSize: 16,
    color: '#666',
  },
  totalCalories: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});






