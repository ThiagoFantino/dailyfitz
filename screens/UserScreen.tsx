import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Pressable } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { backendURL } from '@/config';

const UserStatsScreen = ({ route }) => {
  const [user, setUser] = useState({});
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userId = route.params.id;
  const navigation = useNavigation();

  // UseEffect para llamar a fetchData cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const response = await fetch(`${backendURL}/users/${userId}/stats`);
      const json = await response.json();

      if (json.error) {
        setError(json.error);
      } else {
        setUser(json.user);
        setUserStats(json.stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al obtener las estadísticas.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login'); 
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings', { id: userId }); // Pasa el userId como parámetro
  };

  const navigateToChangeProfilePicture = () => {
    navigation.navigate('ProfilePicture', { id: userId }); // Redirige a la pantalla de configuración de foto
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          style={styles.profilePicture} 
          source={{ uri: user.profilePicture }} 
        />
        
        <Text style={styles.userName}>{`${user.nombre || ''} ${user.apellido || ''}`}</Text> 

        {/* Muestra las estadísticas por fecha */}
        <Text style={styles.statsTitle}>Estadísticas por Fecha</Text>
        {userStats.length > 0 ? (
          userStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statNumber}>{`Fecha: ${stat.fecha}`}</Text>
              <Text style={styles.statLabel}>Entrenamientos: {stat.entrenamientos}</Text>
              <Text style={styles.statLabel}>Calorías Quemadas: {stat.calorias}</Text>
              <Text style={styles.statLabel}>Tiempo: {formatTime(stat.tiempo)}</Text>
            </View>
          ))
        ) : (
          <Text>No hay estadísticas disponibles</Text>
        )}

        {/* Botón de cerrar sesión */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </Pressable>

        {/* Botón para ir a la pantalla de configuración */}
        <Pressable style={styles.settingsButton} onPress={navigateToSettings}>
          <Text style={styles.settingsButtonText}>Ir a Configuración</Text>
        </Pressable>

        {/* Nuevo botón para cambiar la foto de perfil */}
        <Pressable style={styles.changeProfilePictureButton} onPress={navigateToChangeProfilePicture}>
          <Text style={styles.changeProfilePictureButtonText}>Cambiar Foto de Perfil</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
};

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
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
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
  settingsButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeProfilePictureButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  changeProfilePictureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserStatsScreen;

