import express from "express";
import cors from "cors";
import "dotenv/config";

import recordsRouter from "./routers/recordsRouter";
import authRouter from "./routers/authRouter";
import usersRouter from "./routers/usersRouter";
import paymentsRouter from "./routers/paymentsRouter";
import storesRouter from "./routers/storesRouter";

const baseUrl = "/api/v1";

const app = express();

app.use(cors());

app.use(express.json());
// TODO verify middlewares for admin+store owner check
app.use(`${baseUrl}/records`, recordsRouter);
app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/users`, usersRouter);
app.use(`${baseUrl}/payments`, paymentsRouter);
app.use(`${baseUrl}/stores`, storesRouter);

// TODO improve health check
app.get("/health", (_: express.Request, res: express.Response) => {
  res.send("OK");
});


export default app;
