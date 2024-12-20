import { ObjectId } from "mongodb";
import Note from "../model/Note.js";
import {ValidateRequest} from '../../utils/validation/Request.js';
import Response from "../../utils/response/Response.js";
import Cloudinary from "../../database/Cloudinary.js";

export default class NotesController {

  static async index(req, res) {

    const notes = req.params.id ? await Note.all({"user_id": req.params.id }) : await Note.all({"isPrivate": false});
    return res.json({notes});

  }

  static async create(req, res) {
    const validationError = ValidateRequest(req, res);

    if (validationError) return validationError;

    let isSave;
    if(req.body.image){
      // const file = await datauri(req);
      
      const cloudinary = new Cloudinary();
      const uploadPhoto = await cloudinary.UploadImage(req.body.image);
      const image = await uploadPhoto.url;

      if(!image){
        return Response.send(res, Response.INTERNAL_ERROR, "It is not you. It's us. Please comeback later.");
      }
  
      isSave = await Note.insertOne({...req.body,image: image})
    }else{
      isSave = await Note.insertOne(req.body);
    }


    if (!isSave) throw new Error("Failed to store note to the database.");

    return Response.send(res, Response.CREATED, isSave);
  }

  static async update(req, res) {
     const validationError = ValidateRequest(req, res);

     if (validationError) return validationError;

     const filter = {_id: ObjectId.createFromHexString(req.params.id) };

     const updateDocs = req.body;
      
     const options = {upsert: true};

     const isUpdated = await Note.updateOne(filter,updateDocs,options);

     if (!isUpdated) throw new Error("Failed to update the note.");

     return Response.send(res, Response.SUCCESS, isUpdated);
  }

  static async destroy(req, res) {

    const filter = {_id: ObjectId.createFromHexString(req.params.id)};

    const isDelete =  await Note.deleteOne(filter);

    if(!isDelete) throw new Error("Failed to delete the note.");

    return Response.send(res, Response.SUCCESS, isDelete);
  }

  static async addLike(req, res){
    const filter = {_id: ObjectId.createFromHexString(req.params.id) };
    const updateDocs = {likes: req.body};
    const options = {upsert: true,new: true};
    const note = await Note.findThenUpdate(filter, updateDocs,"$push",options );
    if(!note) return Response.send(res, Response.BAD_REQUEST, "Bad Request");
    return Response.send(res, Response.SUCCESS, isUpdated);
  }
}
