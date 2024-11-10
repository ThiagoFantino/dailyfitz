import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Pressable } from 'react-native';
import React, { useState, useCallback } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { backendURL } from '@/config';

const UserStatsScreen = () => {
  const [user, setUser] = useState({});
  const route = useRoute();
  const userId = global.userId;
  const navigation = useNavigation(); // Obtener el objeto de navegación

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const response = await fetch(`${backendURL}/users/${userId}`);
      const json = await response.json();
      setUser(json);
      console.log(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    global.userId = null; // Limpiar el ID de usuario
    navigation.navigate('Login'); // Redirigir a la pantalla de login
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          style={styles.profilePicture} 
          source={{ uri: 'https://www.w3schools.com/w3images/avatar2.png' }} 
        />
        
        <Text style={styles.userName}>{`${user.nombre || ''} ${user.apellido || ''}`}</Text> 

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="fitness-center" size={36} color="#4CAF50" />
            <Text style={styles.statNumber}>{`${user.entrenamientos || 0}`}</Text>
            <Text style={styles.statLabel}>Entrenamientos</Text>
          </View>

          <View style={styles.statCard}>
            <FontAwesome5 name="fire" size={36} color="#F44336" />
            <Text style={styles.statNumber}>{`${user.calorias || 0}`}</Text>
            <Text style={styles.statLabel}>Calorías Quemadas</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={36} color="#2196F3" />
            <Text style={styles.statNumber}>{`${user.minutos || 0}`}</Text>
            <Text style={styles.statLabel}>Minutos</Text>
          </View>
        </View>

        {/* Botón de cerrar sesión */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </Pressable>

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
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
