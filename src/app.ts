import express from 'express';
import 'dotenv/config';

import carsRouter from './routers/carsRouter';
import authRouter from './routers/authRouter';

const baseUrl = '/api/v1';

const app = express();

app.use(express.json());
app.use(`${baseUrl}/cars`, carsRouter);
app.use(`${baseUrl}/auth`, authRouter);

export default app;
