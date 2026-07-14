import errorHandler from "@src/middlewares/errorHandler.js";
import router from "@src/routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

app.use("/api", router);

app.use(errorHandler);

export default app;
