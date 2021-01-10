import Vue from 'vue'
import Vuex from 'vuex'
import Discipline from "../models/Discipline";
import Lab from "../models/Lab";
import * as fs from "fs";
import _ from 'lodash';
import path from "path";

const child_process = require('child_process');
const kill = require('tree-kill');


Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        disciplines: [],
        labs: [],
        tasks: [],
        taskGroups: [],
        activeDiscipline: {},
        activeLab: {},
        jekyllProcess: null,
        activeDisciplineArticles: [],
    },
    mutations: {
        setDisciplines(state, disciplines) {
            state.disciplines = disciplines;
        },
        setLabs(state, labs) {
            state.labs = labs;
        },
        setTasks(state, tasks) {
            state.tasks = tasks;
        },
        setTaskGroups(state, tasks) {
            state.taskGroups = tasks;
        },
        setActiveDiscipline(state, discipline) {
            state.activeDiscipline = discipline;
        },
        setActiveLab(state, lab) {
            state.activeLab = lab;
        },
        setActiveDisciplineArticles(state, articles) {
            state.activeDisciplineArticles = articles;
        },
    },
    actions: {
        async fetchDisciplines({commit}) {
            let r = await Discipline.findAll({order: [["title", "DESC"]]});
            commit("setDisciplines", r)
        },
        async fetchLabs({commit, state}) {
            let r = await (state.activeDiscipline as any).getLabs({order: ["order"]});
            commit("setLabs", r)
        },
        async fetchTasks({commit, state}) {
            let r = await (state.activeLab as any).getTasks({order: ["group_id", "order"]});
            commit("setTasks", r)
        },
        async fetchTaskGroups({commit, state}) {
            let r = await (state.activeLab as any).getTaskGroups({order: ["order"]});
            commit("setTaskGroups", r)
        },
        async setActiveDisciplineId({commit, state, dispatch}, disciplineId) {
            commit("setLabs", [])
            commit("setTasks", [])
            commit("setTaskGroups", [])

            let discipline = await Discipline.findOne({where: {id: disciplineId}})
            commit("setActiveDiscipline", discipline)
            dispatch("fetchLabs")
            dispatch("fetchActiveDisciplineArticles")
        },
        async setActiveLabId({commit, state, dispatch}, labId) {
            commit("setLabs", [])
            commit("setTasks", [])
            commit("setTaskGroups", [])

            let lab = await Lab.findOne({where: {id: labId}, include: Discipline})
            let discipline = await (lab as any).getDiscipline();
            await dispatch("setActiveDisciplineId", discipline.id)
            commit("setActiveLab", lab)
            await dispatch("fetchTasks")
            await dispatch("fetchTaskGroups")
        },
        async updateTasksOrder({commit, state, dispatch}, tasks) {
            for (const t of tasks) {
                let index = tasks.indexOf(t);
                t.order = index + 1
                await t.save()
            }
            await dispatch("fetchTasks")
        },
        async updateLabsOrder({commit, state, dispatch}, labs) {
            for (const t of labs) {
                let index = labs.indexOf(t);
                t.order = index + 1
                await t.save()
            }
            await dispatch("fetchLabs")
        },
        async updateTaskGroupsOrder({commit, state, dispatch}, taskGroups) {
            for (const t of taskGroups) {
                let index = taskGroups.indexOf(t);
                t.order = index + 1
                await t.save()
            }
            await dispatch("fetchTaskGroups")
        },
        async fetchActiveDisciplineArticles({state, commit}) {
            let files = [];
            if (!_.isEmpty(state.activeDiscipline)) {
                let jekyll_folder = (state.activeDiscipline as any).jekyll_folder
                if (jekyll_folder) {
                    let dir = path.join(jekyll_folder, "common")
                    if (fs.existsSync(dir)) {
                        files = fs.readdirSync(dir).filter(x => x.endsWith(".md")).map(x => {
                            let item = {
                                "title": x,
                                "path": path.join(dir, x)
                            }
                            let content = fs.readFileSync(item.path, 'utf8')
                            let match = content.match(/permalink:\s+(.*)/)
                            if (match) {
                                item['permalink'] = match[1]
                            }
                            return item;
                        });
                    }
                }
            }
            commit("setActiveDisciplineArticles", files)
        },
        async runJekyllProcess({state}) {
            if (state.jekyllProcess) {
                kill(this.state.jekyllProcess.pid)
                this.state.jekyllProcess = null
            }
            if (state.activeDiscipline) {
                state.jekyllProcess = child_process.spawn('serve.cmd', {
                    detached: true,
                    cwd: (state.activeDiscipline as Discipline).jekyll_folder,
                });
            }
        },
        async runDeployProcess({state}, with_git) {
            if (state.activeDiscipline) {
                if (with_git) {
                    console.log("фиксирую именения в stage")
                    child_process.execSync(`git add ${(state.activeDiscipline as Discipline).jekyll_folder}`, {
                        cwd: (state.activeDiscipline as Discipline).jekyll_folder
                    })
                    console.log("пытаюсь создать коммит")
                    try {
                        child_process.execSync(`git commit -a -m "автоматический коммит из чаинки натуральной"`, {
                            cwd: (state.activeDiscipline as Discipline).jekyll_folder
                        })
                    } catch (e) {
                        console.error(e)
                    }
                    console.log("отправляю на сервер")
                    child_process.execSync("git push", {
                        cwd: (state.activeDiscipline as Discipline).jekyll_folder
                    })
                }
                let params = (state.activeDiscipline as Discipline).deploy_command.split(/\s+/)
                let ps = child_process.spawn(params[0], params.splice(1), {
                    detached: true,
                    cwd: process.cwd(),
                },);

                ps.stderr.on('data', (data) => {
                    console.error(`ps stderr: ${data}`);
                });
            }
        }
    },
})
