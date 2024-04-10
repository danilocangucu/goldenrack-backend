import express from "express";
import cors from "cors";
import "dotenv/config";

import recordsRouter from "./routers/recordsRouter";
import authRouter from "./routers/authRouter";
import usersRouter from "./routers/usersRouter";

const baseUrl = "/api/v1";

const app = express();

app.use(cors());

app.use(express.json());
app.use(`${baseUrl}/records`, recordsRouter);
app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/users`, usersRouter);

export default app;
