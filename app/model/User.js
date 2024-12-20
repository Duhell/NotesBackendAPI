import Model from "./Model.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";


export default class User extends Model {

    static collection = "users";

    static async login(req) {
        const user = await this.findOne({ email: req.body.email });
        if (!user) return false;
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) return false;
        await this.updateOne({_id: user._id},{isOnline: true},{upsert: true});
        return user;
    }

    static async register(data){
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await this.insertOne({
            ...data,
            password: hashedPassword
        });
    }

    static async logout(req){
        const user = await this.updateOne({_id: ObjectId.createFromHexString(req.body.id) },{isOnline: false});
        if(!user) return false;
        return true;
    }

}