import { FreshContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";

const GOOGLE_API_KEY = "AIzaSyBrTCrL_Z7Vgd9S-kYgOCJats_bXce3tNM"; // Ensure your API key is correctly loaded
const NY_SENATE_API_KEY = "y5XK9WxIBC3OciBwKHOFb62EUxPvoHAJ";

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


const getBillsData = async (politicianName: string) => {
  try {
    const encodedName = encodeURIComponent(politicianName);
    const url = `https://legislation.nysenate.gov/api/3/bills/search?term=sponsor.member.fullName:"${encodedName}"&sort=status.actionDate:DESC&key=${NY_SENATE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.result || !data.result.items) {
      return "";
    }

    // Create concatenated string of titles and summaries
    const billsString = data.result.items
      .map((item: any) => {
        const title = item.result.title || "No title available";
        const summary = item.result.summary || "No summary available";
        return `Title: ${title}, Summary: ${summary}`;
      })
      .join("; ");

    return billsString;
  } catch (error) {
    console.error("Error fetching bills:", error);
    return "";
  }
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
      const politicianName = JSONResponse.candidates[0].content.parts[0].text;

      const bills = await getBillsData(politicianName);
      
      // Return the AI's response text as JSON
      return new Response(JSON.stringify({ reply: politicianName }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Handler error:", error);
      return new Response("Error generating response", { status: 500 });
    }
  }
};
