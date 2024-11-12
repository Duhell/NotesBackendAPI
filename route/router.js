import { Router } from "express";
import AuthController from "../controller/AuthController.js";
import Validation from "../validation/Validation.js";

export const router = Router();

router.post("/auth/register", Validation.Register(),  AuthController.Register);
router.post("/auth/login", Validation.Login(),  AuthController.Login);