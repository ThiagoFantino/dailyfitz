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

        // 1. Obtener ejercicios disponibles
        const ejerciciosRes = await fetch(`${backendURL}/routines/exercises`);
        const ejercicios = await ejerciciosRes.json();
        const listaEjercicios = ejercicios.map((e) => `• ${e.name}`).join("\n");

        // 2. Crear prompt para Gemini
        const promptIA = `
Mensaje del usuario: "${promptUsuario}".

Si corresponde crear una rutina, devolvé un JSON así:
{
  "tipo": "rutina",
  "nombre": "Nombre de la rutina",
  "descanso": 60,
  "ejercicios": [
    { "name": "Nombre del ejercicio", "sets": 3, "reps": 12 },
    ...
  ]
}

Solo usá ejercicios de esta lista:
${listaEjercicios}

Si es solo una pregunta u otro tipo de mensaje, devolvé:
{
  "tipo": "respuesta",
  "respuesta": "Texto con la respuesta del asistente"
}

No devuelvas explicaciones fuera del JSON.
`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(promptIA);
        const rawText = await result.response.text();

        const cleanText = rawText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanText);

        if (parsed.tipo === "rutina") {
          // Buscar IDs de ejercicios por nombre
          const ejerciciosFinales = parsed.ejercicios.map((ej) => {
            const match = ejercicios.find((e) => e.name.toLowerCase() === ej.name.toLowerCase());
            if (!match) throw new Error(`Ejercicio no encontrado: ${ej.name}`);
            return { id: match.id, sets: ej.sets, reps: ej.reps };
          });

          const rutinaData = {
            name: parsed.nombre,
            userId: 6, // si tenés auth, reemplazalo
            restTime: parsed.descanso,
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
          setGeneratedText(`✅ Rutina creada con éxito:\n\n${parsed.ejercicios.map((e) => `• ${e.sets}x${e.reps} ${e.name}`).join("\n")}`);
        } else if (parsed.tipo === "respuesta") {
          setGeneratedText(parsed.respuesta);
        } else {
          setGeneratedText("❌ No entendí la respuesta de la IA.");
        }
      } catch (err) {
        console.error("Error al generar respuesta:", err);
        setGeneratedText("❌ Ocurrió un error generando la respuesta.");
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


