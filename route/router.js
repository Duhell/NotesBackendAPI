import { Router } from "express";
import AuthController from "../app/controller/AuthController.js";
import NotesController from "../app/controller/NotesController.js";
import Validation from "../utils/validation/Validation.js";
import BearerTokenAuth from '../app/middleware/TokenAuthMiddleware.js'

export const router = Router();

router.post("/auth/register", Validation.Register(),  AuthController.Register);
router.post("/auth/login", Validation.Login(),  AuthController.Login);

router.get('/notes/', BearerTokenAuth, NotesController.index);
router.get('/notes/:id', BearerTokenAuth, NotesController.index);
router.post('/notes/create', [BearerTokenAuth, Validation.Notes()], NotesController.create);
router.patch('/notes/:id', [BearerTokenAuth, Validation.Notes()], NotesController.update);
router.delete('/notes/:id', BearerTokenAuth, NotesController.destroy);