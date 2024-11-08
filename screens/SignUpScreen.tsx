import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView,TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';

interface SignUpScreenProps {
  onFormToggle: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onFormToggle }) => {

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [surnameError, setSurnameError] = useState('');  
  const [emailError, setEmailError] = useState('');  
  const [passwordError, setPasswordError] = useState('');

  const [passwordView, setPasswordView] = useState(true);

  const passwordViewFlip=()=>{
    setPasswordView(!passwordView);
  }

  function signUpRequest(){
    (name.length<=0)?setNameError("Debe ingresar un nombre."):setNameError(testProfileText(name));
    (surname.length<=0)?setSurnameError("Debe ingresar un apellido."):setSurnameError(testProfileText(surname));
    (email.length<=0)?setEmailError("Debe ingresar un email."):setEmailError(testEmail(email));
    (password.length<=0)?setPasswordError("Debe ingresar una contraseña."):setPasswordError(testPassword(password));
    if (name===surname && surname===email && email===password){
    }
  }

  function testRegexWithAdvice(regex:RegExp,error_message:string,input_value:string){
    return (!regex.test(input_value)) ? error_message : "";
  }

  function testRegexWithAdviceSet(regex_set: { regex: RegExp; advice: string; }[],input_value:string){
    if (input_value===""){
        return "";
    }
    for ( let i=0;i<regex_set.length;i++){
        if (testRegexWithAdvice(regex_set[i].regex,regex_set[i].advice,input_value)!==""){
            return regex_set[i].advice;
        }
    }
    return "";
  }

  function regexWithAdvice(regex:RegExp,advice:string){
    return {
      regex:regex,
      advice:advice}
  }

  function changeName(input:string){
    let advice=testProfileText(input);
    (advice!=="")?setNameError(advice):setNameError("");
    setName(input);
  }

  function changeSurname(input:string){
    let advice=testProfileText(input);
    (advice!=="")?setSurnameError(advice):setSurnameError("");
    setSurname(input);
  }

  function testProfileText(input_password:string){
    const length_exp=regexWithAdvice(/^.{1,}$/,"Error en la cantidad de letras.");
    const words_exp=regexWithAdvice(/^[a-zA-Z]+( [a-zA-Z]+)*$/,"Error de escritura.");
    const regex_set=[length_exp,words_exp];
    return (testRegexWithAdviceSet(regex_set,input_password));
  }

  function changeEmail(input: string){
    let advice=testEmail(input);
    (advice!=="")?setEmailError(advice):setEmailError("");
    setEmail(input);
  }

  function testEmail(input_password: string){
    const length_exp=regexWithAdvice(/^.{1,}$/,"Error en la cantidad de digitos.");
    const format_exp=regexWithAdvice(/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,"El email no es valido.");
    const regex_set=[length_exp,format_exp];
    return (testRegexWithAdviceSet(regex_set,input_password));
  }

  function changePassword(input: string){
    let advice=testPassword(input);
    (advice!=="")?setPasswordError(advice):setPasswordError("");
    setPassword(input);
  }

  function testPassword(input_password: string){
    const length_exp=regexWithAdvice(/^.{8,}$/,"Debe ingrear como minimo 8 caracteres.");
    const uppercase_exp=regexWithAdvice(/[A-Z]/,"Debe incluir al menos una letra mayúscula.");
    const lowercase_exp=regexWithAdvice(/[a-z]/,"Debe incluir al menos una letra minúscula.");
    const number_exp=regexWithAdvice(/[0-9]/,"Debe incluir al menos un número.");
    const regex_set=[uppercase_exp,lowercase_exp,number_exp,length_exp];
    return (testRegexWithAdviceSet(regex_set,input_password));
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
        <View>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={changeName}
            placeholder='Ingrese su nombre'
            placeholderTextColor={"#808080"}
          />
        </View>
        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{nameError}</Text>
        </View>
        <View>
          <TextInput
            style={styles.input}
            value={surname}
            onChangeText={changeSurname}
            placeholder='Ingrese su apellido'
            placeholderTextColor={"#808080"}
          />
        </View>
        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{surnameError}</Text>
        </View>
        <View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={changeEmail}
            placeholder='Ingrese un email'
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
            placeholder='Ingrese una contraseña'
            placeholderTextColor={"#808080"}
          />
          <Pressable style={({ pressed }) => 
            pressed ? styles.passwordDisplayButtonPressed : styles.passwordDisplayButton} 
            onPress={passwordViewFlip}>
            <Image style={styles.passwordDisplayIcon} source={{ uri: 'https://storage.needpix.com/rsynced_images/eye-2387853_1280.png' }}/>
          </Pressable>
        </View>
        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{passwordError}</Text>
        </View>
        <View>
          <Pressable style={styles.changeFormButton}          
          onPress={onFormToggle}
          >
            <Text style={styles.changeFormButtonText}>Ingresar</Text>
          </Pressable>
        </View>
        <View>
          <Pressable style={({ pressed }) => 
            pressed ? styles.submitButtonPressed : styles.submitButton}
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
    marginBottom: 10, // Espacio debajo del texto
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
