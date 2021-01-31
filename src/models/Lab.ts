import {Column, Table} from "./decorators";

const {DataTypes} = require('sequelize');
import {db} from '../db';
import {InstanceDestroyOptions, Model} from "sequelize";
import Task from "./Task";
import TaskGroup from "./TaskGroup";

@Table({
    sequelize: db,
    modelName: "Lab",
    tableName: "lessons_lab",
    createdAt: false,
    updatedAt: "modified_at",
    hooks: {
        async afterSave(instance, options) {
            let discipline = await instance.getDiscipline()
            await discipline.generateLabsYaml()
        },
        async afterDestroy(instance, options: InstanceDestroyOptions) {
            let discipline = await instance.getDiscipline()
            await discipline.generateLabsYaml()
        }
    }
})
export default class Lab extends Model {
    id: number;

    @Column(DataTypes.STRING)
    alias: string;

    @Column(DataTypes.STRING)
    title: string;

    @Column(DataTypes.NUMBER)
    order: number;

    @Column(DataTypes.STRING)
    icon: string;

    @Column(DataTypes.NUMBER)
    group_id: number;

    @Column(DataTypes.NUMBER)
    type: number;

    @Column(DataTypes.STRING)
    content: string;

    @Column(DataTypes.STRING)
    content_additional: string;

    @Column(DataTypes.STRING)
    remark: string;

    @Column(DataTypes.DATE)
    modified_at: Date;

    @Column(DataTypes.NUMBER)
    discipline_id: number;

    @Column(DataTypes.BOOLEAN)
    visible: boolean;

    getTasks: Function;
    getDiscipline: Function;
}

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
