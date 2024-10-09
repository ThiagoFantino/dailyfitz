import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView } from 'react-native';
import React from 'react';
import { useState , useEffect } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalada la librería de iconos

const UserStatsScreen = () => {
  const [data,setData] = useState('');
  const [users,setUsers] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.0.117:3000/');
      const json = await response.json();
      setData(json.message); // Suponiendo que tu API devuelve el nombre en un campo 'message'
      console.log("Message from port 5000:", json.message);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Image 
          style={styles.profilePicture} 
          source={{ uri: 'https://www.w3schools.com/w3images/avatar2.png' }} 
        />
        
        <Text style={styles.userName}>Juan Perez</Text> 

        <View style={styles.statsContainer}>

          <View style={styles.statCard}>
            <MaterialIcons name="fitness-center" size={36} color="#4CAF50" />
            <Text style={styles.statNumber}>20</Text>
            <Text style={styles.statLabel}>Entrenamientos</Text>
          </View>

          <View style={styles.statCard}>
            <FontAwesome5 name="fire" size={36} color="#F44336" />
            <Text style={styles.statNumber}>1500</Text>
            <Text style={styles.statLabel}>Calorías Quemadas</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={36} color="#2196F3" />
            <Text style={styles.statNumber}>300</Text>
            <Text style={styles.statLabel}>Minutos</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default UserStatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    flexWrap: 'wrap',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '40%',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
});


