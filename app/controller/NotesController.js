import { ObjectId } from "mongodb";
import Note from "../model/Note.js";
import {ValidateRequest} from '../../utils/validation/Request.js';
import Response from "../../utils/response/Response.js";

export default class NotesController {

  static async index(req, res) {

    const notes = await Note.all({"user_id": req.params.id });
    return res.json({notes});

  }

  static async create(req, res) {
    const validationError = ValidateRequest(req, res);

    if (validationError) return validationError;

    const isSave = await Note.insertOne(req.body);

    if (!isSave) throw new Error("Failed to store note to the database.");

    return Response.send(res, Response.CREATED, "New note added.");
  }

  static async update(req, res) {
     const validationError = ValidateRequest(req, res);

     if (validationError) return validationError;

     const filter = {_id: ObjectId.createFromHexString(req.params.id) };

     const updateDocs = req.body;
      
     const options = {upsert: true};

     const isUpdated = await Note.updateOne(filter,updateDocs,options);

     if (!isUpdated) throw new Error("Failed to update the note.");

     return Response.send(res, Response.SUCCESS, "Note has been updated.");
  }

  static async destroy(req, res) {

    const filter = {_id: ObjectId.createFromHexString(req.params.id)};

    const isDelete =  await Note.deleteOne(filter);

    if(!isDelete) throw new Error("Failed to delete the note.");

    return Response.send(res, Response.SUCCESS, "Note has been deleted.");
  }
}
