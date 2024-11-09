import { useState, useRef } from "preact/hooks";

const MAX_CHAR_LIMIT = 4096;

export default function Chatbox({ onSubmit }: { onSubmit: (message: string) => void }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: Event) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    // Ensure character limit is not exceeded
    if (target.value.length <= MAX_CHAR_LIMIT) {
      setMessage(target.value);
    }

    // Auto-resize textarea based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  };

  return (
    <div class="chatbox">
      <div class="chat-messages"></div>
      <div class="chat-input">
        <textarea
          ref={textareaRef}
          class="input-field"
          placeholder="Type your message here..."
          value={message}
          onInput={handleInput}
          rows={1} // Minimum rows, will expand based on content
        />
        <button 
          class="send-button"
          onClick={() => {
            onSubmit(message);
            setMessage("");
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto"; // Reset height after sending message
            }
          }}
        >
          Send
        </button>
      </div>
      {/* Character counter placed outside the input area */}
      <div class="character-counter">
        {message.length} / {MAX_CHAR_LIMIT}
      </div>
    </div>
  );
}
