// Chatbox.tsx
import { useState, useRef, useEffect } from "preact/hooks";

const MAX_CHAR_LIMIT = 4096;

export default function Chatbox({
  onSubmit,
  initialMessage = "", // New prop
}: { 
  onSubmit: (message: string) => void;
  initialMessage?: string; 
}) {
  const [message, setMessage] = useState(initialMessage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessage(initialMessage); // Update the message when initialMessage changes
  }, [initialMessage]);

  const handleInput = (e: Event) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    if (target.value.length <= MAX_CHAR_LIMIT) {
      setMessage(target.value);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
          rows={1}
        />
        <button 
          class="send-button"
          onClick={() => {
            onSubmit(message);
            setMessage("");
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
            }
          }}
        >
          Send
        </button>
      </div>
      <div class="character-counter">
        {message.length} / {MAX_CHAR_LIMIT}
      </div>
    </div>
  );
}
