import { configurations } from "#src/configuration.js";
import Session from "#src/models/session.model.js";
import User from "#src/models/user.model.js";
import { Sequelize } from "sequelize-typescript";

export default class DatabaseConnection {
  private static _instance: Sequelize;
  private constructor() {}

  public static getInstance(): Sequelize {
    if (!DatabaseConnection._instance) {
      DatabaseConnection._instance = new Sequelize({
        dialect: "mysql",
        host: configurations.db.host,
        port: configurations.db.port,
        username: configurations.db.username,
        password: configurations.db.password,
        database: configurations.db.database,
        models: [User, Session],
        logging: false,
      });
    }

    return DatabaseConnection._instance;
  }

  public static async authenticate(): Promise<void> {
    try {
      await this.getInstance().authenticate();
      console.log("✅ Database connection has been established successfully.");
    } catch (error) {
      console.error("❌ Unable to connect to the database:", error);
      process.exit(1);
    }
  }

  public static async syncDatabase(force: boolean = false): Promise<void> {
    try {
      await this.getInstance().sync({ force, alter: !force });
      console.log("✅ Database synchronized successfully.");
    } catch (error) {
      console.error("❌ Unable to synchronize the database:", error);
      process.exit(1);
    }
  }
}
