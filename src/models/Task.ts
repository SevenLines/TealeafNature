import Lab from "./Lab";
const {DataTypes} = require('sequelize');
import {db} from '../db';
import {InstanceDestroyOptions, Model} from "sequelize";
import {Column, Table} from "./decorators";


export interface Subtask {
    content: string;
}

@Table({
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
export default class Task extends Model {
    id: number;

    @Column(DataTypes.STRING)
    title: string;

    @Column(DataTypes.NUMBER)
    complexity: number;

    @Column(DataTypes.STRING)
    content: string;

    @Column(DataTypes.STRING)
    additional_content: string;

    @Column(DataTypes.NUMBER)
    order: number;

    @Column(DataTypes.ARRAY(DataTypes.STRING))
    tags: string;

    @Column(DataTypes.BOOLEAN)
    visible: boolean;

    @Column(DataTypes.NUMBER)
    group_id: number;

    @Column(DataTypes.NUMBER)
    lab_id: number;

    @Column(DataTypes.STRING)
    custom_class: string;

    @Column(DataTypes.STRING)
    youtube_link: string;

    @Column(DataTypes.JSONB)
    subtasks: Array<Subtask>

    @Column(DataTypes.BOOLEAN)
    show_help_in_modal: boolean;

    getLab: Function;
    getTaskGroup: Function;
}
