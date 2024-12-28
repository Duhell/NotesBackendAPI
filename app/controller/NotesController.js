import { ObjectId } from "mongodb";
import Note from "../model/Note.js";
import Like from "../model/Like.js";
import Comment from "../model/Comment.js";
import {ValidateRequest} from '../../utils/validation/Request.js';
import Response from "../../utils/response/Response.js";
import Cloudinary from "../../database/Cloudinary.js";

export default class NotesController {

  static async index(req, res) {
    let notes = req.params.id ? 
      await Note.all({"user_id": req.params.id }) : 
      await Note.all({"isPrivate": false});
  
    const cloudinary = new Cloudinary();
    notes = await Promise.all(notes.map(async (note) => {
      if (note.image) {
        note.image = await cloudinary.OptimizePhoto(note.image);
      }
      return note;
    }));

    return res.json({notes});
  }

  static async create(req, res) {
    const validationError = ValidateRequest(req, res);

    if (validationError) return validationError;

    let isSave;
    if(req.body.image){
      
      const cloudinary = new Cloudinary();
      const generatedImageId = await cloudinary.UploadImage(req.body.image);

      if(!image){
        return Response.send(res, Response.INTERNAL_ERROR, "It is not you. It's us. Please comeback later.");
      }
  
      isSave = await Note.insertOne({...req.body,image: generatedImageId})
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

    const newLike = await Like.insertOne(req.body);

    if(!newLike) return Response.send(res, Response.INTERNAL_ERROR, "Sorry, it is not you but us. Please try again later.");

    return Response.send(res, Response.SUCCESS, newLike);
  }

  static async addComment(req, res){

    if(!req.body.comment || req.body.comment.trim() === ""){
      return Response.send(res, Response.BAD_REQUEST, "Comment is empty.");
    }
    const newComment = await Comment.insertOne(req.body);
    
    if(!newComment) return Response.send(res, Response.INTERNAL_ERROR, "Sorry, it is not you but us. Please try again later.");

    return Response.send(res, Response.SUCCESS, newComment);
  }

  static async getLikes(req,res){

    const note_id = req.body.note_id;

    const likes = await Like.all({"note_id": note_id})

    if(!likes) return Response.send(res, Response.SUCCESS,{likes: 0});

    return Response.send(res,Response.SUCCESS, {likes: likes});

  }

  static async getComments(req,res){

    const note_id = req.body.note_id;

    const comments = await Comment.all({"note_id": note_id})

    if(!comments) return Response.send(res, Response.SUCCESS,{comments: 0});

    return Response.send(res,Response.SUCCESS, {comments: comments});
  }

  static async getTotalComments(req,res){
    
    const note_id = req.params.id;

    const totalCount = await Comment.count({"note_id": note_id});

    return Response.send(res, Response.SUCCESS, {countedComments: totalCount});
  }
}
