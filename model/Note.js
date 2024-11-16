import Model from "./Model.js";

export default class Note extends Model {

    static collection = "notes";

    static async get(query = {}){
        return await this.all(query);
    }   

    static async create(data = {}){
        return await this.insertOne(data);
    }

}