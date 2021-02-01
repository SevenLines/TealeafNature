import {Sequelize} from "sequelize";
import pg = require('pg');
import {remote } from "electron";
import * as fs from "fs";
import path from "path";
let app = remote.app

let userPath = app.getPath('userData')

if (!fs.existsSync(userPath))
    fs.mkdirSync(userPath)

export let options: any = {
    username: "postgres",
    password: 123,
    database: "tealeaf2019",
    port: 5432,
    host: "localhost",
    dialect: "postgres",
}

try {
    let data = fs.readFileSync(path.join(userPath, "config.json"))
    options = JSON.parse(data.toString())
} catch(e) {
    fs.writeFileSync(path.join(userPath, "config.json"), JSON.stringify(options))
    console.error(e)
}

export const db = new Sequelize({
   ...options,
    dialectModule: pg,
});


module.exports = {
    db: db,
    options: options,
};