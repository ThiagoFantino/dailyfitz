import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView } from 'react-native';
import React from 'react';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalada la librería de iconos

const UserStatsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>

      <Image 
        style={styles.profilePicture} 
        source={{ uri: 'https://www.w3schools.com/w3images/avatar2.png' }} 
      />
      
      <Text style={styles.userName}>Juan Perez</Text>

      <View style={styles.statsContainer}>

        <View style={styles.statCard}>
          <MaterialIcons name="fitness-center" size={40} color="#4CAF50" />
          <Text style={styles.statNumber}>20</Text>
          <Text style={styles.statLabel}>Entrenamientos</Text>
        </View>

        <View style={styles.statCard}>
          <FontAwesome5 name="fire" size={40} color="#F44336" />
          <Text style={styles.statNumber}>1500</Text>
          <Text style={styles.statLabel}>Calorías Quemadas</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time" size={40} color="#2196F3" />
          <Text style={styles.statNumber}>300</Text>
          <Text style={styles.statLabel}>Minutos</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserStatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  statLabel: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
});

