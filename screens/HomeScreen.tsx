import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import RoutinesCards from '@/components/RoutinesCards';

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>DAILY FITZ</Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>RUTINAS</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>CALORÍAS</Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>MINUTOS</Text>
            </View>
          </View>

          <View style={styles.centeredContent}>
          </View>
          <RoutinesCards />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#CD853F',
    padding: 10,
    height: '50%',
    width: '100%',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: '10%',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  statLabel: {
    color: '#D0D0D0',
    fontSize: 17,
    marginTop: '5%',
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
