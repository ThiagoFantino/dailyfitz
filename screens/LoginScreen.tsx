import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {backendURL} from '@/config'

interface LoginScreenProps {
  onFormToggle?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onFormToggle }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordView, setPasswordView] = useState(true);
  const navigation = useNavigation();

  const passwordViewFlip = () => {
    setPasswordView(!passwordView);
  };

  const loginRequest = async () => {
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');
  
    // Validación de campos vacíos
    if (email.trim() === '') {
      setEmailError('Debe ingresar un email.');
      return;
    }
    if (password.trim() === '') {
      setPasswordError('Debe ingresar una contraseña.');
      return;
    }
  
    try {
      const response = await fetch(`${backendURL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Login exitoso: Redirigir al Home
        console.log('Login exitoso');
        const userId = data.userId;
  
        // Limpiar campos y navegar
        setEmail('');
        setPassword('');
        navigation.navigate('Home', { id: userId });
      } else if (response.status === 404) {
        // Error si el email no existe
        setEmailError('El email no está registrado');
      } else if (response.status === 401) {
        // Error si la contraseña es incorrecta
        setPasswordError('Contraseña incorrecta');
      } else {
        // Otros errores del servidor
        Alert.alert('Error', data.error || 'Hubo un problema al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al realizar el login:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };
  
  
  
  
  
  const changeEmail = (input: string) => {
    setEmail(input);
    setEmailError("");
  };

  const changePassword = (input: string) => {
    setPassword(input);
    setPasswordError("");
  };

  const testInput = (regex: RegExp, advice: string, input_password: string) => {
    if (!regex.test(input_password)) {
      return advice;
    } else {
      return "";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>DAILY FITZ</Text>
        </View>
        <View style={styles.loginTittleContainer}>
          <Text style={styles.loginTittleText}>Ingreso de usuario</Text>
        </View>
        <View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={changeEmail}
            placeholder='Email'
            placeholderTextColor={"#808080"}
          />
        </View>
        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{emailError}</Text>
        </View>
        <View>
          <TextInput
            style={styles.inputPassword}
            value={password}
            onChangeText={changePassword}
            secureTextEntry={passwordView}
            placeholder='Contraseña'
            placeholderTextColor={"#808080"}
          />
          <Pressable
            style={({ pressed }) => pressed ? styles.passwordDisplayButtonPressed : styles.passwordDisplayButton}
            onPress={passwordViewFlip}
          >
            <Image style={styles.passwordDisplayIcon} source={{ uri: 'https://storage.needpix.com/rsynced_images/eye-2387853_1280.png' }} />
          </Pressable>
        </View>
        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{passwordError}</Text>
        </View>
        <View>
          <Pressable
            style={styles.changeFormButton}
            onPress={() => navigation.navigate('Register')} 
          >
            <Text style={styles.changeFormButtonText}>Crear una cuenta</Text>
          </Pressable>
        </View>
        <View>
          <Pressable
            style={({ pressed }) => pressed ? styles.submitButtonPressed : styles.submitButton}
            onPress={loginRequest}
          >
            <Text style={styles.submitButtonText}>Enviar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    padding: 20,
    width: '90%',
    minWidth: 350,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    margin:'auto',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#007bff',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  loginTittleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginTittleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007bff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputPassword: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 45,
    marginVertical: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputError: {
    justifyContent: 'center',
    marginHorizontal: '5%',
    alignItems: 'flex-start',
  },
  inputErrorMenssage: {
    position:'absolute',
    top:-13,
    color: 'red',
    fontSize: 13,
  },
  changeFormButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  changeFormButtonText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  passwordDisplayButton:{
    borderColor:"black",
    borderRadius: 50,
    borderWidth:1,
    backgroundColor:"#cccccc",
    opacity:0.5,
    position:"absolute",
    marginVertical:15,
    top:10,
    right:10,
    height:30,
    width:30,
  },
  passwordDisplayButtonPressed:{
    borderColor:"black",
    borderRadius: 50,
    borderWidth:1,
    backgroundColor:"#b3b3b3",
    opacity:0.5,
    position:"absolute",
    marginVertical:15,
    top:10,
    right:10,
    height:30,
    width:30,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonPressed: {
    backgroundColor: '#0056b3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  passwordDisplayIcon: {
      width: '100%',
      height: '100%',
      position:'absolute',
      alignSelf: 'center',
    },
});
