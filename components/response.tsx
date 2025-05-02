import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { GoogleAPIKey, backendURL } from "@/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";

const date = new Date();
const genAI = new GoogleGenerativeAI(GoogleAPIKey);

export default function Response(props) {
	const [generatedText, setGeneratedText] = useState("");

	useEffect(() => {
		const fetchAndGenerate = async () => {
			try {
				let zona = "";

				// Detectar zona en el prompt
				if (props.prompt.toLowerCase().includes("brazo")) zona = "brazos";
				else if (props.prompt.toLowerCase().includes("pierna")) zona = "piernas";
				else if (props.prompt.toLowerCase().includes("espalda")) zona = "espalda";
				// Agregar más zonas si es necesario

				// Si se detecta una zona, buscar rutinas relacionadas
				let rutinaData = [];
				if (zona) {
					const response = await fetch(`${backendURL}/routines?zona=${zona}`);
					rutinaData = await response.json();
				}

				// Preparar el texto base para pasar al modelo AI
				const textoBase = zona && rutinaData.length > 0
					? `Estas son las rutinas disponibles para ${zona}: ${rutinaData.map((r) => `• ${r.name}`).join("\n")}. Recomendá una.`
					: props.prompt;

				// Generar contenido con el modelo AI de Google
				const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
				const result = await model.generateContent(textoBase);
				const responseAI = await result.response;
				const text = await responseAI.text();

				// Establecer el texto generado
				setGeneratedText(text);
			} catch (error) {
				console.error("Error al generar respuesta:", error);
				setGeneratedText("Hubo un problema al obtener la respuesta.");
			}
		};

		fetchAndGenerate();
	}, [props.prompt]);  // Dependencia para cuando cambie el prompt

	return (
		<View style={styles.response}>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
					<Image source={require("@/assets/images/Fitzy.jpg")} style={styles.icon} />
					<Text style={{ fontWeight: 600 }}>Fitzy</Text>
				</View>
				<Text style={{ fontSize: 10, fontWeight: "600" }}>
					{date.getHours()}:{date.getMinutes()}
				</Text>
			</View>
			<Markdown>{generatedText}</Markdown>
		</View>
	);
}

const styles = StyleSheet.create({
	response: {
		flexDirection: "column",
		gap: 8,
		backgroundColor: "#fafafa",
		marginBottom: 8,
		padding: 16,
		borderRadius: 16,
	},
	icon: {
		width: 28,
		height: 28,
	},
});
