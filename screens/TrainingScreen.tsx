import { StyleSheet, Text, View, SafeAreaView, Image, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

const TrainingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  
  const [exercises, setExercises] = useState([]); // Estado para los ejercicios
  const [index, setIndex] = useState(0); // Estado para el índice actual
  const id = route.params?.id; // Obtener el routineId de los parámetros de la ruta
  const current = exercises[index]; // Ejercicio actual

  // Fetch ejercicios cuando se cargue la pantalla
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`http://192.168.0.117:3000/routines/${id}/exercises`);
      const json = await response.json();
      setExercises(json); // Guardar los ejercicios obtenidos en el estado
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {current && (
        <>
          <Image
            style={styles.image}
            source={{ uri: current.image }}
            resizeMode="contain"
          />
          <Text style={styles.exerciseName}>{current.name}</Text>
          <Text style={styles.exerciseSets}>x{current.sets}</Text>

          {index + 1 >= exercises.length ? (
            <Pressable
              onPress={() => {
                navigation.navigate("Congratulations");
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>FINALIZADO</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                navigation.navigate("Rest");
                setTimeout(() => setIndex(index + 1), 2000);
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>FINALIZADO</Text>
            </Pressable>
          )}

          <View style={styles.buttonContainer}>
            <Pressable 
              onPress={() => {
                navigation.navigate("Home");
              }} 
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>SALIR</Text>
            </Pressable>

            {index + 1 >= exercises.length ? (
              <Pressable
                onPress={() => {
                  navigation.navigate("Congratulations");
                }}
                style={styles.actionButton}
              >
                <Text style={styles.actionButtonText}>SALTEAR</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  navigation.navigate("Rest");
                  setTimeout(() => setIndex(index + 1), 2000);
                }}
                style={styles.actionButton}
              >
                <Text style={styles.actionButtonText}>SALTEAR</Text>
              </Pressable>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default TrainingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 370,
  },
  exerciseName: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exerciseSets: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 20,
    padding: 10,
    width: 150,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
  },
  actionButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 20,
    width: 100,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});




