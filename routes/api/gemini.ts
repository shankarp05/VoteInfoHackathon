import { FreshContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";

const GOOGLE_API_KEY = "AIzaSyBrTCrL_Z7Vgd9S-kYgOCJats_bXce3tNM"; // Ensure your API key is correctly loaded

// Modified function to take in user input as an argument
const answerQuestion = async (userInput: string) => {
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{"parts":[{"text": userInput}]}], // User input is now dynamically included
    }),
  });
  return resp.text();
}

export const handler: Handlers = {
  async POST(req: Request, _ctx: FreshContext): Promise<Response> {
    try {
      // Parse the incoming request to get the user's message
      const { message } = await req.json();
      let promptEngineering = "Extract the New York politican's First and Last name from the following message.  Try to account for user typos, nicknames, and middle names.  We just need the first and last name seperated by a space: \' " + message;
      promptEngineering = promptEngineering + ' \'';

      // Pass the message to the answerQuestion function
      const answer = await answerQuestion(promptEngineering);
      const JSONResponse = JSON.parse(answer);

      // Extract the AI's response text from the JSON
      const text = JSONResponse.candidates[0].content.parts[0].text;

      // Return the AI's response text as JSON
      return new Response(JSON.stringify({ reply: text }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Handler error:", error);
      return new Response("Error generating response", { status: 500 });
    }
  }
};
