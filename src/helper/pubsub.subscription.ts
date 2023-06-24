import { PostgresPubSub } from "graphql-pg-subscriptions";
import { Client } from "pg";
import { ConfigService } from "@nestjs/config";

//Configurations
const configService = new ConfigService();

const client = new Client({
    user: configService.get<string>("POSTGRES_USER"),
    host: configService.get<string>("POSTGRES_HOST"),
    database: configService.get<string>("POSTGRES_DATABASE_NAME"),
    password: configService.get<string>("POSTGRES_PASSWORD"),
    port: configService.get<number>("POSTGRES_PORT"),
});
client.connect();

export const pubsub = new PostgresPubSub({ client });