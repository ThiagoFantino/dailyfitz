import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView,TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalada la librería de iconos

const UserStatsScreen = () => {
  const [user, setUser] = useState('');
  const [userError, setUserError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('Error');

  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          style={styles.loginPicture} 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/256/1144/1144760.png' }} 
        />
        <Text style={styles.loginTittle}>Login</Text> 
        <View >
          <TextInput
            style={styles.input}
            onChangeText={setUser}
            placeholder='Usuario, telefono o email'
          />
        </View>
        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{userError}</Text>
        </View>
        <View>
          <TextInput
            style={styles.input}            
            onChangeText={setPassword}
            secureTextEntry={true}
            value={password}
            placeholder='Contraseña'
          />
        </View>

        <View style={styles.inputError}>
          <Text style={styles.inputErrorMenssage}>{passwordError}</Text>
        </View>
        <View>
          <Pressable style={({ pressed }) => 
            pressed ? styles.submitButtonPressed : styles.submitButton
          }>
            <Text style={styles.SubmitButtonText}>Enviar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserStatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    margin: 'auto',
    width: 350,
    height: 450,
    backgroundColor: '#cce6ff',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 20,
    
  },
  loginPicture: {
    width: 100, // Tamaño reducido para pantallas más pequeñas
    height: 100,
    color:"#ffffff",
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: 'center'
  },
  loginTittle: {
    fontSize: 22, // Tamaño de texto más pequeño
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input:{
    height: 40,
    borderColor: '#333',
    borderWidth: 1,
    padding: 20,
    marginHorizontal:'10%',
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#99ceff',
    color: '#fff',  
  },
  inputError:{
    height:10,
    marginHorizontal:"15%",
  },  
  inputErrorMenssage:{
    fontSize:10,
    color:"red",
  },

  submitButton:{
    backgroundColor:"#99ceff",
    marginHorizontal:"auto",
    marginTop:30,
    marginBottom:0,
    borderColor:"black",
    borderWidth:1,
    borderRadius:5,
    width:"20%",
    height:"auto",
    padding:5,
    alignItems:"center",
    justifyContent:"center"
  },
  submitButtonPressed:{
    backgroundColor:"#66b5ff",
    marginHorizontal:"auto",
    marginVertical:10,
    borderColor:"black",
    borderWidth:1,
    borderRadius:5,
    width:"20%",
    height:"auto",
    padding:5,
    alignItems:"center",
    justifyContent:"center",
  },
  SubmitButtonText:{
    color:"white",
    fontSize: 10,
  }

  
});


