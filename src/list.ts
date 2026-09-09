import { getListCollection, ListItem } from "./db.js";

export type Thing = ListItem;

export async function getThing(slug: string): Promise<Thing | null> {
  return getListCollection().findOne({
    slug: slug.toLowerCase()
  });
}

export async function getThings(): Promise<Thing[]> {
  return getListCollection().find().toArray();
}