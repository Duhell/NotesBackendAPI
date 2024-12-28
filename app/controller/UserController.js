
import User from "../model/User.js";
import Response from "../../utils/response/Response.js";


export default class UserController {

    static async getAllUsers(req, res){
        const users = await User.all();
        return Response.send(res, Response.SUCCESS, {data: users})
    }

    static async getActiveUsers(req,res){
        
        const activeUsers = await User.all({isOnline: true});
        
        return Response.send(res, Response.SUCCESS, {data: activeUsers});
    }

    static async searchUser(req, res){
        if(!req.body.name) return Response.send(res, Response.BAD_REQUEST, "Name is required.");

        const trimmedName = req.body.name.trim();

        if(trimmedName === "") return Response.send(res, Response.BAD_REQUEST, "Name cannot be empty.");

        const users = await User.all({name: {$regex: trimmedName, $options: "i"}});

        if(!users) return Response.send(res, Response.SUCCESS, `No '${req.body.name}' in the database.'`);

        users.forEach(user => delete user.password);

        return Response.send(res, Response.SUCCESS, users);

    }
}