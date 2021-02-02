import {Sequelize} from "sequelize";
import pg = require('pg');
import {remote } from "electron";
import * as fs from "fs";
import path from "path";
import ConfigStore from "./store/config_store";



export const db = new Sequelize({
   ...ConfigStore.instance.sequelize,
    dialectModule: pg,
});


module.exports = {
    db: db,
};