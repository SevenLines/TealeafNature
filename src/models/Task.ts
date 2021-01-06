import {db} from "../db";
import Lab from "./Lab";
const {DataTypes} = require('sequelize');


export const Task = db.define("Task", {
    title: DataTypes.STRING,
    complexity: DataTypes.NUMBER,
    content: DataTypes.STRING,
    additional_content: DataTypes.STRING,
    order: DataTypes.NUMBER,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    visible: DataTypes.BOOLEAN,
    group_id: DataTypes.NUMBER,
    custom_class: DataTypes.STRING,
}, {
    tableName: "lessons_task",
    timestamps: false
})

export default Task