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
        // Primero, detectamos si el prompt tiene una instrucción para crear una rutina
        const prompt = props.prompt.toLowerCase();
        let isCreatingRoutine = false;
        let promptText = prompt;

        // Si el prompt contiene una indicación para crear rutina (ejemplo: "1 serie de 20 saltos de tijera")
        if (prompt.includes("serie") && prompt.includes("saltos de tijera")) {
          isCreatingRoutine = true;
          const exerciseDetails = prompt.match(/(\d+)\s*serie[s]?\s*de\s*(\d+)\s*(.*)/i);
          if (exerciseDetails) {
            const sets = parseInt(exerciseDetails[1], 10); // Número de series
            const reps = parseInt(exerciseDetails[2], 10); // Número de repeticiones
            const exerciseName = exerciseDetails[3].trim().toLowerCase(); // Nombre del ejercicio

            // Crear la rutina personalizada en la base de datos
            const routineData = {
              name: "Rutina personalizada de saltos de tijera",
              userId: 6, // Asegúrate de pasar el userId adecuado
              prompt: prompt, // El prompt completo
              restTime: 60, // Tiempo de descanso entre series (puede personalizarse)
            };

            const response = await fetch(`${backendURL}/routines/create-custom-routineAI`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(routineData),
            });

            if (response.ok) {
              const data = await response.json();
              setCreatedRoutine(data); // Guardar la rutina creada
              setGeneratedText(`Rutina creada con éxito: ${data.name}`);
            } else {
              setGeneratedText("Hubo un problema al crear la rutina.");
            }
          }
        }

        if (!isCreatingRoutine) {
          // Detectar la zona en el prompt (por ejemplo, "piernas", "brazos", etc.)
          let zona = "";
          if (prompt.includes("brazo")) zona = "brazos";
          else if (prompt.includes("pierna")) zona = "piernas";
          else if (prompt.includes("espalda")) zona = "espalda";
          // Agregar más zonas si es necesario

          let rutinaData = [];
          if (zona) {
            const response = await fetch(`${backendURL}/routines?zona=${zona}`);
            rutinaData = await response.json();
          }

          const textoBase = zona && rutinaData.length > 0
            ? `Estas son las rutinas disponibles para ${zona}: ${rutinaData.map((r) => `• ${r.name}`).join("\n")}. Recomendá una.`
            : prompt;

          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          const result = await model.generateContent(textoBase);
          const responseAI = await result.response;
          const text = await responseAI.text();
          setGeneratedText(text);
        }
      } catch (error) {
        console.error("Error al generar respuesta:", error);
        setGeneratedText("Hubo un problema al obtener la respuesta.");
      }
    };

    fetchAndGenerate();
  }, [props.prompt]); // Dependencia para cuando cambie el prompt

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

