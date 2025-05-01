import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import { backendURL } from '@/config';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: 'Hola, soy tu asistente de fitness. ¿En qué puedo ayudarte hoy?', sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Agregar mensaje del usuario
    setMessages([...messages, { text: inputMessage, sender: 'user' }]);
    setInputMessage('');

    // Aquí puedes realizar una llamada a la API de tu backend o un servicio de IA
    const response = await fetchFitnessResponse(inputMessage);

    // Agregar la respuesta del bot
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: response, sender: 'bot' },
    ]);
  };

  const fetchFitnessResponse = async (message) => {
    // Asegúrate de que esta URL sea la correcta para tu backend

    try {
      const response = await fetch(`${backendURL}/routines/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      return data.reply || "Lo siento, no pude entenderte. ¿Puedes reformular?";
    } catch (error) {
      console.error('Error en el chat:', error);
      return 'Hubo un error. Intenta nuevamente.';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View key={index} style={message.sender === 'bot' ? styles.botMessage : styles.userMessage}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  chatContainer: {
    flex: 1,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    maxWidth: '80%',
  },
  messageText: {
    color: '#333',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatBot;
