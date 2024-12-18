import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, Alert, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { backendURL } from '@/config';

const TrainingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();

  const [exercises, setExercises] = useState([]);
  const [index, setIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null); 
  const [completedExercises, setCompletedExercises] = useState(1);
  const [totalCalories, setTotalCalories] = useState(0); 
  const id = route.params?.id; 
  const userId = route.params?.userId; 
  const current = exercises[index];

  useEffect(() => {
    fetchExercises();
    setStartTime(new Date());
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${backendURL}/routines/${id}/exercises`);
      const json = await response.json();
      setExercises(json);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleFinish = () => {
    const endTime = new Date();
    const totalTimeInMinutes = (endTime.getTime() - (startTime?.getTime() || 0)) / (1000 * 60); 
    navigation.navigate("Congratulations", { totalTime: totalTimeInMinutes, completedExercises, totalCalories: totalCalories + current.calorias, userId: userId });
  };

  const handleExit = () => {
    if (Platform.OS === 'web') {
      const confirmExit = window.confirm('Se perderá todo el progreso. ¿Está seguro de que desea salir?');
      if (confirmExit) {
        navigation.navigate("Home", { id: id });
      }
    } else {
      Alert.alert(
        'Advertencia',
        'Se perderá todo el progreso. ¿Está seguro de que desea salir?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Salir',
            onPress: () => navigation.navigate("Home", { id: id }),
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
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
          <Text style={styles.exerciseSets}>Quema {current.calorias} calorias</Text>

          {index + 1 >= exercises.length ? (
            <Pressable
              onPress={() => {
                setCompletedExercises(completedExercises + 1); 
                setTotalCalories(totalCalories + current.calorias); 
                handleFinish();
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>FINALIZADO</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setCompletedExercises(completedExercises + 1); 
                setTotalCalories(totalCalories + current.calorias);
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
              onPress={handleExit} 
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>SALIR</Text>
            </Pressable>
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
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '50%',
  },
  exerciseName: {
    marginTop: '3%',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exerciseSets: {
    marginTop: '2%',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 20,
    padding: 10,
    width: 150,
    marginTop: '2%',
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
    marginTop: '2%',
  },
  actionButton: {
    backgroundColor: 'red',
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

