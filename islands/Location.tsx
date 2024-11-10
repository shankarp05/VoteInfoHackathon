import { useState, useEffect } from "preact/hooks";
import { Representative } from "../routes/api/civicsAPI.ts";

export default function LocationButton() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setLocation({ lat, lng });
          setErrorMessage(null);

          // Send the location to the API endpoint
          try {
            const res = await fetch("/api/civicsAPI", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lat, lng }),
            });

            if (res.ok) {
              const result = await res.json();
              console.log(result);
              if (result) {
                setRepresentatives(result.reps); // Extract reps array
              }
            } else {
              setErrorMessage("Failed to load representative data.");
              console.error("Error occurred while fetching representative");
            }
          } catch (e) {
            setErrorMessage("Representative lookup unsuccessful.");
            console.error("An error occurred while fetching the representative.");
          }
        },
        () => {
          setErrorMessage("Location access denied or unavailable");
          console.error("Location access denied or unavailable");
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div class="text-center">
      <button onClick={getLocation} class="bg-blue-500 text-white p-2 rounded mb-4">
        Get Location
      </button>

      {errorMessage && <p class="text-red-500">{errorMessage}</p>}

      {representatives.length > 0 && (
        <div class="mt-4 grid gap-4">
          {representatives.map((rep) => (
            <div key={rep.name} class="p-4 border rounded shadow-md flex justify-between items-center">
              <div>
                <h2 class="text-xl font-bold mb-2">{rep.title} {rep.name}</h2>
                <p class="text-sm text-gray-600 mb-2">{rep.party}</p>
                <p class="text-sm"><strong>District:</strong> {rep.district}</p>
                <p class="text-sm"><strong>Jurisdiction:</strong> {rep.jurisdiction}</p>
                <p class="text-sm"><strong>Email:</strong> <a href={`mailto:${rep.email}`} class="text-blue-500 underline">{rep.email}</a></p>
              </div>

              {/* Conditionally render the image only if it exists */}
              {rep.image && (
                <img 
                  src={rep.image} 
                  alt={`Image of ${rep.name}`} 
                  class="w-32 h-32 object-cover rounded ml-4"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} // Hide image if it fails to load
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
