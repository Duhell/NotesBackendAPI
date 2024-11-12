import Model from "./Model.js";
import bcrypt from "bcrypt";

export default class User extends Model {

    static collection = "users";

    static async findEmail(email){
        return await this.findOne(email);
    }

    static async register(data){
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await this.insertOne({
            ...data,
            password: hashedPassword
        });
    }

    static async isPasswordValid(requestPassword, hashedPassword ){
        return await bcrypt.compare(requestPassword, hashedPassword);
    }
}