import errorHandler from "#src/middlewares/errorHandler.js";
import router from "#src/routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application, type RequestHandler } from "express";
import helmet from "helmet";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const healthCheck: RequestHandler = (_req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
};

app.get("/health", healthCheck);

app.use("/api", router);

app.use(errorHandler);

export default app;
