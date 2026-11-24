import cors from "cors";
import express, { type Request, Response } from "express";
import { PORT } from "./src/config/env";
import authRouter from "./src/routes/auth.routes";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5007"],
    }),
);

app.use(express.json());
app.use("/api", authRouter);

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running" });
});

app.listen(PORT, () => {
    console.log("server is running at port: ", PORT);
});
