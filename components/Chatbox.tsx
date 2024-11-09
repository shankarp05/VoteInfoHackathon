import { h } from "preact";
import { useState } from "preact/hooks";

export default function Chatbox({ onSubmit }: { onSubmit: (message: string) => void }) {
  const [message, setMessage] = useState("");

  return (
    <div class="chatbox">
      <div class="chat-messages">
        {/* Message list will go here in the Island */}
      </div>
      <div class="chat-input">
        <input
          type="text"
          class="input-field"
          placeholder="Type your message..."
          value={message}
          onInput={(e) => setMessage(e.currentTarget.value)}
        />
        <button
          class="send-button"
          onClick={() => {
            onSubmit(message);
            setMessage("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
