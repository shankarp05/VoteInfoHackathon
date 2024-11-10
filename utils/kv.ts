/// <reference lib="deno.unstable" />

const kv = await Deno.openKv();


export async function getEntries(sources: string[]){
    const entries = [];
    for (const source of sources) {
        for await (const entry of kv.list({ prefix: [source] })) {
            entries.push(entry);
        }
    }
    return entries;
  
}