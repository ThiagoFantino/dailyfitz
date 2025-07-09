import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { GoogleAPIKey, backendURL } from "@/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";

const date = new Date();
const genAI = new GoogleGenerativeAI(GoogleAPIKey);

export default function Response({ prompt, userId }) {
  const [generatedText, setGeneratedText] = useState("");
  const [createdRoutine, setCreatedRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(".");
  const [chatReady, setChatReady] = useState(false);
  const chatRef = useRef(null);
  const ejerciciosRef = useRef([]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const ejerciciosRes = await fetch(`${backendURL}/routines/exercises`);
        const ejercicios = await ejerciciosRes.json();
        ejerciciosRef.current = ejercicios;
        const listaEjercicios = ejercicios.map((e) => `• ${e.name}`).join("\n");

        const routinesResponse = await fetch(`${backendURL}/users/${userId}/routinesByDate`);
        const routinesJson = await routinesResponse.json();
        const historialDeRutinas = Object.entries(routinesJson).map(
          ([fecha, rutinas]) => ` ${fecha}:\n${rutinas.map(r => `   🔹 ${r}`).join("\n")}`
        ).join("\n\n");

        const rutinasRes = await fetch(`${backendURL}/routines?userId=${userId}`);
        const rutinas = await rutinasRes.json();
        const listaRutinas = rutinas.map((r) => {
          const ejercicios = r.exercises.map((e) => e.exercise.name).join(" , ");
          return ` La rutina ${r.name} tiene ${ejercicios}`;
        }).join("\n\n---------------------------\n\n");

        const fechaDeHoy = new Date().toISOString().slice(0, 10);

const contextPrompt = `
Sos Fitzy, el asistente de fitness personal del usuario. Solo respondés preguntas relacionadas con fitness, entrenamiento físico, o preguntas básicas sobre vos, como tu nombre o la fecha actual.

Si el usuario pregunta cómo funcionás o qué podes hacer, respondé con un resumen claro y amigable de tus capacidades y límites, incluyendo que:
- Podés crear rutinas personalizadas.
- Podés recomendar rutinas predefinidas.
- Podés informar qué rutinas hizo el usuario en determinada fecha con los ejercicios que contiene.
- No respondés preguntas fuera de fitness, salvo preguntas simples sobre vos o la fecha.
- Si la pregunta está fuera de esos temas, respondés amablemente que solo podés ayudar con fitness.

Si el usuario hace una pregunta fuera del contexto de fitness o fuera de esas preguntas simples, como historia, matemáticas, noticias u otras temáticas generales, respondé con:
{
  "tipo": "respuesta",
  "respuesta": "Lo siento, solo puedo responder preguntas relacionadas con fitness y entrenamiento físico."
}

Podés hacer tres cosas:

1. Si el usuario pide una rutina personalizada, creá una rutina desde cero usando los ejercicios disponibles.
2. Solo recomendá una rutina predefinida si el usuario **pide una recomendación** o **no dice que quiere algo personalizado**.
3. Si el usuario pregunta **qué rutinas hizo en una fecha o período**, buscá en el historial de rutinas realizadas (historialDeRutinas) y devolvé el detalle completo: nombre de la rutina y lista de ejercicios que contiene (no solo el nombre), mostrando claramente sets y repeticiones si está disponible. Si no hay registro en la fecha consultada, decilo claramente.

📌 Si el usuario usa frases como “creame una rutina”, “quiero una rutina para mí”, “una rutina personalizada” o similares, asumí que quiere una rutina personalizada, aunque exista una predefinida parecida.

⚠️ Muy importante: devolvé estrictamente uno de estos formatos:

🆕 Si vas a CREAR una rutina personalizada:
{
  "tipo": "rutina",
  "nombre": "Nombre de la rutina",
  "descanso": 60,
  "ejercicios": [
    { "name": "Nombre del ejercicio", "sets": 3, "reps": 12 }
  ]
}

📦 Si vas a RECOMENDAR una rutina predefinida:
{
  "tipo": "recomendacion",
  "rutina": "Nombre exacto de la rutina predefinida",
  "razon": "Explicación de por qué la recomendás"
}

💬 Si el usuario pregunta sobre rutinas realizadas en una fecha:
{
  "tipo": "rutinas_por_fecha",
  "respuesta": "Texto explicando las rutinas realizadas ese día, con los ejercicios que contienen y detalles como series y repeticiones."
}

💬 Pregunta o comentario general (incluyendo preguntas simples sobre Fitzy, la fecha o tu funcionamiento):
{
  "tipo": "respuesta",
  "respuesta": "Texto con la respuesta del asistente"
}

📋 Lista de ejercicios disponibles:
${listaEjercicios}

📚 Lista de rutinas predefinidas:
${listaRutinas}

🗓️ Historial de rutinas realizadas por el usuario:
${historialDeRutinas}
📅 Fecha actual (hoy): ${fechaDeHoy}
`;


        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
          history: [{ role: "user", parts: [{ text: contextPrompt }] }],
          generationConfig: { maxOutputTokens: 300 },
        });
        chatRef.current = chat;
        setChatReady(true);
      } catch (err) {
        console.error("Error al inicializar contexto de IA:", err);
      }
    };
    initChat();
  }, [userId]);

  useEffect(() => {
    const fetchAndGenerate = async () => {
      if (!prompt || !chatReady || !chatRef.current) {
        console.log("⛔ chatRef no listo o no hay prompt:", { prompt, chatReady });
        return;
      }
      setLoading(true);
      try {
        const result = await chatRef.current.sendMessage(prompt);
        if (!result || !result.response) throw new Error("❌ No hay respuesta del modelo");

        const rawText = await result.response.text();
        const cleanText = rawText.replace(/```json|```/g, "").trim();

        let parsed = null;
        try {
          parsed = JSON.parse(cleanText);
        } catch (e) {
          setGeneratedText("❌ Error al interpretar la respuesta de la IA.");
          return;
        }

        const ejercicios = ejerciciosRef.current;

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
        } else if (["respuesta", "rutinas_por_fecha"].includes(parsed.tipo)) {
          setGeneratedText(parsed.respuesta);
        } else {
          setGeneratedText("❌ No entendí la respuesta de la IA.");
        }

      } catch (err) {
        console.error("❌ Error general:", err);
        setGeneratedText("❌ Ocurrió un error generando la respuesta.");
      } finally {
        setLoading(false);
      }
    };
    fetchAndGenerate();
  }, [prompt, chatReady]);

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
