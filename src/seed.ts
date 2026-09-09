import { readFile } from "node:fs/promises";
import path from "node:path";
import { connectDatabase, getListCollection } from "./db.js";

const listPath = path.resolve("data/list.json");

async function seed() {
  await connectDatabase();

  const contents = await readFile(listPath, "utf-8");
  const things = JSON.parse(contents);

  const collection = getListCollection();

  const result = await collection.insertMany(things);

  console.log(`Inserted ${result.insertedCount} things.`);
}

seed().catch(error => {
  console.error(error);
  process.exit(1);
});