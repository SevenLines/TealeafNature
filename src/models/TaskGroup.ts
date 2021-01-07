import {db} from "../db";
import Lab from "./Lab";
import {Task} from "./Task";
const {DataTypes} = require('sequelize');


export const TaskGroup = db.define("TaskGroup", {
    title: DataTypes.STRING,
    lab_id: DataTypes.NUMBER,
    type: DataTypes.NUMBER,
    order: DataTypes.NUMBER,
}, {
    tableName: "lessons_taskgroup",
    timestamps: false
})
TaskGroup.hasMany(Task, {
    foreignKey: {
        field: "group_id"
    }
})
Task.belongsTo(TaskGroup)

export interface ITaskGroup {
    title: string,
    lab_id: number,
    type: number,
    order: number,
}

export default TaskGroup