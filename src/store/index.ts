import Vue from 'vue'
import Vuex from 'vuex'
import Discipline from "../models/Discipline";
import Lab from "../models/Lab";
import * as fs from "fs";
import _ from 'lodash';
import path from "path";

const child_process = require('child_process');
const kill  = require('tree-kill');


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
        runJekyllProcess(state) {
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
        }
    },
    getters: {
        activeDisciplineArticles({activeDiscipline}) {
            let files = [];
            if (!_.isEmpty(activeDiscipline)) {
                let jekyll_folder = (activeDiscipline as any).jekyll_folder
                if (jekyll_folder) {
                    let dir = path.join(jekyll_folder, "common")
                    if (fs.existsSync(dir)) {
                        files = fs.readdirSync(dir).filter(x => x.endsWith(".md"));
                    }
                }
            }
            return files;
        }
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
    },
})
