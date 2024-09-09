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

      {index + 1 >= exercises.length ? (
        <Pressable
          onPress={() => {
            navigation.navigate("Home");
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
        disabled={index === 0}
        onPress={()=>{
          navigation.navigate("Rest");
          setTimeout(()=> {
            setIndex(index - 1)
          },2000)
          }}style={styles.actionButton}>
          <Text style={styles.actionButtonText}>ANTERIOR</Text>
        </Pressable>

        {index + 1 >= exercises.length ? (
          <Pressable
            onPress={() => {
              navigation.navigate("Home");
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

