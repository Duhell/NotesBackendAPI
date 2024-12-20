import jwt from 'jsonwebtoken';
import {ValidateRequest} from '../../utils/validation/Request.js';
import Log from "../../utils/log/Log.js";
import User from '../model/User.js';
import Response from "../../utils/response/Response.js";


export default class AuthController {

  static async Register(req, res) {

    try {
      const validationError = ValidateRequest(req, res);

      if (validationError) return validationError;
      
      const isSave = await User.register(req.body);
  
      if (!isSave) throw new Error('Registration failed.');
      
      return Response.send(res, Response.CREATED, "Successfully registered.");

    } catch (error) {
      Log.error(error, 'Register');

      return Response.send(res, Response.INTERNAL_ERROR, {
        message: 'Internal server error',
        error: error
      });
    }
  }

  static async Login(req, res) {
    try {
      const validationError = ValidateRequest(req, res);
      
      if (validationError) return validationError;

      const user = await User.login(req);
        
      if (!user) {
        return Response.send(res, Response.FORBIDDEN, {
          message: 'Wrong email or password.',
          user: null,
        });
      };

      delete user.password;

      const token = jwt.sign(user, process.env.TOKEN, {expiresIn: "6h"});
      
      return Response.send(res, Response.SUCCESS, {
        token: token,
        message: 'Authenticated' ,
        user
      });
      
    } catch (error) {
      Log.error(error, 'Login');
      return Response.send(res, Response.INTERNAL_ERROR, 'Internal server error');
    }
  }
} 
