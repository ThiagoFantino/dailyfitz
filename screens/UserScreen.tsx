// UserStatsScreen.tsx
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React from 'react';

const UserStatsScreen = () => {
  // Aquí podrías añadir lógica para obtener estadísticas de usuario

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Estadísticas del Usuario</Text>
      {/* Aquí puedes mostrar estadísticas, gráficas, etc. */}
      <View style={styles.statistic}>
        <Text style={styles.statisticTitle}>Ejercicios Completados:</Text>
        <Text style={styles.statisticValue}>15</Text>
      </View>
      <View style={styles.statistic}>
        <Text style={styles.statisticTitle}>Tiempo Total de Entrenamiento:</Text>
        <Text style={styles.statisticValue}>10 horas</Text>
      </View>
      <View style={styles.statistic}>
        <Text style={styles.statisticTitle}>Calorías Quemadas:</Text>
        <Text style={styles.statisticValue}>2000 kcal</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserStatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statistic: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  statisticTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statisticValue: {
    fontSize: 22,
    marginTop: 5,
  },
});
