// ButtonIsland.tsx
import { Button } from "../components/Button.tsx";

export default function ButtonIsland({ onClick }: { onClick: (text: string) => void }) {
  const buttonText1 = "What is Jake Ashby's stance on IVF?"; // The text to populate the chatbox with
  const buttonText2 = "What are Juan Ardila's views on landlord-tenant relations?"; // The text to populate the chatbox with
  const buttonText3 = "How has Simcha Felder worked to ease the financial burden on property owners in New York City?"; // The text to populate the chatbox with

  return (
  <div>
  
  <Button text={buttonText1} onClick={() => onClick(buttonText1)} />
      <Button text={buttonText2} onClick={() => onClick(buttonText2)} />
      <Button text={buttonText3} onClick={() => onClick(buttonText3)} />


      </div>
    
  );
}
