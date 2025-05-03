import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity } from "react-native";
import Response from "@/components/response";
import Message from "@/components/message";

export default function App({route}) {
	const userId = route.params?.id;
	const [inputText, setInputText] = useState("");
	const [listData, setListData] = useState([]);
	const SearchInput = () => {
		setListData((prevList) => [...prevList, inputText]);
		setInputText("");
	};

	return (
		<View style={styles.container}>
			<StatusBar style="auto" />

			{/* Header */}
			<View style={styles.header}>
				<Image source={require("@/assets/images/Fitzy.jpg")} style={[styles.icon, { width: 64, height: 64 }]} />
				<Text style={{ fontSize: 30, fontWeight: "800", color: "#323232" }}>Fitzy</Text>
			</View>

			{/* Content */}
			<FlatList
				style={{ paddingHorizontal: 16, marginBottom: 80 }}
				data={listData}
				renderItem={({ item }) => (
					<View>
						<Message message={item} userId={userId}/>
						<Response prompt={item} />
					</View>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>

			{/* Search-Bar */}
			<View style={styles.searchBar}>
				<TextInput placeholder="Preguntale a Fitzy" style={styles.input} value={inputText} onChangeText={(text) => setInputText(text)} selectionColor={"#323232"}></TextInput>
				<TouchableOpacity onPress={SearchInput}>
					<Image source={require("@/assets/images/right-arrow.png")} style={styles.icon} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 16,
		paddingTop: 36,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		margin: 8,
		gap: 8,
	},
	icon: {
		width: 32,
		height: 32,
	},
	searchBar: {
		backgroundColor: "#ffffff",
		width: "100%",
		position: "absolute",
		bottom: 0,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
		paddingVertical: 16,
		gap: 8,
	},
	input: {
		backgroundColor: "#fff",
		width: "100%",
		fontSize: 16,
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 32,
		borderWidth: 0.1,
	},
});