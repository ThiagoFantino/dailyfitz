import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";
import routines from "@/data/routines";
import { useNavigation } from "@react-navigation/native";

const Routines = () => {
  const navigation = useNavigation<any>();

  return (
    <View>
      {routines.map((item, key) => (
        <Pressable
          onPress={() =>
            navigation.navigate("Routine", {
              image: item.image,
              excersises: item.excersises,
              id: item.id,
            })
          }
          style={styles.pressable}
          key={key}
        >
          <Image style={styles.image} source={{ uri: item.image }} />
          <Text style={styles.text}>{item.name}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default Routines;

const styles = StyleSheet.create({
  pressable: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  image: {
    width: "95%",
    height: 140,
    borderRadius: 7,
  },
  text: {
    position: "absolute",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    left: 20,
    top: 20,
  },
});
