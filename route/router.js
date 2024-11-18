import { Router } from "express";
import AuthController from "../app/controller/AuthController.js";
import NotesController from "../app/controller/NotesController.js";
import Validation from "../utils/validation/Validation.js";
import CookieJWTAuth from '../app/middleware/CookieJWTMiddleware.js';

export const router = Router();

router.post("/auth/register", Validation.Register(),  AuthController.Register);
router.post("/auth/login", Validation.Login(),  AuthController.Login);

router.get('/notes/:id', CookieJWTAuth, NotesController.index);
router.post('/notes/create', [CookieJWTAuth, Validation.Notes()], NotesController.create);
router.patch('/notes/:id', [CookieJWTAuth, Validation.Notes()], NotesController.update);
router.delete('/notes/:id', CookieJWTAuth, NotesController.destroy);