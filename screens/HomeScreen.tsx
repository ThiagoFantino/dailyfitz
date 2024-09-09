import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import RoutinesCards from '@/components/RoutinesCards';

const HomeScreen = () => {
  return (
    <ScrollView>
      <SafeAreaView>
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
  header: {
    backgroundColor: '#CD853F',
    padding: 10,
    height: 200,
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
    justifyContent: 'space-between',
    marginTop: 20,
  },
  stat: {
    alignItems: 'center',
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
    marginTop: 6,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
