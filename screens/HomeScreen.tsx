import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import RoutinesCards from '@/components/RoutinesCards';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
  var userId = route.params.id;
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        // Al pulsar el botón de retroceso, se muestra un mensaje de confirmación
        Alert.alert(
          'Cerrar sesión',
          '¿Estás seguro de que deseas cerrar sesión?',
          [
            {
              text: 'Cancelar',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Cerrar sesión',
              onPress: () => {
                // Si elige cerrar sesión, navegar a la pantalla de login
                navigation.navigate('Login');
              },
            },
          ],
          { cancelable: false }
        );
        return true; // Bloquea la acción de retroceso
      };

      // Agregar el listener de retroceso
      BackHandler.addEventListener('hardwareBackPress', backAction);

      // Limpiar el listener cuando la pantalla se desenfoque
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [navigation]) // Se ejecuta solo cuando la pantalla HomeScreen esté en foco
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>DAILY FITZ</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <RoutinesCards userId={userId} />
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

