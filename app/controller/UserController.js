
import User from "../model/User.js";
import Response from "../../utils/response/Response.js";


export default class UserController {

    static async getAllUsers(req, res){
        const users = await User.all();
        return Response.send(res, Response.SUCCESS, {data: users})
    }

    static async getActiveUsers(req,res){
        
        const activeUsers = await User.all({isOnline: true});
        if(!activeUsers) return Response.send(res, Response.NOT_FOUND, "Not found in the database.")
        
        return Response.send(res, Response.SUCCESS, {
            data: activeUsers,
        });
    }
}