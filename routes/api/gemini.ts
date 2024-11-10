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
  let allBillsString = "";
  let offsetStart = 1;
  const limit = 25; // Default limit per request
  const total = await getTotalBillsCount(politicianName); // Get total results count
  
  while (offsetStart <= total) {
    const url = `https://legislation.nysenate.gov/api/3/bills/search?term=sponsor.member.fullName:"${encodeURIComponent(politicianName)}"&sort=status.actionDate:DESC&offset=${offsetStart}&limit=${limit}&key=${NY_SENATE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.success && data.result && data.result.items) {
      // Create a concatenated string of bill titles and summaries
      const billsString = data.result.items
        .map((item: any) => {
          const title = item.result.title || "No title available";
          const summary = item.result.summary || "No summary available";
          return `Title: ${title}, Summary: ${summary}`;
        })
        .join("; ");
      
      // Append the bills to the overall bills string
      allBillsString += billsString;
    }

    // Move to the next page
    offsetStart += limit;
  }

  return allBillsString;
};

const getTotalBillsCount = async (politicianName: string) => {
  const url = `https://legislation.nysenate.gov/api/3/bills/search?term=sponsor.member.fullName:"${encodeURIComponent(politicianName)}"&sort=status.actionDate:DESC&key=${NY_SENATE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.total; // Total count of results
};



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
      
      const combinedResponse = `
      Politician: ${politicianName}
      
      Bills and Policies:
      ${bills}
      
      You are now a policy expert. Based on the bills listed above, answer any question related to the politician’s positions, actions, or policies. You can provide summaries or explanations related to the bills or the politician’s overall political stance. Be sure to use the bill titles and summaries to inform your answers.
      
      Example questions:
      - What is the politician’s stance on [policy issue]?
      - What bills has the politician supported regarding [specific policy]?
      - Can you summarize the politician’s recent legislative actions?
      
      Remove weird * symbols from the input or - symbols from the input in the final answer to format it properly. Answer the following question based on the provided bills:
      
      Question: ${message}  // User's query
      `;
      
      
      const finalAnswer = await answerQuestion(combinedResponse);
      const JSONFinalResponse = JSON.parse(finalAnswer);

      const finalText = JSONFinalResponse.candidates[0].content.parts[0].text;


      // Return the AI's response text as JSON
      return new Response(JSON.stringify({ reply: finalText }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Handler error:", error);
      return new Response("Error generating response", { status: 500 });
    }
  }
};
