import { readFile } from "node:fs/promises";
import path from "node:path";

export interface Thing {
  name: string;
  imageUrl: string;
}

const listPath = path.resolve("data/list.json");

function normalizeName(name: string): string {
  return decodeURIComponent(name).replace("_", " ").toLowerCase();
}

export async function getThing(name: string): Promise<Thing | undefined> {
  const things = await getThings();
  const normalizedName = normalizeName(name);

  return things.find(
    thing => normalizeName(thing.name) === normalizedName
  );
}

export async function getThings(): Promise<Thing[]> {
  const contents = await readFile(listPath, "utf-8");
  return JSON.parse(contents) as Thing[];
}

// export async function getThing(name: string): Promise<Thing | undefined> {
//   const things = await getThings();

//   return things.find(
//     thing => thing.name.toLowerCase() === name.toLowerCase()
//   );
// }