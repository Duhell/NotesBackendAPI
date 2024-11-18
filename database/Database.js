// database/MongoDatabase.js
import { MongoClient, ServerApiVersion } from "mongodb";
import Log from "../utils/log/Log.js";

export default class MongoDatabase {
  #database;
  #isConnected = false;

  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 50,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
    });
    this.#database = null;
  }

  async getDatabase() {
    if (!this.#isConnected) {
      try {
        await this.client.connect();
        this.#isConnected = true;
        this.#database = this.client.db(process.env.DATABASE_NAME);
      } catch (error) {
        Log.error(error, "getDatabase", "Failed to connect to MongoDB.");
        throw error;
      }
    }
    return this.#database;
  }

  async disconnect() {
    if (this.#isConnected) {
      try {
        await this.client.close();
        this.#isConnected = false;
      } catch (error) {
        Log.error(error, "disconnect", "Failed to disconnect from MongoDB.");
        throw error;
      }
    }
  }
}