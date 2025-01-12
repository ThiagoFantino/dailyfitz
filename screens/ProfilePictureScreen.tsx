import { StyleSheet, Text, View, Image, Pressable, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { backendURL } from '@/config';

const ProfilePictureScreen = ({ route }) => {
  const [user, setUser] = useState({});
  const [selectedImage, setSelectedImage] = useState('');
  const userId = route.params.id;
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${backendURL}/users/${userId}`);
      const json = await response.json();
      setUser(json);
      setSelectedImage(json.profilePicture || ''); // Usamos la foto de perfil del usuario si existe
    } catch (error) {
      console.error('Error fetching user data:', error);
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Lionel_Messi_WC2022.jpg/640px-Lionel_Messi_WC2022.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/400px-Cristiano_Ronaldo_2018.jpg',
    'https://images.ctfassets.net/3mv54pzvptwz/55YLwKPDnRXkqMBITRpWbC/0c2aefc04afa455c20e9ca0d209698e0/53174188191_42d4c831ae_o.jpg',
  ];

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleImageSelect(item)} style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      {selectedImage === item && <Text style={styles.selectedText}>Seleccionado</Text>}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu foto de perfil</Text>
      
      <FlatList
        data={profileImages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        contentContainerStyle={styles.imageList}
      />

      <Pressable style={styles.saveButton} onPress={saveProfileImage}>
        <Text style={styles.saveButtonText}>Guardar Foto de Perfil</Text>
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
    marginBottom: 30,
  },
  imageContainer: {
    marginHorizontal: 10,
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
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilePictureScreen;