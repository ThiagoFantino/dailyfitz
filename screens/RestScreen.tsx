import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import React from 'react'

const RestScreen = () => {
  return (
    <SafeAreaView>
    <Image
      // resizeMode="contain"
      source={{
        uri: "https://www.sport.es/labolsadelcorredor/wp-content/uploads/2021/02/entrenamiento.jpeg",
      }}
      style={{ width: "100%", height: 420 }}
    />

    <Text
      style={{
        fontSize: 30,
        fontWeight: "900",
        marginTop: 50,
        textAlign: "center",
      }}
    >
      DESCANSO
    </Text>
  </SafeAreaView>
  )
}

export default RestScreen

const styles = StyleSheet.create({})