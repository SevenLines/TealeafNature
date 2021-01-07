import {db} from "../db";
import {DataTypes} from "sequelize";
import Discipline from "./Discipline";
import {Task} from "./Task";
import TaskGroup from "./TaskGroup";

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
    discipline_id: DataTypes.NUMBER,
}, {
    tableName: "lessons_lab",
    createdAt: false,
    updatedAt: "modified_at"
})

Lab.hasMany(Task, {
    foreignKey: {
        field: "lab_id"
    }
})
Lab.hasMany(TaskGroup, {
    foreignKey: {
        field: "lab_id"
    }
})
Task.belongsTo(Lab)
TaskGroup.belongsTo(Lab)

export interface  ILab {
    alias: string;
    title: string;
    order: number;
    icon: string;
    type: number;
    content: string;
    content_additional: string;
    remark: string;
}

export default Lab