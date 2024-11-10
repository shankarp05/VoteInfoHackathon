import { FreshContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { parse } from "$std/path/parse.ts";
import { xml2js } from "https://deno.land/x/xml2js@1.0.0/mod.ts";



const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY") || "";
const NY_SENATE_API_KEY = Deno.env.get("NY_SENATE_API_KEY") || "";
const CONGRESS_API_KEY = Deno.env.get("CONGRESS_API_KEY") || "";

interface Member {
  name: {
    _text: string;
  };
  bioguideId: {
    _text: string;
  };
}

interface Members {
  member: Member | Member[];
}

interface ParsedData {
  members?: Members;
}

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


const getBioguideId = async (politicianName: string): Promise<string | null> => {
  try {
    const url = `https://api.congress.gov/v3/member/NY?api_key=${CONGRESS_API_KEY}`;
    const response = await fetch(url);
    const rawData = await response.text();
    
    // Log the raw response to see what we're getting
    // console.log('Raw API Response:', rawData);
    
    // Try parsing as JSON first since the API might return JSON
    try {
      const jsonData = JSON.parse(rawData);
      // console.log('Parsed as JSON:', jsonData);
      
      // If it's JSON, handle accordingly
      if (jsonData.members) {
        console.log("Found members in JSON");
        const members = jsonData.members
        


  // console.log("Gillibrand, Kirsten E.".toLowerCase().includes("kirsten gillibrand"))

        for (const member of members) {
          const newPol = politicianName.split(' ').reverse().join(' ').trim();
          const noComma = member.name.replaceAll(',', '').trim();



          if (noComma && noComma.toLowerCase().includes(newPol.toLowerCase())) {
            return member.bioguideId;
          }
        }
      }
    } catch (jsonError) {
      // If JSON parsing fails, try XML
      // console.log('Not JSON, trying XML parsing');
      const parsedData = xml2js(rawData, { compact: true });
      // console.log('Parsed XML Data:', parsedData);
      
      if (parsedData && typeof parsedData === 'object' && 'members' in parsedData) {
        // console.log("Found members object in XML");
        const members = parsedData.members;
        
        if (members && typeof members === 'object' && 'member' in members) {
          // console.log("yess - found member in XML");
          const memberList = Array.isArray(members.member) ? members.member : [members.member];
          
          for (const member of memberList) {
            const name = member?.name?._text || '';
            // console.log('Checking member name:', name);
            if (name.toLowerCase().includes(politicianName.toLowerCase())) {
              return member?.bioguideId?._text?.trim() || null;
            }
          }
        }
      }
    }
    
    console.log('No matching member found');
    return null;

  } catch (error) {
    console.error('Error in getBioguideId:', error);
    return null;
  }
};


const getCongressBillsData = async (bioguideId: string) => {
  const url = `https://api.congress.gov/v3/member/${bioguideId}/sponsored-legislation?api_key=${CONGRESS_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  let allBillsString = "";
  if (data && data.sponsoredLegislation) {
    // Concatenate each bill's title and summary to a single string
    allBillsString = data.sponsoredLegislation
      .map((bill: any) => {
        const title = bill.title || "No title available";
        const summary = bill.latestAction?.text || "No summary available";
        return `Title: ${title}, Summary: ${summary}`;
      })
      .join("; "); // Each bill's title and summary is separated by a semicolon
  }

  console.log(allBillsString)

  return allBillsString;
};


export const handler: Handlers = {
  async POST(req: Request, _ctx: FreshContext): Promise<Response> {
    try {
      // Parse the incoming request to get the user's message
      const { message } = await req.json();
      let promptEngineering = "Extract the New York politican's First and Last name from the following message.  Try to account for user typos, nicknames, and middle names.  If the name you have is a nickname, return their legal name (for example: schumer->chuck schumer->charles schumer). We just need the first and last name seperated by a space: \' " + message;
      promptEngineering = promptEngineering + ' \'';

      // Pass the message to the answerQuestion function
      const answer = await answerQuestion(promptEngineering);
      const JSONResponse = JSON.parse(answer);

      // Extract the AI's response text from the JSON
      const politicianName = JSONResponse.candidates[0].content.parts[0].text;
      console.log("Parsed politician name:", politicianName);


      let bills = await getBillsData(politicianName);

      
  

      if (!bills || bills.length === 0) {
        console.log("yessbefore")
        const bioguideID = await getBioguideId(politicianName);
        
        if (bioguideID) {
          bills = await getCongressBillsData(bioguideID);
        }
      }
      
      const combinedResponse = `
      Politician: ${politicianName}
      
      Bills and Policies:
      ${bills}
      
      You are now a policy expert. Based on the bills listed above, answer any question related to the politician’s positions, actions, or policies. You can provide summaries or explanations related to the bills or the politician’s overall political stance. Be sure to use the bill titles and summaries to inform your answers.
      
      Example questions:
      - What is the politician’s stance on [policy issue]?
      - What bills has the politician supported regarding [specific policy]?
      - Can you summarize the politician’s recent legislative actions?
      - Remove any stray symbols or unnecessary characters from the response.
      - Use complete sentences and clear formatting for easy reading.
      - Avoid using unnecessary symbols like * or -.
      - no bullet points, should be a paragraph or multiple sentences
      - no bold or italics either

      Answer the following question based on the provided bills:
      
      Question: ${message}  // User's query
      `;
      
      
      const finalAnswer = await answerQuestion(combinedResponse);
      console.log(finalAnswer)
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
