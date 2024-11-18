import jwt from 'jsonwebtoken';
import { validationResult } from "express-validator";
import Log from "../../utils/log/Log.js";
import User from '../model/User.js';
export default class AuthController {

  static async Register(req, res) {

    try {
      const validationError = AuthController.#handleValidationErrors(validationResult(req), res);

      if (validationError) return validationError;
      
      const isSave = await User.register(req.body);
  
      if (!isSave.acknowledged) throw new Error('Registration failed.');
      
      return AuthController.#sendResponse(res, 201, 'Successfully registered.');

    } catch (error) {
      Log.error(error, 'Register');
      return AuthController.#sendResponse(res, 500, {
        message: 'Internal server error',
        error: error
      });
    }
  }

  static async Login(req, res) {
    try {
      const validationError = AuthController.#handleValidationErrors(validationResult(req), res);
      
      if (validationError) return validationError;

      const user = await User.findEmail({ email: req.body.email });
      
      const isPasswordValid = await User.isPasswordValid(req.body.password, user.password);
      
      if (!user || !isPasswordValid) {
        return AuthController.#sendResponse(res, 403, {
          message: 'Wrong email or password.',
          user: null,
        });
      };

      delete user.password;

      const token = jwt.sign(user, process.env.TOKEN, {expiresIn: "1h"});

      res.cookie('token', token, {httpOnly: true})
      
      return AuthController.#sendResponse(res, 200,
        {
          message: 'Authenticated' ,
          user
        }
      );
      
    } catch (error) {
      Log.error(error, 'Login');
      return AuthController.#sendResponse(res, 500, 'Internal server error');
    }
  }

  // Private Methods
  static #handleValidationErrors(errors, res) {
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return null;
  }

  static #sendResponse(res, statusCode, response) {
    return res.status(statusCode).json({ response });
  }
} 
