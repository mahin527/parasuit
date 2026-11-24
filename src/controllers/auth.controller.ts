import { AuthService } from "../services/auth.services";
import type { Request, Response } from "express";

export class AuthController {
    static signUp = async (req: Request, res: Response) => {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    message: "username, email and password are required",
                });
            }

            const existingUser = await AuthService.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    message: "this email is already registered",
                });
            }
            const user = await AuthService.registerUser(
                username,
                email,
                password,
            );
            return res.status(201).json({
                message: "user registered successfully",
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                message: "registration failed",
                error,
            });
        }
    };
}
