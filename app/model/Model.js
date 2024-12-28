import MongoDatabase from "../../database/Database.js";
import Log from "../../utils/log/Log.js";

export default class Model {
  static db = new MongoDatabase();
  static collection = "";

  static async getCollection() {
    const database = await this.db.getDatabase();
    return database.collection(this.collection);
  }

  static async all(query = {}, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.find(query, options).sort({ updatedAt: -1 }).toArray();
    } catch (error) {
      return Log.error(error, "all");
    }
  }

  static async findOne(query = {}, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.findOne(query, options);
    } catch (error) {
      return Log.error(error, "findOne");
    }
  }

  // Create operations
  static async insertOne(document) {
    try {
      const now = new Date();
      const collection = await this.getCollection();
      return await collection.insertOne({
        ...document,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      return Log.error(error, "insertOne");
    }
  }

  static async insertMany(documents) {
    try {
      const collection = await this.getCollection();
      return await collection.insertMany(documents);
    } catch (error) {
      console.error("Error inserting documents:", error);
      throw error;
    }
  }

  // Update operations
  static async updateOne(filter, update, options = {}) {
    try {
      const now = new Date();
      const collection = await this.getCollection();
      return await collection.updateOne(filter, {
        $set:  {...update, updatedAt: now}
      } , options);
    } catch (error) {
      return Log.error(error, "updateOne");
    }
  }

  static async findThenUpdate(filter, update, $operator , options = {}){
    try {
      const collection = await this.getCollection();
      return await collection.findOneAndUpdate(filter, {
        [$operator]:  {...update}
      } , options);
    } catch (error) {
      return Log.error(error, "updateOne");
    }
  }

  static async updateMany(filter, update, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.updateMany(filter, update, options);
    } catch (error) {
      console.error("Error updating documents:", error);
      throw error;
    }
  }

  // Delete operations
  static async deleteOne(filter, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.deleteOne(filter, options);
    } catch (error) {
      return Log.error(error, "deleteOne");
    }
  }

  static async deleteMany(filter, options = {}) {
    try {
      const collection = await this.getCollection();
      return await collection.deleteMany(filter, options);
    } catch (error) {
      console.error("Error deleting documents:", error);
      throw error;
    }
  }

  static async count(filter){
    try{
      const collection =  await this.getCollection();
      const count = await collection.countDocuments(filter);
      return count;
    }catch(error){
      return Log.error(error, "count");
    }
  }
}
