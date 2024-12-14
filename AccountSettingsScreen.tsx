import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView,TextInput, Pressable, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { backendURL } from '@/config';
import LoadingOverlay from '../components/LoadingOverlay';


// Este es para cambiar datos del perfil (no password)

const AccountSettingsScreen = ({route}) => {
  
  // Constantes con valores asignados
    const fotoPred={
      perfil:'https://freesvg.org/img/abstract-user-flat-4.png',
      reestablecer:'https://cdn.iconscout.com/icon/free/png-256/free-actualizar-453-444941.png',
      eliminar:'https://cdn.iconscout.com/icon/free/png-256/free-delete-icon-download-in-svg-png-gif-file-formats--recycle-bin-waste-ui-elements-pack-user-interface-icons-470378.png',
    }

    // Contantes con un estado asignado (el estado inicial puede ser nulo)
    const [user, setUser] = useState({});
    const [nombre,setNombre] = useState('');
    const [apellido,setApellido] = useState('');
    const [email,setEmail] = useState('');
    const [fotoPerfil,setFotoPerfil] = useState(fotoPred.perfil)
    var userId = route.params.id;
    const [loading,setLoading]=useState(true);

  
    // Espacio del codigo reservado para los avisos cuando el usuario quiere reslizar una accion o solicitud
    const  resetAccountSettingsAdvice= () => {
      Alert.alert('Aviso','Los datos ingresados serán remplazados por los originales',
        [
          {
            text: 'Si',
            onPress: () => resetAccountSettings()
          },
          {
            text: 'No',
          },
        ],
        {cancelable: false},
      );
    };

    const  submitAccountSettingsAdvice= () => {
      Alert.alert('Aviso','¿Está seguro que deséa cambiar su perfil con los datos ingresados?',
        [
          {
            text: 'Si',
            onPress: () => resetAccountSettings()
          },
          {
            text: 'No',
          },
        ],
        {cancelable: false},
      );
    };

    useFocusEffect(
      useCallback(() => {
        fetchData();
      }, [])
    );

    const fetchData = async () => {
      try {
        const response = await fetch(`${backendURL}/users/${userId}`);
        const json = await response.json();
        setUser(json);
        setNombre(json.nombre || '');
        setApellido(json.apellido || '');
        setEmail(json.email || '');
        console.log(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const resetAccountSettings = () => {
      // Cual es la clave para el email en la db ??
      setNombre(user.nombre || '');
      setApellido(user.apellido || '');
      setEmail(user.email || '');
      resetAcountProfileImage();
    }

    const resetAcountProfileImage = () => {
      // Cual es la clave de la foto de perfil y el url del perfil
      setFotoPerfil(user.foto || fotoPred.perfil)
    }



   // Funcion para validar los datos que se desean modificar (si no hay cambios no se realizan los cambios)
   // Los datos deben cumplir con las expresiones regulares correspondientes
   // true (se puede realizar la consulta a la db)
    const testUserData=function(){
      const words_exp=/^[a-zA-Z]+( [a-zA-Z]+)*$/;
      const email_exp=/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      if (nombre===user.nombre && apellido===user.apellido && email===user.email /* && url imagen */){
        Alert.alert('Aviso','No modificó su perfil');
      } else if (!words_exp.test(nombre)){
        Alert.alert('Aviso','El nombre no es válido');
      } else if (!words_exp.test(apellido)){
        Alert.alert('Aviso','El apellio no es válido');
      } else if (!email_exp.test(email)){
        Alert.alert('Aviso','El email no es válido');
      } else {
        return true;
      }
      return false;
    };



    const submitAccountSettings = async () => {
      setLoading(true)
      fetch(`${backendURL}/users/${userId}`, { 
        method: 'PATCH',
        body: JSON.stringify({nombre:nombre,apellido:apellido,email:email}),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(()=>{
        setLoading(false);
      })
    };


    


  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingOverlay/>}
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View>
          <Text style={styles.tittle}>Editar Perfil</Text>
        </View>
        <View style={styles.profileImageContainer}>
          <Pressable>
            <Image style={styles.profileImage} source={{uri:fotoPerfil}} />
          </Pressable>
          <View style={styles.profileOptionsContainer}>
            <Pressable style={styles.profileImageOptionsContainer}>
              <Image style={styles.profileImageOptions} source={{uri:fotoPred.reestablecer}}/>
            </Pressable>
            <Pressable style={styles.profileImageOptionsContainer}>
              <Image style={styles.profileImageOptions} source={{uri:fotoPred.eliminar}}/>
            </Pressable>
          </View>
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>Nombre</Text>
          <TextInput
            style={styles.textInput}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>Apellido</Text>
          <TextInput
            style={styles.textInput}
            value={apellido}
            onChangeText={setApellido}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View>
          <Pressable
            style={[styles.button, styles.buttonReset]}
            onPress={resetAccountSettingsAdvice}
          >
            <Text style={styles.buttonText}>Restablecer</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => (testUserData() ? submitAccountSettings() : resetAccountSettings())}
          >
            <Text style={styles.buttonText}>Enviar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



// este es para solo cambiar la contraseña

const PasswordSettingScreen = ({route}) => {


    // Contantes con un estado asignado (el estado inicial puede ser nulo)
    const [user, setUser] = useState({});
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('')
    const [newPassword,setNewPassword] = useState('')
    var userId = route.params.id;
    const [loading,setLoading]=useState(true);
    const [passwordView, setPasswordView] = useState(true);
    const [newPasswordView, setNewPasswordView] = useState(true);

  
    // Espacio del codigo reservado para los avisos cuando el usuario quiere reslizar una accion o solicitud
    const  resetAccountSettingsAdvice= () => {
      Alert.alert('Aviso','Los datos ingresados serán remplazados por los originales',
        [
          {
            text: 'Si',
            onPress: () => resetAccountSettings()
          },
          {
            text: 'No',
          },
        ],
        {cancelable: false},
      );
    };

    const  submitAccountSettingsAdvice= () => {
      Alert.alert('Aviso','¿Está seguro que deséa cambiar su perfil con los datos ingresados?',
        [
          {
            text: 'Si',
            onPress: () => resetAccountSettings()
          },
          {
            text: 'No',
          },
        ],
        {cancelable: false},
      );
    };

    useFocusEffect(
      useCallback(() => {
        fetchData();
      }, [])
    );

    const fetchData = async () => {
      try {
        const response = await fetch(`${backendURL}/users/${userId}`);
        const json = await response.json();
        setUser(json);
        console.log(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const resetAccountSettings = () => {
      // Cual es la clave para el email y la password en la db ??
      setEmail('');
      setPassword('');
      setNewPassword('');
    }


   // Funcion para validar los datos que se desean modificar (si no hay cambios no se realizan los cambios)
   // Los datos deben cumplir con las expresiones regulares correspondientes
   // true (se puede realizar la consulta a la db)
    const testUserData=function(){
      const email_exp=/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/
      const password_exp=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (email==='' || password===''){
        Alert.alert('Aviso','No se ingresaron los datos para la verificacion');
      } else if (!email_exp.test(email)){
        Alert.alert('Aviso','El email ingresado no es válido');
      } else if (!password_exp.test(password)){
        Alert.alert('Aviso','La contraseña de verifición no es válida');
      } else if (!password_exp.test(newPassword)){
        Alert.alert('Aviso','La nueva contraseña no es válida');
      } else if (password===newPassword){
        Alert.alert('Aviso','Las contraseñas ingresadas no deben coincidir');
      } else {
        return true;
      }
      return false;
    };



    const submitAccountSettings = async () => {
      setLoading(true)
      // aca no se que metodo usar y ccomo se deberia comprobar y despues cambiar los datos
      fetch(`${backendURL}/users/${userId}`, { 
   //     method: 'PATCH',
    //    body: JSON.stringify({email:email}),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(()=>{
        setLoading(false);
      })
    };




    return (
      <SafeAreaView style={styles.container}>
      {loading && <LoadingOverlay/>}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <Text style={styles.tittle}>Configurar contraseña</Text>
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>Contraseña actual</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={passwordView}
            />
          <Pressable style={({ pressed }) => 
            pressed ? styles.passwordDisplayButtonPressed : styles.passwordDisplayButton} 
            onPress={()=>setPasswordView(!passwordView)}>
            <Image style={styles.passwordDisplayIcon} source={{ uri: 'https://storage.needpix.com/rsynced_images/eye-2387853_1280.png' }}/>
          </Pressable>
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>Nueva contraseña</Text>
          <TextInput
            style={styles.textInput}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={newPasswordView}
          />
          <Pressable style={({ pressed }) => 
            pressed ? styles.passwordDisplayButtonPressed : styles.passwordDisplayButton} 
            onPress={()=>setNewPasswordView(!newPasswordView)}>
            <Image style={styles.passwordDisplayIcon} source={{ uri: 'https://storage.needpix.com/rsynced_images/eye-2387853_1280.png' }}/>
          </Pressable>
        </View>
        <View>
          <Pressable
            style={[styles.button, styles.buttonReset]}
            onPress={resetAccountSettingsAdvice}
          >
            <Text style={styles.buttonText}>Restablecer</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => (testUserData() ? submitAccountSettings() : resetAccountSettings())}
          >
            <Text style={styles.buttonText}>Enviar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>

    );
  };




export default AccountSettingsScreen;







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
    margin: 'auto',
  },
  tittle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  profileOptionsContainer: {
    width: '65%',
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    top: 50,
  },
  profileImageOptions: {
    width: '100%',
    height: '100%',
  },  
  profileImageOptionsContainer: {
    width: 30,
    height: 30,
    //borderColor: '#ddd',
    //borderBlockColor: '#000',
    //borderWidth: 2,
  },
  
  textInputContainer: {
    marginBottom: 15,
  },
  textInputLabel: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textInputPassword: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 45,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonReset: {
    backgroundColor: '#f44336',
    marginTop: 10,
  },
  passwordDisplayButton:{
    borderColor:"black",
    borderRadius: 50,
    borderWidth:1,
    backgroundColor:"#cccccc",
    opacity:0.5,
    position:"absolute",
    marginVertical:15,
    top:17,
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
    top:17,
    right:10,
    height:30,
    width:30,
  },
  passwordDisplayIcon: {
    width: '100%',
    height: '100%',
    position:'absolute',
    alignSelf: 'center',
  },
});

