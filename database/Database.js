import { MongoClient, ServerApiVersion } from "mongodb";
import Log from "../log/Log.js";

export default class MongoDatabase {
  #database;
  #databaseName;
  #collectionName;
  #isConnected = false;

  constructor(connectionString, databaseName = null) {
    this.client = new MongoClient(connectionString, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 50,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
    });
    this.#databaseName = databaseName;
  }

  async createCollection(collectionName, schema = {}) {
    if (!this.#database) {
      await this.connect();
    }

    try {
      const collections = await this.#database.listCollections({name: collectionName}).toArray();

      if(collections.length > 0){
        console.log("Collection already exists");
        return 
      }

      const result = await this.#database.createCollection(collectionName,schema);

      console.log(`Successfully created ${collectionName} collection.`);
      return result;
    } catch (error) {
      Log.error(error, "createCollection");
    } finally {
      this.disconnect();
    }
  }

  async useCollection(collection) {
    this.#collectionName = collection;
  }

  async connect() {
    if (this.#isConnected) return this.#database;

    try {
      console.log("Trying to connect to MongoDB.");
      await this.client.connect();
      this.#isConnected = true;
      console.log("Connected to the MongoDB.");
      return (this.#database = this.client.db(this.#databaseName));
    } catch (error) {
      return Log.error(error, "connect", "Failed to connect to MongoDB.");
    }
  }

  async disconnect() {
    if (!this.#isConnected) return;

    try {
      await this.client.close();
      this.#isConnected = false;
      console.log("Disconnected from MongoDB.");
    } catch (error) {
      return Log.error(error, "disconnect", "Failed to disconnect to MongoDB.");
    }
  }

  async getCollection() {
    if (!this.#database) {
      await this.connect();
    }
    return this.#database.collection(this.#collectionName);
  }

  async all(query = {}, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.find(query, options).toArray();
    } catch (error) {
      return Log.error(error, "all", "Failed to fetch all data.");
    }
  }

  async findOne(query = {}, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.findOne(query, options);
    } catch (error) {
      return Log.error(error, "findOne", "Failed to fetch one data.");
    }
  }

  // Create operations
  async insertOne(document) {
    try {
      const now = new Date();
      const collection = await this.getCollection();
      return await collection.insertOne({
        ...document,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      return Log.error(error, "insertOne", "Failed to insert one data.");
    }
  }

  async insertMany(documents) {
    try {
      const collection = await this.getCollection();
      return await collection.insertMany(documents);
    } catch (error) {
      console.error("Error inserting documents:", error);
      throw error;
    }
  }

  // Update operations
  async updateOne(filter, update, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.updateOne(filter, update, options);
    } catch (error) {
      return Log.error(error, "updateOne", "Failed to update one data.");
    }
  }

  async updateMany(filter, update, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.updateMany(filter, update, options);
    } catch (error) {
      console.error("Error updating documents:", error);
      throw error;
    }
  }

  // Delete operations
  async deleteOne(filter, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.deleteOne(filter, options);
    } catch (error) {
      return Log.error(error, "deleteOne", "Failed to delete one data.");
    }
  }

  async deleteMany(filter, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.deleteMany(filter, options);
    } catch (error) {
      console.error("Error deleting documents:", error);
      throw error;
    }
  }

  async isConnected() {
    return this.#isConnected;
  }

  async ping() {
    try {
      await this.#database.command({ ping: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }
}
