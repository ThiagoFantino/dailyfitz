import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { backendURL } from '@/config';

const RoutineScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();

  const [exercises, setExercises] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState<any>({}); // Estado para controlar el loading de cada imagen

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const routineId = route.params.id;
      const response = await fetch(`${backendURL}/routines/${routineId}/exercises`);
      const json = await response.json();
      setExercises(json);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleImageLoad = (id: string) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false })); // Cambia el estado de carga para la imagen
  };

  const handleImageLoadStart = (id: string) => {
    setLoadingImages((prev) => ({ ...prev, [id]: true })); // Marca la imagen como cargando
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
                onLoad={() => handleImageLoad(item.id)} // Cuando la imagen se carga, actualizar el estado
                onLoadStart={() => handleImageLoadStart(item.id)} // Cuando la carga comienza
              />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseSets}>x{item.sets}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={() => navigation.navigate("Training", { exercises, id: route.params.id, userId: route.params.userId })}
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
});



