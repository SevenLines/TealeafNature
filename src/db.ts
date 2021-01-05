import {Sequelize} from "sequelize";
import pg = require('pg');

export const db = new Sequelize("tealeaf2019", "postgres", "123", {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    dialectModule: pg,
});


module.exports = {
    db: db
};