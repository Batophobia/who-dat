import { readFile } from "node:fs/promises";
import path from "node:path";
import { connectDatabase, getListCollection } from "./db.js";

const listPath = path.resolve("data/list.json");

function createSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

async function seed() {
  await connectDatabase();

  const contents = await readFile(listPath, "utf-8");
  const things = JSON.parse(contents) as { name: string; imageUrl: string; }[];

  const collection = getListCollection();

  for (const thing of things) {
    const slug = createSlug(thing.name);

    await collection.updateOne(
      { name: thing.name },
      {
        $set: {
          name: thing.name,
          slug,
          imageUrl: thing.imageUrl
        }
      },
      { upsert: true }
    );
  }

  console.log(`Updated DB.`);
  process.exit(0);
}

seed().catch(error => {
  console.error(error);
  process.exit(1);
});