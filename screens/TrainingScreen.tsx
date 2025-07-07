import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, Alert, Platform, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { backendURL } from '@/config';

const TrainingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [exercises, setExercises] = useState([]);
  const [index, setIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSetsCompleted, setTotalSetsCompleted] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const id = route.params?.id;
  const userId = route.params?.userId;
  const restTime = route.params?.restTime;
  const currentExercise = exercises[index];

  useEffect(() => {
    fetchExercises();
    setStartTime(new Date());

    const backAction = () => {
      Alert.alert(
        'Advertencia',
        'Se perderá todo el progreso. ¿Está seguro de que desea salir?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir', onPress: () => navigation.navigate("Home", { id: id }), style: 'destructive' },
        ],
        { cancelable: true }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      backHandler.remove();
    };
  }, [navigation, id]);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${backendURL}/routines/${id}/exercises`);
      const json = await response.json();
      setExercises(json);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleSetComplete = () => {
    const caloriesBurned = currentExercise.calories * currentExercise.reps;
    setTotalCalories(prev => prev + caloriesBurned);
    setTotalSetsCompleted(prev => prev + 1);

    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      navigation.navigate("Rest", { restTime: restTime });
    } else {
      handleNextExercise();
    }
  };

  const handleNextExercise = () => {
    if (index + 1 < exercises.length) {
      setIndex(prev => prev + 1);
      setCurrentSet(1);
      navigation.navigate("Rest", { restTime: restTime });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const endTime = new Date();
    const totalTimeInMinutes = (endTime.getTime() - (startTime?.getTime() || 0)) / (1000 * 60);

    const finalSetsCompleted = totalSetsCompleted + (currentSet <= currentExercise.sets ? 1 : 0);
    const finalCalories = totalCalories + (currentSet <= currentExercise.sets ? (currentExercise.calories * currentExercise.reps) : 0);

    navigation.navigate("Congratulations", {
      totalTime: totalTimeInMinutes,
      completedExercises: finalSetsCompleted,
      totalCalories: finalCalories,
      userId,
      routineId: id,
    });
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
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir', onPress: () => navigation.navigate("Home", { id: id }), style: 'destructive' },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentExercise && (
        <>
          <Image style={styles.image} source={{ uri: currentExercise.image }} resizeMode="contain" />
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          <Text style={styles.exerciseSets}>Serie {currentSet} de {currentExercise.sets}</Text>
          <Text style={styles.exerciseReps}>Repeticiones: {currentExercise.reps}</Text>
          <Text style={styles.exerciseSets}>Quema {(currentExercise.calories * currentExercise.reps).toFixed(2)} calorías esta serie</Text>

          <Pressable onPress={handleSetComplete} style={styles.button}>
            <Text style={styles.buttonText}>
              {currentSet < currentExercise.sets ? "FINALIZAR SERIE" : "FINALIZAR EJERCICIO"}
            </Text>
          </Pressable>

          {/* Nuevo botón para terminar la rutina */}
          <Pressable onPress={handleFinish} style={[styles.button, { backgroundColor: 'green', marginTop: 10, marginBottom:10 }]}>
            <Text style={styles.buttonText}>TERMINAR RUTINA ACA</Text>
          </Pressable>

          <View style={styles.buttonContainer}>
            <Pressable onPress={handleExit} style={styles.actionButton}>
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
  exerciseReps: {
    marginTop: '2%',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    width: 275,
    marginTop: '1%',
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
    marginTop: '1%',
  },
  actionButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginHorizontal: 20,
    width: 150,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});





