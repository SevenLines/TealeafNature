import Lab from "./Lab";

const {DataTypes} = require('sequelize');
import {db} from '../db';
import {Model} from "sequelize";
import setDefault from "../utils";

const yaml = require('js-yaml')
import fs from 'fs'
import fsExtra from 'fs-extra';
import path from "path";
import {Table, Column} from "./decorators";


@Table({
    sequelize: db,
    modelName: "Discipline",
    tableName: "lessons_discipline",
    createdAt: false,
    updatedAt: "modified_at"
})
export default class Discipline extends Model {
    id: number;

    @Column(DataTypes.STRING)
    title: string;

    @Column(DataTypes.DATE)
    modified_at: Date;

    @Column(DataTypes.STRING)
    jekyll_folder: string;

    @Column(DataTypes.STRING)
    deploy_command: string;

    @Column(DataTypes.STRING)
    site_url: string;

    getLabs: Function;

    async generateLabsYaml() {
        if (!fs.existsSync(this.jekyll_folder)) {
            return;
        }

        let data = {
            'order': [],
            'labs': {},
            'students': {},
            'groups': {},
        }
        let labsFolder = path.join(this.jekyll_folder, "_labs");
        if (!fs.existsSync(labsFolder)) {
            fs.mkdirSync(labsFolder);
        }
        await fsExtra.emptyDir(labsFolder)
        let tasksFolder = path.join(this.jekyll_folder, "_tasks");
        if (!fs.existsSync(tasksFolder)) {
            fs.mkdirSync(tasksFolder);
        }
        await fsExtra.emptyDir(tasksFolder)
        let labs = await this.getLabs({order: [["order"], ["title"]]})

        for (let lab of labs) {
            let filename = path.join(labsFolder, `${lab.alias}.md`);

            if (!lab.visible) {
                continue;
            }

            let labFileContent = `--- 
layout: lab
alias: ${lab.alias}
title: ${lab.title}
---
`
            await fs.writeFile(filename, labFileContent, err => {
                console.log(err)
            })

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
            let order = 0;
            for (let t of tasks) {
                let dir = path.join(this.jekyll_folder, "_tasks")
                let filename = path.join(dir, `${t.id}.md`);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                if (!t.visible) {
                    continue;
                }

                let task_group = setDefault(task_groups, t.group_id || 0, {
                    'id': t.group_id || 0,
                    'title': t.group_id ? t.getTaskGroup().title : "default",
                    'tasks': [],
                    'type': t.group_id ? t.getTaskGroup().type : lab.type,
                })
                tasks = task_group['tasks']

                if (t.additional_content) {

                    let title = t.content.replace(/\n+/gi, " - ").replace(/(<([^>]+)>)/gi, "").replace(/[:!\[\]/()`']/gi, "");
                    let taskFileContent = `--- 
layout: task
alias: ${lab.alias}
task_group_id: ${t.group_id || 0}
task_id: ${t.id}
task_order: ${order}
title:  ${order + 1} / ${title}
header: <a href="/labs/${lab.alias}">${lab.title}</a> / подсказка к ${order + 1} задачке
---
            `
                    await fs.writeFile(filename, taskFileContent, err => {
                        console.log(err)
                    })
                }

                let task_item = {
                    "id": t.id,
                    "description": t.content,
                    "description2": t.additional_content,
                    "difficult": t.complexity,
                    "custom_class": t.custom_class,
                    "task_group": t.group_id,
                    "visible": t.visible,
                    "youtube_link": t.youtube_link,
                    "students": [],
                }

                tasks.push(task_item)

                order++;
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

Discipline.hasMany(Lab, {
    foreignKey: {
        field: "discipline_id"
    }
})
Lab.belongsTo(Discipline)
