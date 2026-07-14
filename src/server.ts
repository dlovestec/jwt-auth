import express, { type Express, type Request, type Response } from "express";
import { configurations } from "@src/configuration.js";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(configurations.app.port, () => {
  console.log("Server is running on port", configurations.app.port);
});
