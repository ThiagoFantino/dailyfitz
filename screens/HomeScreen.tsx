import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import RoutinesCards from '@/components/RoutinesCards';

const HomeScreen = ({ route }) => {
  var userId = route.params.id;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>DAILY FITZ</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <RoutinesCards userId={userId}/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#246EE9',
    padding: 10,
    height: 80, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20, 
  },
});

