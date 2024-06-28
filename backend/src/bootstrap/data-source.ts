import "reflect-metadata";
import { DataSource } from "typeorm";

// entity imports
import Entities from "@entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  schema: "public",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [...Object.values(Entities)],
  ssl: true,
});
