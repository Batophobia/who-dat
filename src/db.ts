import { MongoClient, Db, Collection } from "mongodb";

const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017";
const databaseName = process.env.MONGO_DATABASE ?? "who-dat";

export interface ListItem {
  name: string;
  imageUrl: string;
}

export interface User {
  name: string;
  correctGuesses: number;
}

export interface CurrentGame {
  thingId: string;
  startedAt: Date;
}

let client: MongoClient;
let db: Db;

export async function connectDatabase(): Promise<void> {
  client = new MongoClient(mongoUrl);
  await client.connect();

  db = client.db(databaseName);

  console.log(`Connected to MongoDB database "${databaseName}"`);
}

export function getListCollection(): Collection<ListItem> {
  return db.collection<ListItem>("List");
}

export function getUsersCollection(): Collection<User> {
  return db.collection<User>("Users");
}

export function getCurrentCollection(): Collection<CurrentGame> {
  return db.collection<CurrentGame>("Current");
}