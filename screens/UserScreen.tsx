import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Pressable } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { backendURL } from '@/config';
import { Calendar } from 'react-native-calendars'; // Importa el calendario
import { LocaleConfig } from 'react-native-calendars'; // Importa el configurador de locales

// Configura el idioma a español
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const UserStatsScreen = ({ route }) => {
  const [user, setUser] = useState({});
  const [userStats, setUserStats] = useState([]);
  const [totalStats, setTotalStats] = useState({ entrenamientos: 0, calorias: 0, tiempo: 0 });
  const [statsByPeriods, setStatsByPeriods] = useState({
    today: {},
    week: {},
    month: {},
    year: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [statsForSelectedDate, setStatsForSelectedDate] = useState(null);
  const [showStats, setShowStats] = useState(true);

  const userId = route.params.id;
  const navigation = useNavigation();

  // Llamamos a la función para obtener los datos del usuario y las estadísticas por periodo
  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchStatsByPeriod();
      fetchTotalStats();
      setShowStats(false);
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

  // Función para obtener las estadísticas por periodos: hoy, semana, mes, año
  const fetchStatsByPeriod = async () => {
    const periods = ['today', 'week', 'month', 'year'];
    const fetchedStats = {};

    try {
      for (const period of periods) {
        const response = await fetch(`${backendURL}/users/${userId}/statsByPeriod?period=${period}`);
        const json = await response.json();

        // Sumar las estadísticas por periodo
        if (json.stats && json.stats.length > 0) {
          const totalStats = json.stats.reduce(
            (acc, stat) => {
              acc.entrenamientos += stat.entrenamientos || 0;
              acc.calorias += stat.calorias || 0;
              acc.tiempo += stat.tiempo || 0;
              return acc;
            },
            { entrenamientos: 0, calorias: 0, tiempo: 0 }
          );
          fetchedStats[period] = totalStats;
        }
      }
      setStatsByPeriods(fetchedStats);
    } catch (err) {
      console.error('Error fetching stats by period:', err);
    }
  };

  const fetchTotalStats = async () => {
    try {
      const response = await fetch(`${backendURL}/users/${userId}/totalStats`);
      if (!response.ok) throw new Error("Error al obtener las estadísticas totales.");
  
      const data = await response.json();
      setTotalStats(data.totalStats);
    } catch (err) {
      console.error("Error al obtener las estadísticas totales:", err);
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings', { id: userId });
  };

  const navigateToChangeProfilePicture = () => {
    navigation.navigate('ProfilePicture', { id: userId });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    // Asegúrate de que la fecha sea una cadena de tipo 'YYYY-MM-DD'
    if (date instanceof Date) {
      date = formatDateToISO(date) // Convierte el objeto Date a formato 'YYYY-MM-DD'
    }

    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/); // Coincide con el formato YYYY-MM-DD
    if (match) {
      const [, year, month, day] = match; // Extrae las partes de la fecha
      return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`; // El mes se convierte a número, eliminando el 0 si es menor que 10
    }
    return date; // Si no coincide, retorna la fecha original
  };

  const formatDateToISO = (date) => {
    if (date instanceof Date) {
        const year = date.getFullYear();               // Obtiene el año
        const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Obtiene el mes (debe ser de 2 dígitos)
        const day = date.getDate().toString().padStart(2, '0');  // Obtiene el día (debe ser de 2 dígitos)
        
        // Retorna la fecha en formato 'YYYY-MM-DD'
        return `${year}-${month}-${day}`;
    }

    return date;  // Si no es un objeto Date, retorna la fecha original
};


const getWeekRange = (date) => {
  const selectedDate = new Date(date);

  // Calcula el inicio de la semana (lunes)
  const firstDayOfWeek = selectedDate.getDate() - selectedDate.getDay() + (selectedDate.getDay() === 0 ? -6 : 1); // Lunes
  const startOfWeek = new Date(selectedDate.setDate(firstDayOfWeek));

  // Calcula el fin de la semana (domingo)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Suma 6 días desde el lunes

  // Formatea las fechas
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1); // Meses van de 0 a 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    startDate: formatDate(startOfWeek),
    endDate: formatDate(endOfWeek),
  };
};


  const formatMonth = (date) => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthIndex = new Date(date).getMonth();
    const year = new Date(date).getFullYear();
    return `${monthNames[monthIndex]} ${year}`;
  };

  const formatYear = (date) => {
    return new Date(date).getFullYear();
  };

  const handleDateSelect = async (date) => {
    const formattedDate = formatDate(date.dateString);

    setSelectedDate(formattedDate);
    setShowStats(true);

    const response = await fetch(`${backendURL}/users/${userId}/statsByDate?fecha=${formattedDate}`);
    const json = await response.json();

    if (json.stats && json.stats.length > 0) {
      setStatsForSelectedDate(json.stats[0]);
    } else {
      setStatsForSelectedDate(null);
    }
  };

  const closeStats = () => {
    setShowStats(false);
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

        <Text style={styles.instructionText}>Selecciona para ver las estadísticas de un día</Text>

        <Calendar
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#FF6347', selectedTextColor: '#fff' },
          }}
          markingType={'simple'}
        />

        {/* Mostrar estadísticas de la fecha seleccionada */}
        {selectedDate && showStats && (
          <View style={styles.statCard}>
            <Pressable style={styles.closeButton} onPress={closeStats}>
              <Text style={styles.closeButtonText}>✖</Text>
            </Pressable>
            <Text style={styles.selectedDateText}>Estadísticas para {selectedDate}</Text>
            {statsForSelectedDate ? (
              <>
                <Text style={styles.statLabel}>Series de ejercicios realizadas: {statsForSelectedDate.entrenamientos}</Text>
                <Text style={styles.statLabel}>Calorías quemadas: {statsForSelectedDate.calorias?.toFixed(2)} cal</Text>
                <Text style={styles.statLabel}>Tiempo de entrenamiento: {formatTime(statsForSelectedDate.tiempo)}</Text>
              </>
            ) : (
              <Text>No hay estadísticas para esta fecha.</Text>
            )}
          </View>
        )}

        {/* Estadísticas por períodos */}
        <Text style={styles.statsTitle}>Estadísticas Resumidas:</Text>
        {['today', 'week', 'month', 'year'].map(period => (
          <View key={period} style={styles.statPeriod}>
            <Text style={styles.statPeriodTitle}>
              {period === 'today' && `Estadísticas del Día - ${formatDate(new Date())}`}
              {period === 'week' && `Estadísticas de la Semana - Del ${getWeekRange(new Date()).startDate} al ${getWeekRange(new Date()).endDate}`}
              {period === 'month' && `Estadísticas del Mes - ${formatMonth(new Date())}`}
              {period === 'year' && `Estadísticas del Año - ${formatYear(new Date())}`}
            </Text>
            <View style={styles.statDetail}>
              <Text>Series de ejercicios realizadas: {statsByPeriods[period]?.entrenamientos || 0}</Text>
              <Text>Calorías quemadas: {statsByPeriods[period]?.calorias?.toFixed(2) || "0.00"} cal</Text>
              <Text>Tiempo de entrenamiento: {formatTime(statsByPeriods[period]?.tiempo || 0)}</Text>
            </View>
          </View>
        ))}

        {/* Mostrar estadísticas totales */}
        <View style={styles.statPeriod}>
          <Text style={styles.statPeriodTitle}>Estadísticas Totales</Text>
          <View style={styles.statDetail}>
            <Text>Series de ejercicios realizadas: {totalStats.entrenamientos}</Text>
            <Text>Calorías quemadas: {totalStats.calorias?.toFixed(2)} cal</Text>
            <Text>Tiempo de entrenamiento: {formatTime(totalStats.tiempo)}</Text>
          </View>
        </View>

        {/* Botones */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </Pressable>
        <Pressable style={styles.settingsButton} onPress={navigateToSettings}>
          <Text style={styles.settingsButtonText}>Modificar Datos Personales</Text>
        </Pressable>
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
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
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
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FF6347',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
    width: '90%',
    textAlign: 'center',
  },
  statPeriod: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statPeriodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
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
    textAlign: 'center',
  },
  settingsButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  changeProfilePictureButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  changeProfilePictureButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserStatsScreen;




