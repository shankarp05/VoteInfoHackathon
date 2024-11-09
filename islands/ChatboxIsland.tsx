// ChatboxIsland.tsx
import { useState } from "preact/hooks";
import Chatbox from "../components/Chatbox.tsx";
import StartingPrompts from "../islands/StartingPrompts.tsx";

export default function ChatboxIsland() {
  const [messages, setMessages] = useState<string[]>([]);
  const [chatboxMessage, setChatboxMessage] = useState("");

  const handleSubmit = async (message: string) => {
    if (message.trim() === "") return;
    
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
        setMessages((prevMessages) => [...prevMessages, `Bot: ${data.reply}`]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // This function is called when the button is clicked
  const onButtonClick = (text: string) => {
    setChatboxMessage(text); // Set chatbox message to button's label text
  };

  return (
    <div>
      <div style="position: relative; top: -100px;">
        <StartingPrompts onClick={onButtonClick} />
      </div>
        <div class="chat-container">
            <Chatbox onSubmit={handleSubmit} initialMessage={chatboxMessage} />
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
