import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, ScrollView } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const RoutineScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();

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

        {route.params.excersises.map((item, index) => (
          <Pressable style={styles.exerciseItem} key={index}>
            <Image
              style={styles.exerciseImage}
              source={{ uri: item.image }}
            />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseSets}>x{item.sets}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={() => navigation.navigate("Training", { excersises: route.params.excersises })}
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
