import fs from "fs";
import {remote} from "electron";
import path from "path";
import _ from 'lodash'
import {Options} from "sequelize";

let app = remote.app

interface ConfigStoreOptions {
    sequelize: Options
}


export default class ConfigStore {
    private static _instance: ConfigStore = new ConfigStore();

    private _userPath = app.getPath('userData')
    private _configPath = path.join(this._userPath, "config.json")
    private _options: ConfigStoreOptions;

    private defaultOptions: ConfigStoreOptions = {
        sequelize: {
            username: "postgres",
            password: "123",
            database: "tealeaf2019",
            port: 5432,
            host: "localhost",
            dialect: "postgres",
        }
    }

    constructor() {
        console.log(this._configPath)

        if (ConfigStore._instance) {
            throw new Error("Error: Instantiation failed: Use ConfigStore.getInstance() instead of new.");
        }
        ConfigStore._instance = this;
    }

    static get instance() {
        return ConfigStore._instance
    }

    get userPath() {
        return this._userPath;
    }

    get options() {
        if (!fs.existsSync(this._userPath))
            fs.mkdirSync(this._userPath)

        console.log(`Trying to load config from ${this._configPath}`)

        try {
            console.log("loading")
            let data = fs.readFileSync(this._configPath)
            this._options = JSON.parse(data.toString())
            console.log(`loading done`)
            console.log(this._options)
        } catch (e) {
            console.error(e);
            throw new Error(`Please create ${this._configPath}`)
        }
        return this._options
    }

    set options(value) {
        this._options = value;
        fs.writeFileSync(this._configPath, JSON.stringify(this._options))
    }

    get sequelize(): Options {
        let options = this.options
        return _.get(options, "sequelize", this.defaultOptions.sequelize)
    }

    set sequelize(value: Options) {
        let sequelize = {...this.sequelize, ...value}
        this.options = {
            ...this.options,
            sequelize: sequelize
        }
    }
}