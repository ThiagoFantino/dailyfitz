import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, SafeAreaView, ScrollView } from 'react-native';
import { backendURL } from '@/config'; // Asegúrate de tener la URL correcta de tu backend

const SettingsScreen = ({ route, navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(route.params.id);

  // Función para obtener los datos del usuario al cargar la pantalla
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${backendURL}/users/${userId}`);
        const userData = await response.json();
        setNombre(userData.nombre);
        setApellido(userData.apellido);
        setEmail(userData.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Función para actualizar los datos
  const handleSave = async () => {
    if (!nombre || !apellido || !email) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    try {
      const response = await fetch(`${backendURL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
        }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Los datos se han actualizado correctamente');
        navigation.goBack(); // Volver a la pantalla anterior
      } else {
        Alert.alert('Error', 'Hubo un problema al actualizar los datos');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Hubo un error al guardar los datos');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Configuración de Usuario</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Button title="Guardar Cambios" onPress={handleSave} />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default SettingsScreen;
