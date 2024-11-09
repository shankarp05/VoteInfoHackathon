import { h } from "preact";
import { useState } from "preact/hooks";
import Chatbox from "../components/Chatbox.tsx";

export default function ChatboxIsland() {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = async (message: string) => {
    if (message.trim() === "") return;
    
    // Add the user's message to the chat history
    setMessages((prevMessages) => [...prevMessages, `User: ${message}`]);

    // Send the message to the Gemini API
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (data.reply) {
        // Add the API's reply to the chat history
        setMessages((prevMessages) => [...prevMessages, `Bot: ${data.reply}`]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <div class="chat-container">
        <Chatbox onSubmit={handleSubmit} />
        <div class="message-list">
          {messages.map((msg, index) => (
            <div key={index} class="message">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
