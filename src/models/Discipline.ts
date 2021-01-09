import Lab from "./Lab";

const {DataTypes} = require('sequelize');
import {db} from '../db';
import {Model} from "sequelize";
import setDefault from "../utils";
const yaml = require('js-yaml')
import fs from 'fs'
import path from "path";


export class Discipline extends Model {
    id: number;
    title: string;
    modified_at: Date;
    jekyll_folder: string;
    deploy_command: string;

    getLabs: Function;

    async generateLabsYaml() {
        let data = {
            'order': [],
            'labs': {},
            'students': {},
            'groups': {},
        }
        let labs = await this.getLabs({order: [["order"], ["title"]]})

        for (let lab of labs) {
            if (!lab.visible) {
                continue;
            }

            data.order.push(lab.alias)
            data['labs'][lab.alias] = {}

            let lab_item = data['labs'][lab.alias]
            lab_item['title'] = lab.title
            lab_item['icon'] = lab.icon
            lab_item['description'] = lab.content
            lab_item['description_additional'] = lab.content_additional
            lab_item['type'] = lab.type
            lab_item['remark'] = lab.remark
            lab_item['alias'] = lab.alias
            lab_item['task_done'] = {}

            let task_groups = {}
            let tasks = await lab.getTasks({order: [["order"], ["id"]]})
            for (let t of tasks) {
                console.log(t)
                let task_group = setDefault(task_groups, t.group_id || 0, {
                    'id': t.group_id || 0,
                    'title': t.group_id ? t.getTaskGroup().title : "default",
                    'tasks': [],
                    'type': t.group_id ? t.getTaskGroup().type : lab.type,
                })
                tasks = task_group['tasks']

                let task_item = {
                    "id": t.id,
                    "description": t.content,
                    "description2": t.additional_content,
                    "difficult": t.complexity,
                    "custom_class": t.custom_class,
                    "task_group": t.group_id,
                    "visible": t.visible,
                    "students": [],
                }

                tasks.push(task_item)
            }

            lab_item['task_groups'] = task_groups
        }

        let dump = yaml.dump(data)
        let filename = path.join(this.jekyll_folder, "_data", "labs.yaml");
        await fs.writeFile(filename, dump, err => {
            console.log(err)
        })
    }
}

Discipline.init({
    title: {
        type: DataTypes.STRING,
    },
    modified_at: {
        type: DataTypes.DATE,
    },
    jekyll_folder: {
        type: DataTypes.STRING,
    },
    deploy_command: DataTypes.STRING,
}, {
    sequelize: db,
    modelName: "Discipline",
    tableName: "lessons_discipline",
    createdAt: false,
    updatedAt: "modified_at"
});

Discipline.hasMany(Lab, {
    foreignKey: {
        field: "discipline_id"
    }
})
Lab.belongsTo(Discipline)


export default Discipline