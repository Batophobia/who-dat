import { getListCollection, ListItem } from "./db.js";

export type Thing = ListItem;

function normalizeName(name: string): string {
  return decodeURIComponent(name).replaceAll("_", " ").toLowerCase();
}

export async function getThing(name: string): Promise<Thing | undefined> {
  const things = await getThings();
  const normalizedName = normalizeName(name);

  return things.find(thing => normalizeName(thing.name) === normalizedName);
}

export async function getThings(): Promise<Thing[]> {
  return getListCollection().find().toArray();
}