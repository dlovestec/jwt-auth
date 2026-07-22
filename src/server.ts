import app from "#src/app.js";
import { configurations } from "#src/configuration.js";
import DatabaseConnection from "#src/database/connection.js";
import { createServer, Server } from "http";

const server: Server = createServer(app);

const initializeDatabase = async () => {
  await DatabaseConnection.authenticate();
  // await DatabaseConnection.syncDatabase();
};

await initializeDatabase();

server.listen(configurations.app.port, () => {
  console.log("Server is running on port", configurations.app.port);
});
