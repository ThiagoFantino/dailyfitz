import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { backendURL } from '@/config';
import { useNavigation } from '@react-navigation/native';

interface SignUpScreenProps {
  onFormToggle?: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onFormToggle }) => {

  const navigation = useNavigation();
  const [nombre, setName] = useState('');
  const [apellido, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [surnameError, setSurnameError] = useState('');  
  const [emailError, setEmailError] = useState('');  
  const [passwordError, setPasswordError] = useState('');

  const [passwordView, setPasswordView] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const passwordViewFlip = () => {
    setPasswordView(!passwordView);
  };

  function signUpRequest() {
    let hasError = false;
  
    if (nombre.trim().length <= 0) {
      setNameError("Debe ingresar un nombre.");
      hasError = true;
    } else if (testProfileText(nombre)) {
      setNameError(testProfileText(nombre));
      hasError = true;
    }
  
    if (apellido.trim().length <= 0) {
      setSurnameError("Debe ingresar un apellido.");
      hasError = true;
    } else if (testProfileText(apellido)) {
      setSurnameError(testProfileText(apellido));
      hasError = true;
    }
  
    if (email.trim().length <= 0) {
      setEmailError("Debe ingresar un email.");
      hasError = true;
    } else if (testEmail(email)) {
      setEmailError(testEmail(email));
      hasError = true;
    }
  
    if (password.trim().length <= 0) {
      setPasswordError("Debe ingresar una contraseña.");
      hasError = true;
    } else if (testPassword(password)) {
      setPasswordError(testPassword(password));
      hasError = true;
    }
  
    if (!hasError) {
      // Enviar datos al backend
      const userData = { nombre, apellido, calorias: 0, entrenamientos: 0, tiempo: 0, email, password };
      fetch(`${backendURL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error === 'El email ya está registrado.') {
            setEmailError(data.error);
          } else {
            console.log('Success:', data);
            setSuccessMessage('¡Cuenta creada con éxito!');
            loginAfterSignUp(email, password);
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  }
  

  function loginAfterSignUp(email, password) {
    // Realiza la solicitud de login después de un registro exitoso
    fetch(`${backendURL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.userId) {  // Verificamos si la respuesta contiene userId
          console.log('Login exitoso');
          const id = data.userId;
  
          // Limpiar campos
          setEmail('');
          setPassword('');
  
          // Redirigir al home
          navigation.navigate("Home", { id: id });
        } else {
          Alert.alert('Error', data.error || 'Error al iniciar sesión');
        }
      })
      .catch((error) => {
        console.error('Error al realizar el login:', error);
        Alert.alert('Error', 'Hubo un problema con el login');
      });
  }
  

  function testRegexWithAdvice(regex: RegExp, error_message: string, input_value: string) {
    return (!regex.test(input_value)) ? error_message : "";
  }

  function testRegexWithAdviceSet(regex_set: { regex: RegExp; advice: string; }[], input_value: string) {
    if (input_value === "") {
      return "";
    }
    for (let i = 0; i < regex_set.length; i++) {
      if (testRegexWithAdvice(regex_set[i].regex, regex_set[i].advice, input_value) !== "") {
        return regex_set[i].advice;
      }
    }
    return "";
  }

  function regexWithAdvice(regex: RegExp, advice: string) {
    return {
      regex: regex,
      advice: advice
    };
  }

  function changeName(input: string) {
    let advice = testProfileText(input);
    (advice !== "") ? setNameError(advice) : setNameError("");
    setName(input);
  }

  function changeSurname(input: string) {
    let advice = testProfileText(input);
    (advice !== "") ? setSurnameError(advice) : setSurnameError("");
    setSurname(input);
  }

  function testProfileText(input_password: string) {
    const length_exp = regexWithAdvice(/^.{1,}$/, "El campo no puede estar vacío");
    const words_exp = regexWithAdvice(/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ' -]+$/, "Solo se permiten letras, espacios y caracteres como tildes, ñ, apóstrofes o guiones.");
    const regex_set = [length_exp, words_exp];
    return (testRegexWithAdviceSet(regex_set, input_password));
  }

  function changeEmail(input: string) {
    let advice = testEmail(input);
    (advice !== "") ? setEmailError(advice) : setEmailError("");
    setEmail(input);
  }

  function testEmail(input_email: string) {
    const length_exp = regexWithAdvice(/^.{1,}$/, "El campo no puede estar vacío");
    const format_exp = regexWithAdvice(
        /^[A-Za-zÑñ0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-zÑñ0-9-]+(\.[A-Za-zÑñ0-9-]+)+$/,
        "El email no es válido."
    );
    const regex_set = [length_exp, format_exp];
    return testRegexWithAdviceSet(regex_set, input_email);
}



  function changePassword(input: string) {
    let advice = testPassword(input);
    (advice !== "") ? setPasswordError(advice) : setPasswordError("");
    setPassword(input);
  }

  function testPassword(input_password: string) {
    const length_exp = regexWithAdvice(/^.{8,}$/, "Debe ingresar como mínimo 8 caracteres.");
    const uppercase_exp = regexWithAdvice(/(?=.*[A-Z])/, "Debe incluir al menos una letra mayúscula.");
    const lowercase_exp = regexWithAdvice(/(?=.*[a-z])/, "Debe incluir al menos una letra minúscula.");
    const number_exp = regexWithAdvice(/(?=.*\d)/, "Debe incluir al menos un número.");
    const special_char_exp = regexWithAdvice(/(?=.*[@$!%*?&#+^()_={}\[\]<>\|~])/, "Debe incluir al menos un carácter especial. Caracteres permitidos: @$!%*?&#+^()_={}[].<>|~");
    const no_whitespace_exp = regexWithAdvice(/^\S*$/, "No se permiten espacios en blanco.");
    const regex_set = [length_exp, uppercase_exp, lowercase_exp, number_exp, special_char_exp, no_whitespace_exp];
    return testRegexWithAdviceSet(regex_set, input_password);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>DAILY FITZ</Text>
        </View>
        <View style={styles.loginTittleContainer}>        
          <Text style={styles.loginTittleText}>Registro de usuario</Text> 
        </View>

        {successMessage ? (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessage}>{successMessage}</Text>
          </View>
        ) : null}
        
        {/* Nombre */}
        <View>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={changeName}
            placeholder='Ingrese su nombre'
            placeholderTextColor={"#808080"}
          />
          <Text style={styles.inputHint}>Debe ser un nombre válido (letras, espacios, apóstrofes o guiones).</Text>
        </View>
        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{nameError}</Text>
        </View>

        {/* Apellido */}
        <View>
          <TextInput
            style={styles.input}
            value={apellido}
            onChangeText={changeSurname}
            placeholder='Ingrese su apellido'
            placeholderTextColor={"#808080"}
          />
          <Text style={styles.inputHint}>Debe ser un apellido válido (letras, espacios, apóstrofes o guiones).</Text>
        </View>
        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{surnameError}</Text>
        </View>

        {/* Email */}
        <View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={changeEmail}
            placeholder='Ingrese un email'
            placeholderTextColor={"#808080"}
          />
          <Text style={styles.inputHint}>Debe tener el formato: ejemplo@dominio.com</Text>
        </View>
        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{emailError}</Text>
        </View>

        {/* Contraseña */}
        <View>
          <TextInput
            style={styles.inputPassword}            
            value={password}
            onChangeText={changePassword}
            secureTextEntry={passwordView}
            placeholder='Ingrese una contraseña'
            placeholderTextColor={"#808080"}
          />
          <Pressable style={({ pressed }) => pressed ? styles.passwordDisplayButtonPressed : styles.passwordDisplayButton} 
            onPress={passwordViewFlip}>
            <Image style={styles.passwordDisplayIcon} source={{ uri: 'https://storage.needpix.com/rsynced_images/eye-2387853_1280.png' }}/>
          </Pressable>
          <Text style={styles.inputHint}>Debe incluir al menos 8 caracteres, una mayúscula, un número y un carácter especial.</Text>
        </View>
        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{passwordError}</Text>
        </View>

        <View>
        <Pressable
        style={styles.changeFormButton}
        onPress={() => navigation.navigate('Login')} // Asegúrate de que 'Login' sea el nombre correcto de tu pantalla de login
        >
        <Text style={styles.changeFormButtonText}>¿Ya tienes una cuenta? Inicia sesión</Text>
        </Pressable>

          <Pressable
            style={styles.submitButton}
            onPress={signUpRequest}
          >
            <Text style={styles.submitButtonText}>Enviar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    backgroundColor: '#ffffff',
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
    alignItems: 'flex-start',
  },
  inputErrorMenssage: {
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
  successMessageContainer: {
    marginBottom: 15,
  },
  successMessage: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  passwordDisplayIcon: {
      width: '100%',
      height: '100%',
      position:'absolute',
      alignSelf: 'center',
    },
  inputHint: {
      fontSize: 14,
      color: '#007bff',
      marginVertical: 5,
    },
});
