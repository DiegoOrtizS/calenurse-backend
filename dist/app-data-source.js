"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myDataSource = void 0;
var dotenv_1 = require("dotenv");
var typeorm_1 = require("typeorm");
(0, dotenv_1.config)();
exports.myDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'calenurse2',
    entities: ["dist/entity/*.js"],
    migrations: ["dist/migration/*.js"],
    migrationsTableName: "migrations_typeorm",
    logging: true,
    synchronize: true,
});
