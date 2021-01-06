import {db} from "../db";
import {DataTypes} from "sequelize";
import Discipline from "./Discipline";
import {Task} from "./Task";

export const Lab = db.define("Lab", {
    alias: DataTypes.STRING,
    title: DataTypes.STRING,
    order: DataTypes.NUMBER,
    icon: DataTypes.STRING,
    group_id: DataTypes.NUMBER,
    type: DataTypes.NUMBER,
    content: DataTypes.STRING,
    content_additional: DataTypes.STRING,
    remark: DataTypes.STRING,
    modified_at: DataTypes.DATE,
}, {
    tableName: "lessons_lab",
    timestamps: false
})
Lab.hasMany(Task, {
    foreignKey: {
        field: "lab_id"
    }
})
Task.belongsTo(Lab)

export default Lab