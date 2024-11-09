// ButtonIsland.tsx
import { Button } from "../components/Button.tsx";

export default function ButtonIsland({ onClick }: { onClick: (text: string) => void }) {
  const buttonText = "What are Jacob Ashby's Views on Climate Change"; // The text to populate the chatbox with

  return (
    <Button
      text={buttonText}
      onClick={() => onClick(buttonText)}
    />
  );
}
