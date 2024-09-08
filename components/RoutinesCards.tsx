import {StyleSheet, Text, View , Pressable, Image} from 'react-native'
import React from 'react'
import routines from '@/data/routines'

const Routines = () => {
  const RoutinesData = routines;
  return (
    <View>
        {RoutinesData.map((item,key)=>(
          <Pressable style={{alignItems:"center",justifyContent:"center",margin:10}} key={key}>
            <Image style={{width:"95%",height:140,borderRadius:7}}source={item.image}
            />
            <Text style={{position:"absolute",color:"white",fontSize:16,fontWeight:"bold",left:20,top:20}}>{item.name}</Text>

          </Pressable>
        ))}
    </View>
  )
}

export default Routines

const styles = StyleSheet.create({})