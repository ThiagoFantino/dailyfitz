import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { GoogleAPIKey, backendURL } from "@/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";

const date = new Date();
const genAI = new GoogleGenerativeAI(GoogleAPIKey);

export default function Response({ prompt, userId }) {
  const [generatedText, setGeneratedText] = useState("");
  const [createdRoutine, setCreatedRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const fetchAndGenerate = async () => {
      setLoading(true);
      try {
        // 1. Obtener ejercicios disponibles
        const ejerciciosRes = await fetch(`${backendURL}/routines/exercises`);
        const ejercicios = await ejerciciosRes.json();
        const listaEjercicios = ejercicios.map((e) => `• ${e.name}`).join("\n");

        // Rutinas por fecha
        const routinesResponse = await fetch(`${backendURL}/users/${userId}/routinesByDate`);
        const routinesJson = await routinesResponse.json();
        const historialDeRutinas = Object.entries(routinesJson).map(
  ([fecha, rutinas]) => ` ${fecha}:\n${rutinas.map(r => `   🔹 ${r}`).join("\n")}`
).join("\n\n");
        console.log("Historial de rutinas:", historialDeRutinas);

        // 2. Obtener rutinas predefinidas
        const rutinasRes = await fetch(`${backendURL}/routines?userId=${userId}`);
        const rutinas = await rutinasRes.json();
 const listaRutinas = rutinas.map((r) => {
  const ejercicios = r.exercises.map((e) => {
    return `${e.exercise.name}`;
  }).join(" , ");

  return ` La rutina ${r.name} tiene ${ejercicios}`;
}).join("\n\n---------------------------\n\n");

console.log(listaRutinas);

       const promptIA = `
Sos Fitzy, el asistente de fitness personal del usuario. Podés hacer tres cosas:

1. Si el usuario pide una rutina personalizada, creá una rutina desde cero usando los ejercicios disponibles.
2. Solo recomendá una rutina predefinida si el usuario **pide una recomendación** o **no dice que quiere algo personalizado**.
3. Si el usuario pregunta **qué rutinas hizo en una fecha o período**, buscá en el historial de rutinas realizadas (historialDeRutinas) y devolvé el detalle completo: nombre de la rutina y lista de ejercicios. Si no hay registro en la fecha consultada, decilo claramente.

📌 Si el usuario usa frases como “creame una rutina”, “quiero una rutina para mí”, “una rutina personalizada” o similares, asumí que quiere una rutina personalizada, aunque exista una predefinida parecida.

El mensaje del usuario fue: "${prompt}"

⚠️ Muy importante: devolvé estrictamente uno de estos formatos:

🆕 Si vas a CREAR una rutina personalizada:
{
  "tipo": "rutina",
  "nombre": "Nombre de la rutina",
  "descanso": 60,
  "ejercicios": [
    { "name": "Nombre del ejercicio", "sets": 3, "reps": 12 },
    ...
  ]
}

📦 Si vas a RECOMENDAR una rutina predefinida:
{
  "tipo": "recomendacion",
  "rutina": "Nombre exacto de la rutina predefinida",
  "razon": "Explicación de por qué la recomendás"
}

💬 Si es una pregunta o comentario general (por ejemplo, sobre rutinas hechas en una fecha específica):
{
  "tipo": "respuesta",
  "respuesta": "Texto explicando las rutinas realizadas ese día, incluyendo sus ejercicios. Si no hay registro, indicarlo."
}

📋 Lista de ejercicios disponibles:
${listaEjercicios}

📚 Lista de rutinas predefinidas:
${listaRutinas}

🗓️ Historial de rutinas realizadas por el usuario:
${historialDeRutinas}

No devuelvas nada fuera del JSON.
`;


        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: promptIA }] }],
  generationConfig: {
    maxOutputTokens: 300, 
  }
});
        const rawText = await result.response.text();
        const cleanText = rawText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanText);

        if (parsed.tipo === "rutina") {
          const ejerciciosFinales = parsed.ejercicios.map((ej) => {
            const match = ejercicios.find((e) => e.name.toLowerCase() === ej.name.toLowerCase());
            if (!match) throw new Error(`Ejercicio no encontrado: ${ej.name}`);
            return { id: match.id, sets: ej.sets, reps: ej.reps };
          });

          const rutinaData = {
            name: parsed.nombre,
            userId: userId,
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
          setGeneratedText(`✅ Rutina personalizada creada: **${parsed.nombre}**\n⏱️ Descanso entre series: ${parsed.descanso} segundos\n\n${[...parsed.ejercicios].reverse().map((e) => `• ${e.sets} series de ${e.reps} repeticiones de ${e.name}`).join("\n")}`);
        } else if (parsed.tipo === "recomendacion") {
          setGeneratedText(`📦 Recomendación: Te sugiero la rutina **${parsed.rutina}**.\n\n${parsed.razon}`);
        } else if (parsed.tipo === "respuesta") {
          setGeneratedText(parsed.respuesta);
        } else {
          setGeneratedText("❌ No entendí la respuesta de la IA.");
        }
      } catch (err) {
        console.error("Error al generar respuesta:", err);
        setGeneratedText("❌ Ocurrió un error generando la respuesta.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerate();
  }, [prompt, userId]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

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
      <Markdown>{loading ? `Pensando${dots}` : generatedText}</Markdown>
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


