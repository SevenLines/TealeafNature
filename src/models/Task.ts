import Lab from "./Lab";
const {DataTypes} = require('sequelize');
import {db} from '../db';
import {InstanceDestroyOptions, Model} from "sequelize";
import {HookReturn} from "sequelize/types/lib/hooks";

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
    youtube_link: string;

    getLab;
    getTaskGroup;
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
    youtube_link: DataTypes.STRING,
}, {
    sequelize: db,
    modelName: "Task",
    tableName: "lessons_task",
    timestamps: false,
    hooks: {
        async afterSave(instance, options) {
            let lab: Lab = await instance.getLab();
            let discipline = await lab.getDiscipline()
            await discipline.generateLabsYaml()
        },
        async afterDestroy(instance, options: InstanceDestroyOptions) {
            let lab: Lab = await instance.getLab();
            let discipline = await lab.getDiscipline()
            await discipline.generateLabsYaml()
        }
    }
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
    youtube_link: string,
}

export default Task