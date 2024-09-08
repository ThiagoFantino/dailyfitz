import { StyleSheet, Text, View, Image,ScrollView } from 'react-native'
import React from 'react'
import RoutinesCards from '@/components/RoutinesCards'

const HomeScreen = () => {
  return (
    <ScrollView style={{marginTop:50}}>
      <View style={{ backgroundColor: "#CD853F", padding: 10, height: 200, width: "100%" }}>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>DAILY FITZ</Text>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, }}>
          <View>
            <Text style={{ textAlign: "center", fontWeight: "bold", color: "white", fontSize: 18 }}>0</Text>
            <Text style={{color:"#D0D0D0",fontSize:17,marginTop:6}}>RUTINAS</Text>
          </View>

          <View>
            <Text style={{ textAlign: "center", fontWeight: "bold", color: "white", fontSize: 18 }}>0</Text>
            <Text style={{color:"#D0D0D0",fontSize:17,marginTop:6}}>CALORIAS</Text>
          </View>

          <View>
            <Text style={{ textAlign: "center", fontWeight: "bold", color: "white", fontSize: 18 }}>0</Text>
            <Text style={{color:"#D0D0D0",fontSize:17,marginTop:6}}>MINUTOS</Text>
          </View>
        </View>

        <View style={{justifyContent:"center",alignItems:"center"}}>
        </View>
        <RoutinesCards/>
      </View>
    </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})