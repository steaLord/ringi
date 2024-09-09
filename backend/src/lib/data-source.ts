import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Job } from "../entity/Job";
import { Application } from "../entity/Application";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres", // Your database type
  host: process.env.DB_HOST, // Load from .env
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Be careful using this in production
  logging: false, // Turn on if needed
  entities: [User, Job, Application], // Your entities
});
