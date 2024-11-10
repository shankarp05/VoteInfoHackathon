import { useState } from "preact/hooks";
import Chatbox from "../components/Chatbox.tsx";
import StartingPrompts from "../islands/StartingPrompts.tsx";

export default function ChatboxIsland() {
  const [messages, setMessages] = useState<string[]>([]);
  const [chatboxMessage, setChatboxMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (message: string) => {
    if (message.trim() === "") return;

    setMessages((prevMessages) => [...prevMessages, `User: ${message}`]);
    setLoading(true); // Start loading

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
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const onButtonClick = (text: string) => {
    setChatboxMessage(text);
  };

  return (
    <div>
      <div class="pb-8">
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
        {loading && (
          <div class="loading-gif">
            {/* Replace the src with the path to your GIF */}
            <img src="/load.gif" alt="Loading..." />
          </div>
        )}
      </div>
    </div>
  );
}
