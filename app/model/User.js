import Model from "./Model.js";
import bcrypt from "bcrypt";

export default class User extends Model {

    static collection = "users";

    static async login(req) {
        const user = await this.findOne({ email: req.body.email });
        if (!user) return false;
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) return false;
        return user;
    }
    
    static async register(data){
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await this.insertOne({
            ...data,
            password: hashedPassword
        });
    }
}