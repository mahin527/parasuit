import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
const router = Router();

router.post("/auth/sign-up", AuthController.signUp);

export default router;
