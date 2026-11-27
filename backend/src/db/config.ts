import { Sequelize } from "sequelize-typescript";
import { DB_URL } from "../db/db.constants";

const dbConnection = new Sequelize(DB_URL!, {
    dialect: 'postgres',
    models: [`${__dirname}/../models/**/*`],
});

export default dbConnection;
