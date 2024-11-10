import { FreshContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";

const OPEN_STATES_API_KEY='1aec2c4d-b5d8-4068-8697-db3ab64d0b16'

export interface Representative {
    name:string;
    party: string;
    title: string;
    district: string;
    jurisdiction: string;
    image: string;
    email: string;
  }

let repList: Representative[] = [];

const findRepresentatives = async (lat: number, lng:number) => {
    const resp = await fetch(`https://v3.openstates.org/people.geo?lat=${lat}&lng=${lng}&apikey=${OPEN_STATES_API_KEY}`, {
        method: "GET",
        headers: {
          "accept": "application/json",
        },
    });
    if (!resp.ok) {
        console.error(`Error: ${resp.status} ${resp.statusText}`);
        return;
    } else {
        return resp.json();
    }
}

const saveNewYorkRepresentatives = async(data: any)=>{

  // Loop through each person in the results array
  for (const person of data.results) {
    // Check if the jurisdiction's name is "New York"
    if (person.jurisdiction.name === "New York") {
      // Use the person's name as a key and save their data to Deno KV
      const rep: Representative = {
        name: person.name,
        party: person.party,
        title: person.current_role.title,
        district: person.current_role.district,
        jurisdiction: person.jurisdiction.name,
        image: person.image,
        email: person.email,
      };
  
      // Check if the representative already exists in repList
      const alreadyExists = repList.some(
        (existingRep) =>
          existingRep.name === rep.name && existingRep.district === rep.district
      );
  
      // Add to repList only if they are not already in it
      if (!alreadyExists) {
        repList.push(rep);
      }
    }
  }

  console.log("Finished processing New York representatives.");
  return repList;

}


export const handler: Handlers = {
    async POST(req: Request, ctx: FreshContext) {
        try {
            const { lat, lng } = await req.json();
            const representative = await findRepresentatives(lat, lng);
            const reps = await saveNewYorkRepresentatives(representative);

            // Return the representative data as a JSON response
            return new Response(JSON.stringify({reps}), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error in handler:", error);
            return new Response(JSON.stringify({ error: "An error occurred" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    },
};
