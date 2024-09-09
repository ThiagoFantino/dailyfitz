import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import React,{useState,useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';

const RestScreen = () => {
  const navigation = useNavigation();
  let timer = 0;
  const[timeLeft,setTimeLeft] = useState(3);

  const startTime = () =>{
    setTimeout(()=>{
      if(timeLeft <= 0){
        navigation.goBack();
        clearTimeout(timer);
      }
      setTimeLeft(timeLeft-1);
    },1000)
  }

useEffect(()=>{
    startTime();
    return ()=>clearTimeout(timer);
},)

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

    <Text>{timeLeft}</Text>
  </SafeAreaView>
  )
}

export default RestScreen

const styles = StyleSheet.create({})