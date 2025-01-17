import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  Button, 
  Alert, 
  SafeAreaView, 
  ScrollView, 
  BackHandler, 
  Pressable, 
  Platform 
} from 'react-native';
import { backendURL } from '@/config'; // Asegúrate de tener la URL correcta de tu backend

const SettingsScreen = ({ route, navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(route.params.id);

  const [nombreError, setNombreError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [emailError, setEmailError] = useState('');

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

  useEffect(() => {
    const backAction = () => {
      handleExit();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [nombre, apellido, email]);

  const validateFields = () => {
    let isValid = true;

    const nameRegex = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
    if (!nombre.trim()) {
      setNombreError('El nombre no puede estar vacío.');
      isValid = false;
    } else if (!nameRegex.test(nombre)) {
      setNombreError('El nombre solo puede contener letras, espacios, apóstrofes y guiones.');
      isValid = false;
    } else {
      setNombreError('');
    }

    const surnameRegex = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
    if (!apellido.trim()) {
      setApellidoError('El apellido no puede estar vacío.');
      isValid = false;
    } else if (!surnameRegex.test(apellido)) {
      setApellidoError('El apellido solo puede contener letras, espacios, apóstrofes y guiones.');
      isValid = false;
    } else {
      setApellidoError('');
    }

    const emailRegex = /^[A-Za-zÑñ0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-zÑñ0-9-]+(\.[A-Za-zÑñ0-9-]+)+$/;
    if (!email.trim()) {
      setEmailError('El correo electrónico no puede estar vacío.');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('El formato del correo electrónico es incorrecto.');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateFields()) {
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

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Los datos se han actualizado correctamente');
        navigation.goBack();
      } else {
        if (data.error === 'El email ya está registrado.') {
          setEmailError(data.error);
          Alert.alert('Error', data.error);
        } else {
          Alert.alert('Error', 'Hubo un problema al actualizar los datos');
        }
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Hubo un error al guardar los datos');
    }
  };

  const handleExit = () => {
    if (Platform.OS === 'web') {
      const confirmExit = window.confirm('Tienes cambios sin guardar. ¿Estás seguro que quieres salir?');
      if (confirmExit) {
        navigation.navigate('Home', { id: userId });
      }
    } else {
      Alert.alert(
        'Salir sin guardar',
        'Tienes cambios sin guardar. ¿Estás seguro que quieres salir?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Salir', onPress: () => navigation.navigate('Home', { id: userId }), style: 'destructive' },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Modificar Datos Personales</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        {nombreError ? <Text style={styles.errorText}>{nombreError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />
        {apellidoError ? <Text style={styles.errorText}>{apellidoError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Button title="Guardar Cambios" onPress={handleSave} />

        <Pressable style={styles.backButton} onPress={handleExit}>
          <Text style={styles.backButtonText}>VOLVER AL PERFIL</Text>
        </Pressable>
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;

