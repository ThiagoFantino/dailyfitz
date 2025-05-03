import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { GoogleAPIKey, backendURL } from "@/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";

const date = new Date();
const genAI = new GoogleGenerativeAI(GoogleAPIKey);

export default function Response(props) {
  const [generatedText, setGeneratedText] = useState("");
  const [createdRoutine, setCreatedRoutine] = useState(null);

  useEffect(() => {
    const fetchAndGenerate = async () => {
      try {
        const promptUsuario = props.prompt;

        // 1. Obtener los ejercicios disponibles en tu base de datos
        const ejerciciosRes = await fetch(`${backendURL}/routines/exercises`);
        const ejercicios = await ejerciciosRes.json();
        const listaEjercicios = ejercicios.map((e) => `• ${e.name}`).join("\n");
        console.log("Lista de ejercicios:", listaEjercicios);

        // 2. Crear el prompt para Gemini
        const promptIA = `
El usuario pidió: "${promptUsuario}".

Elegí ejercicios solamente de la siguiente lista:
${listaEjercicios}

Para cada ejercicio elegido, asigná un número razonable de series y repeticiones según el tipo de entrenamiento. Respondé solo en JSON con este formato:
[
  { "name": "Nombre del ejercicio", "sets": 3, "reps": 12 },
  { "name": "Otro ejercicio", "sets": 2, "reps": 20 }
]`;

        // 3. Generar contenido con Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(promptIA);
        const textRaw = await result.response.text();

        // 4. Limpiar y parsear JSON
        const cleanText = textRaw.replace(/```json|```/g, "").trim();
        const parsedJSON = JSON.parse(cleanText);

        // 5. Buscar los IDs en base a los nombres
        const ejerciciosFinales = parsedJSON.map((ej) => {
          const match = ejercicios.find((e) => e.name.toLowerCase() === ej.name.toLowerCase());
          if (!match) throw new Error(`Ejercicio no encontrado: ${ej.name}`);
          return {
            id: match.id,
            sets: ej.sets,
            reps: ej.reps,
          };
        });

        // 6. Crear rutina en el backend
        const rutinaData = {
          name: `Rutina generada - ${new Date().toLocaleDateString()}`,
          userId: 6, // o el ID real si tenés auth
          restTime: 60,
          image: "https://img.freepik.com/fotos-premium/atleta-esta-parado-sobre-sus-rodillas-cerca-barra-gimnasio-esta-preparando-hacer-peso-muerto_392761-1698.jpg?w=1060",
          exercises: ejerciciosFinales,
        };

        const resRutina = await fetch(`${backendURL}/routines/create-custom-routineAI`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rutinaData),
        });

        if (!resRutina.ok) throw new Error("Error al guardar la rutina");

        const rutinaCreada = await resRutina.json();
        setCreatedRoutine(rutinaCreada);
        setGeneratedText(`✅ Rutina creada con éxito:\n\n${parsedJSON.map((e) => `• ${e.sets}x${e.reps} ${e.name}`).join("\n")}`);
      } catch (err) {
        console.error("Error al generar la rutina:", err);
        setGeneratedText("❌ Ocurrió un error generando la rutina.");
      }
    };

    fetchAndGenerate();
  }, [props.prompt]);

  return (
    <View style={styles.response}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image source={require("@/assets/images/Fitzy.jpg")} style={styles.icon} />
          <Text style={{ fontWeight: "600" }}>Fitzy</Text>
        </View>
        <Text style={{ fontSize: 10, fontWeight: "600" }}>
          {date.getHours()}:{String(date.getMinutes()).padStart(2, "0")}
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
    borderRadius: 14,
  },
});

