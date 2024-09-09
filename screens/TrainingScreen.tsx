import { StyleSheet, Text, View, SafeAreaView, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

const TrainingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const exercises = route.params.excersises;
  const current = exercises[index];

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: current.image }}
      />
      <Text style={styles.exerciseName}>{current.name}</Text>
      <Text style={styles.exerciseSets}>x{current.sets}</Text>
      <Pressable
        onPress={() => navigation.navigate("Rest")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>FINALIZADO</Text>
      </Pressable>
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
    marginTop: 30,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exerciseSets: {
    marginTop: 30,
    fontSize: 38,
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
    fontSize: 20,
    color: 'white',
  },
});
