import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { backendURL } from "@/config";

const date = new Date();

export default function Message({ userId, message }) {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos del usuario
  const fetchData = async () => {
	  try {
		const response = await fetch(`${backendURL}/users/${userId}/stats`);
		const json = await response.json();
  
		if (json.error) {
		  setError(json.error);
		} else {
		  setUser(json.user);
		}
	  } catch (error) {
		console.error('Error fetching data:', error);
		setError('Error al obtener las estadísticas.');
	  } finally {
		setLoading(false);
	  }
	};

  // Usamos useEffect para cargar los datos cuando el componente se monte
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <View style={styles.message}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image
					style={styles.icon} 
					source={{ uri: user.profilePicture }}
				  />
          <Text style={{ fontWeight: 500 }}>{`${user.nombre || ''} ${user.apellido || ''}`}</Text>
        </View>
        <Text style={{ fontSize: 10, fontWeight: "600" }}>
          {date.getHours()}:{date.getMinutes().toString().padStart(2, "0")}
        </Text>
      </View>
      <Text style={{ fontSize: 14, width: "100%", flex: 1, paddingLeft: 0 }}>
        {message}
      </Text>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    flexDirection: "column",
    gap: 8,
    backgroundColor: "#f1f2f3",
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
