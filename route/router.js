import { Router } from "express";
import AuthController from "../app/controller/AuthController.js";
import NotesController from "../app/controller/NotesController.js";
import UserController from "../app/controller/UserController.js";
import Validation from "../utils/validation/Validation.js";
import BearerTokenAuth from '../app/middleware/TokenAuthMiddleware.js'
import {uploadMulterImage} from "../app/middleware/MulterMiddleware.js"

export const router = Router();

router.post("/auth/register", [uploadMulterImage.none(),Validation.Register()],  AuthController.Register);
router.post("/auth/login", [uploadMulterImage.none(),Validation.Login()],  AuthController.Login);

router.get('/notes/', BearerTokenAuth, NotesController.index);
router.get('/notes/:id', BearerTokenAuth, NotesController.index);
router.post('/notes/addLike/:id', BearerTokenAuth, NotesController.addLike);
router.post('/notes/create', [BearerTokenAuth,uploadMulterImage.single('image'),Validation.Notes()], NotesController.create);
router.patch('/notes/:id', [BearerTokenAuth, Validation.Notes()], NotesController.update);
router.delete('/notes/:id', BearerTokenAuth, NotesController.destroy);

router.get('/users/',BearerTokenAuth, UserController.getAllUsers);
router.get('/users/active',BearerTokenAuth, UserController.getActiveUsers);

router.post("/auth/logout",BearerTokenAuth,  AuthController.Logout);
