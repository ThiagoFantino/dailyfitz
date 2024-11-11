import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Pressable } from 'react-native';
import React, { useState, useCallback } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { backendURL } from '@/config';

const UserStatsScreen = ({route}) => {
  const [user, setUser] = useState({});
  var userId = route.params.id;
  console.log(userId);
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
    userId = null; // Limpiar el ID de usuario
    console.log(userId);
    navigation.navigate('Login'); // Redirigir a la pantalla de login
  };

  // Función para convertir segundos a formato horas:minutos:segundos
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          style={styles.profilePicture} 
          source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' }} 
        />
        
        <Text style={styles.userName}>{`${user.nombre || ''} ${user.apellido || ''}`}</Text> 

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="fitness-center" size={36} color="#4CAF50" />
            <Text style={styles.statNumber}>{`${user.entrenamientos || 0}`}</Text>
            <Text style={styles.statLabel}>Ejercicios Realizados</Text>
          </View>

          <View style={styles.statCard}>
            <FontAwesome5 name="fire" size={36} color="#F44336" />
            <Text style={styles.statNumber}>{`${user.calorias || 0}`}</Text>
            <Text style={styles.statLabel}>Calorías Quemadas</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={36} color="#2196F3" />
            {/* Mostrar el tiempo formateado desde la base de datos (en segundos) */}
            <Text style={styles.statNumber}>{formatTime(user.tiempo || 0)}</Text>
            <Text style={styles.statLabel}>Tiempo De Entrenamiento</Text>
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

