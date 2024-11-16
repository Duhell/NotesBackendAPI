import Log from "../log/Log.js";
import Note from "../model/Note.js";
import { validationResult } from "express-validator";

export default class NotesController {

  static async index(req, res) {

    const notes = await Note.all({
        "user_id": req.params.id
    });
    return res.json({notes});
  }

  static async create(req, res) {
    const validationError = NotesController.#handleValidationErrors(validationResult(req),res);

    if (validationError) return validationError;

    const isSave = await Note.create(req.body);

    if (!isSave.acknowledged)
      throw new Error("Failed to store note to the database.");

    return NotesController.#sendResponse(res, 201, "New note added.");
  }

  static async update(req, res) {
    return res.send(req.params.id);
  }

  static async destroy(req, res) {
    return res.send(req.params.id);
  }

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
