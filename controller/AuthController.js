import jwt from 'jsonwebtoken';
import { validationResult } from "express-validator";
import Log from "../log/Log.js";
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
  
      if (!user) return AuthController.#sendResponse(res, 403, {
        message: 'Wrong email or password.',
        user: null,
      });
      
      const isPasswordValid = await User.isPasswordValid(req.body.password, user.password);
      
      return AuthController.#sendResponse(
        res, 
        isPasswordValid ? 200 : 403,
        {
          message: isPasswordValid ? 'Authenticated' : 'Wrong email or password.',
          user: isPasswordValid ? user : null
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
