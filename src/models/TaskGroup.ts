import {db} from "../db";
import Lab from "./Lab";
import {Task} from "./Task";
import {Model} from "sequelize";
const {DataTypes} = require('sequelize');

export class TaskGroup extends Model {
    id;
    title;
    lab_id;
    type;
    order;

    getTasks;
}

TaskGroup.init({
    title: DataTypes.STRING,
    lab_id: DataTypes.NUMBER,
    type: DataTypes.NUMBER,
    order: DataTypes.NUMBER,
}, {
    sequelize: db,
    modelName: "TaskGroup",
    tableName: "lessons_taskgroup",
    timestamps: false
})
TaskGroup.hasMany(Task, {
    foreignKey: {
        field: "group_id"
    }
})
Task.belongsTo(TaskGroup)

export default TaskGroup