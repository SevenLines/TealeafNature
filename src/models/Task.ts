import Lab from "./Lab";
const {DataTypes} = require('sequelize');
import {db} from '../db';
import {Model} from "sequelize";

export class Task extends Model {
    title: string;
    complexity: number;
    content: string;
    additional_content: string;
    order: number;
    tags: string;
    visible: boolean;
    group_id: number;
    lab_id: number;
    custom_class: string;
}

Task.init({
    title: DataTypes.STRING,
    complexity: DataTypes.NUMBER,
    content: DataTypes.STRING,
    additional_content: DataTypes.STRING,
    order: DataTypes.NUMBER,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    visible: DataTypes.BOOLEAN,
    group_id: DataTypes.NUMBER,
    lab_id: DataTypes.NUMBER,
    custom_class: DataTypes.STRING,
}, {
    sequelize: db,
    modelName: "Task",
    tableName: "lessons_task",
    timestamps: false
})

export interface ITask {
    title: string,
    complexity: number,
    content: string,
    additional_content: string,
    order: number,
    tags: string,
    visible: boolean,
    group_id: number,
    lab_id: number,
    custom_class: string,
}

export default Task