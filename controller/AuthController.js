import "dotenv/config";
import MongoDatabase from "../database/Database.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Log from "../log/Log.js";
// import userSchema from "../schema/UserSchema.js";

const DB = new MongoDatabase(process.env.MONGODB_URI, "Notes");
// await DB.createCollection('users',userSchema);
await DB.useCollection("users");

export default class AuthController {

  static async Register(req, res) {
    try {
      const validationError = AuthController.#handleValidationErrors(validationResult(req), res);
      if (validationError) return validationError;

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const userData = { ...req.body, password: hashedPassword };
      
      const save = await DB.insertOne(userData);
      
      if (!save.acknowledged) {
        throw new Error('Registration failed.');
      }

      return AuthController.#sendResponse(res, 201, 'Successfully registered.');
    } catch (error) {
      Log.error(error, 'Register');
      return AuthController.#sendResponse(res, 500, {
        message: 'Internal server error',
        error: error
      });
    } finally {
      await DB.disconnect();
    }
  }

  static async Login(req, res) {
    try {
      const validationError = AuthController.#handleValidationErrors(validationResult(req), res);
      if (validationError) return validationError;

      const user = await DB.findOne({ email: req.body.email });
      
      if (!user) {
        return AuthController.#sendResponse(res, 404, 'User not found in the database.');
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
      
      return AuthController.#sendResponse(
        res, 
        isPasswordValid ? 200 : 403,
        {
          message: isPasswordValid ? 'Authenticated' : 'Not Authenticated',
          user
        }
      );
    } catch (error) {
      Log.error(error, 'Login');
      return AuthController.#sendResponse(res, 500, 'Internal server error');
    } finally {
      await DB.disconnect();
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
