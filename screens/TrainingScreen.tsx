import { StyleSheet, Text, View, SafeAreaView,Image,Pressable } from 'react-native'
import React,{useState} from 'react'
import { useRoute } from '@react-navigation/native'

const TrainingScreen = () => {
  const route = useRoute();
  console.log(route.params);
  const [index,setIndex] = useState(0);
  const excersise = route.params.excersises;
  const current = excersise[index];
  console.log(current,"first excersise");
  return (
    <SafeAreaView>
      <Image style={{width:"100%",height:370}} source={{uri:current.image}}/>
      <Text style={{marginLeft:"auto",marginRight:"auto",marginTop:30,fontSize:30,fontWeight:"bold"}}>{current.name}</Text>
      <Text style={{marginLeft:"auto",marginRight:"auto",marginTop:30,fontSize:38,fontWeight:"bold"}}>x{current.sets}</Text>
    <Pressable style={{backgroundColor:"blue",marginLeft:"auto",marginRight:"auto",marginTop:30,borderRadius:20,padding:10,width:150}}>
      <Text style={{textAlign:"center",fontWeight:"bold",fontSize:20,color:"white"}}>FINALIZADO</Text>
    </Pressable>
    </SafeAreaView>
  )
}

export default TrainingScreen

const styles = StyleSheet.create({})