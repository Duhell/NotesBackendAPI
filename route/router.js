import { Router } from "express";
import AuthController from "../controller/AuthController.js";
import NotesController from "../controller/NotesController.js";
import Validation from "../validation/Validation.js";
import CookieJWTAuth from '../middleware/CookieJWTMiddleware.js';

export const router = Router();

router.post("/auth/register", Validation.Register(),  AuthController.Register);
router.post("/auth/login", Validation.Login(),  AuthController.Login);

router.get('/notes/:id', CookieJWTAuth, NotesController.index);
router.post('/notes/create', [CookieJWTAuth, Validation.Notes()], NotesController.create);
router.patch('/notes/:id', [CookieJWTAuth, Validation.Notes()], NotesController.update);
router.delete('/notes/:id', CookieJWTAuth, NotesController.destroy);