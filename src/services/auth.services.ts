import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../prisma/db"; // shared runtime instance (src/prisma/db.ts)

export class AuthService {
    static registerUser = async (
        username: string,
        email: string,
        password: string,
    ) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.orm.public.User.create({
            username,
            email,
            password: hashedPassword,
        });
        return user;
    };

    static findUserById = async (id: number) => {
        return db.orm.public.User.first({
            id,
        });
    };

    static findUserByEmail = async (email: string) => {
        return db.orm.public.User.where({ email }).first();
    };
}
