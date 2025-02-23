import { StyleSheet, Text, View, Image, Pressable, FlatList, Alert, Dimensions, ActivityIndicator, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { backendURL } from '@/config';
import { BackHandler } from 'react-native'; // Importar BackHandler

const ProfilePictureScreen = ({ route }) => {
  const [user, setUser] = useState({});
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga
  const userId = route.params.id;
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();

    // Interceptar el botón de retroceso
    const backAction = () => {
      const alertMessage = 'Tienes cambios sin guardar. ¿Estás seguro que quieres salir?';

      if (Platform.OS === 'web') {
        // En la web, usar window.confirm
        const confirmed = window.confirm(alertMessage);
        if (confirmed) {
          navigation.goBack();
        }
      } else {
        // En dispositivos móviles, usar Alert.alert
        Alert.alert(
          'Salir sin guardar',
          alertMessage,
          [
            {
              text: 'Cancelar',
              onPress: () => null, // No hacer nada si se cancela
              style: 'cancel',
            },
            {
              text: 'Salir',
              onPress: () => navigation.goBack(), // Navegar hacia atrás sin guardar
            },
          ],
          { cancelable: false } // Asegura que no se pueda salir sin decidir
        );
      }

      return true; // Bloquea la acción por defecto
    };

    // Agregar listener para el botón de retroceso
    BackHandler.addEventListener('hardwareBackPress', backAction);

    // Limpiar el listener cuando la pantalla se desenfoque
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [navigation]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true); // Activar el indicador de carga
      const response = await fetch(`${backendURL}/users/${userId}`);
      const json = await response.json();
      setUser(json);
      setSelectedImage(json.profilePicture || ''); // Usamos la foto de perfil del usuario si existe
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // Desactivar el indicador de carga cuando termine la solicitud
    }
  };

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const saveProfileImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Por favor selecciona una imagen');
      return;
    }

    try {
      const response = await fetch(`${backendURL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profilePicture: selectedImage, // Actualizando la foto de perfil
        }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Foto de perfil actualizada');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Hubo un problema al actualizar la foto de perfil');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      Alert.alert('Error', 'Hubo un error al guardar la foto de perfil');
    }
  };

  const profileImages = [
    'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Lionel_Messi_WC2022.jpg/640px-Lionel_Messi_WC2022.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/400px-Cristiano_Ronaldo_2018.jpg',
    'https://images.ctfassets.net/3mv54pzvptwz/55YLwKPDnRXkqMBITRpWbC/0c2aefc04afa455c20e9ca0d209698e0/53174188191_42d4c831ae_o.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Federer_WM16_%2837%29_%2828136155830%29.jpg/245px-Federer_WM16_%2837%29_%2828136155830%29.jpg',
    'https://cdn.sanity.io/images/oyf3dba6/production/9fca0bc620a2cfebe91bcb30faab277e4776f1dd-580x580.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/0/06/Brann_-_Bar%C3%A7a_Femen%C3%AD_CG3A5851_%28cropped%29.jpg',
    'https://imageio.forbes.com/specials-images/imageserve/6059ea4e5a0beaf622a42a20/Megan-Rapinoe---United-States-v-Ireland---International-Friendly/960x0.jpg?height=549&width=711&fit=bounds',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc4dmLL4tmUO9WJsCg7DWXPMBTakr27xtxIQ&s',
  ];

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = 100; // Ancho de cada imagen
  const margin = 10; // Margen entre imágenes
  const numColumns = Math.floor(screenWidth / (imageWidth + margin * 2));

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleImageSelect(item)} style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      {selectedImage === item && <Text style={styles.selectedText}>Seleccionado</Text>}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu foto de perfil</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={profileImages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.imageList}
        />
      )}

      <Pressable style={styles.saveButton} onPress={saveProfileImage}>
        <Text style={styles.saveButtonText}>Guardar Foto de Perfil</Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => {
        const alertMessage = 'Tienes cambios sin guardar. ¿Estás seguro que quieres salir?';

        if (Platform.OS === 'web') {
          const confirmed = window.confirm(alertMessage);
          if (confirmed) {
            navigation.goBack();
          }
        } else {
          Alert.alert(
            'Salir sin guardar',
            alertMessage,
            [
              {
                text: 'Cancelar',
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: 'Salir',
                onPress: () => navigation.goBack(),
              },
            ],
            { cancelable: false }
          );
        }
      }}>
        <Text style={styles.backButtonText}>Volver al Perfil</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageList: {
    width: '100%',
    justifyContent: 'flex-start',
    marginLeft: -10,
  },
  imageContainer: {
    margin: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  selectedText: {
    marginTop: 5,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfilePictureScreen;
