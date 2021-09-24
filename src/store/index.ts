import Vue from 'vue'
import Vuex from 'vuex'
import Discipline from "../models/Discipline";
import Lab from "../models/Lab";
import * as fs from "fs";
import _ from 'lodash';
import path from "path";
import {execAsync, spawnAsync} from "../utils";
import Options from "../views/Options.vue";
import ConfigStore from "./config_store";
import {readFileSync} from "fs";

const child_process = require('child_process');
const kill = require('tree-kill');
const Iconv = require('iconv').Iconv;
const {Client} = require('ssh2');


Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        disciplines: [],
        labs: [],
        tasks: [],
        taskGroups: [],
        activeDiscipline: {},
        activeLab: {},
        consoleActive: false,
        jekyllProcess: null,
        jekyllProcessLog: [],
        activeDisciplineArticles: [],
        loading: false,
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
        setConsoleActive(state, value) {
            state.consoleActive = value;
        },
        pushJekyllLogItem(state, text) {
            let content = text.toString().replace(/\n|(\r\n)|(\n\r)/gi, "<br>")
            content = content.replace(/\s/gi, "&nbsp;")
            state.jekyllProcessLog.push(content)
        },
        clearJekyllLog(state) {
            state.jekyllProcessLog = []
        },
        setLoading(state, loading) {
            state.loading = loading;
        }
    },
    actions: {
        async fetchDisciplines({commit}) {
            commit("setLoading", true)
            let r = await Discipline.findAll({order: [["title", "DESC"]]});
            commit("setDisciplines", r)
            commit("setLoading", false)
        },
        async fetchLabs({commit, state}) {
            commit("setLoading", true)
            let r = await (state.activeDiscipline as any).getLabs({order: ["order"]});
            commit("setLabs", r)
            commit("setLoading", false)
        },
        async fetchTasks({commit, state}) {
            commit("setLoading", true)
            let r = await (state.activeLab as any).getTasks({order: ["group_id", "order"]});
            commit("setTasks", r)
            commit("setLoading", false)
        },
        async fetchTaskGroups({commit, state}) {
            commit("setLoading", true)
            let r = await (state.activeLab as any).getTaskGroups({order: ["order"]});
            commit("setTaskGroups", r)
            commit("setLoading", false)
        },
        async setActiveDisciplineId({commit, state, dispatch}, disciplineId) {
            commit("setLoading", true)
            commit("setLabs", [])
            commit("setTasks", [])
            commit("setTaskGroups", [])

            if (disciplineId) {
                let discipline = await Discipline.findOne({where: {id: disciplineId}})
                commit("setActiveDiscipline", discipline)
                dispatch("fetchLabs")
                dispatch("fetchActiveDisciplineArticles")
            } else {
                commit("setActiveDiscipline", {})
            }
            commit("setLoading", false)
        },
        async setActiveLabId({commit, state, dispatch}, labId) {
            commit("setLoading", true)
            commit("setLabs", [])
            commit("setTasks", [])
            commit("setTaskGroups", [])

            let lab = await Lab.findOne({where: {id: labId}, include: Discipline})
            let discipline = await (lab as any).getDiscipline();
            await dispatch("setActiveDisciplineId", discipline.id)
            commit("setActiveLab", lab)
            await dispatch("fetchTasks")
            await dispatch("fetchTaskGroups")
            commit("setLoading", false)
        },
        async updateTasksOrder({commit, state, dispatch}, tasks) {
            commit("setLoading", true)
            for (const t of tasks) {
                let index = tasks.indexOf(t);
                t.order = index + 1
                await t.save()
            }
            await dispatch("fetchTasks")
            commit("setLoading", false)
        },
        async updateLabsOrder({commit, state, dispatch}, labs) {
            commit("setLoading", true)
            for (const t of labs) {
                let index = labs.indexOf(t);
                t.order = index + 1
                await t.save()
            }
            await dispatch("fetchLabs")
            commit("setLoading", false)
        },
        async updateTaskGroupsOrder({commit, state, dispatch}, taskGroups) {
            commit("setLoading", true)
            for (const t of taskGroups) {
                let index = taskGroups.indexOf(t);
                t.order = index + 1
                await t.save()
            }
            await dispatch("fetchTaskGroups")
            commit("setLoading", false)
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
        async killJekyllProcess({state}) {
            if (state.jekyllProcess) {
                kill(this.state.jekyllProcess.pid)
                this.state.jekyllProcess = null
            }
        },
        async backupDatabase({state, commit}) {
            let sequelize = ConfigStore.instance.sequelize;

            commit("clearJekyllLog")
            commit("setConsoleActive", true)

            let main_command = `pg_dump -h ${sequelize.host} -U ${sequelize.username} --create --if-exists --clean --file="backup${(new Date().toISOString()).replace(/[-:\\.]/g, "_")}.sql" -v ${sequelize.database}`;
            commit("pushJekyllLogItem", "start dump\n")
            let encoding = "cp1251";
            commit("pushJekyllLogItem", main_command + "\n")
            await execAsync(`${main_command}`, {
                cwd: ConfigStore.instance.userPath,
                encoding: encoding
            }, (data) => {
                let iconv = new Iconv(encoding, 'UTF-8');
                commit("pushJekyllLogItem", `${iconv.convert(data)}\n`)
            });
            commit("pushJekyllLogItem", "dumping complete")
        },
        async runJekyllProcess({state, commit}) {
            if (state.jekyllProcess) {
                kill(this.state.jekyllProcess.pid)
                this.state.jekyllProcess = null
            }
            if (state.activeDiscipline) {
                state.jekyllProcess = child_process.spawn('serve.cmd', {
                    // detached: true,
                    shell: true,
                    cwd: (state.activeDiscipline as Discipline).jekyll_folder,
                });

                state.jekyllProcess.stdout.on('data', (data) => {
                    commit("pushJekyllLogItem", data)
                });

                state.jekyllProcess.on('close', (code) => {
                    commit("pushJekyllLogItem", `child process exited with code ${code}\n`)
                });
            }
        },
        async runDeployProcess({state, commit}, with_git) {
            commit("clearJekyllLog")
            commit("setConsoleActive", true)
            if (state.activeDiscipline) {

                if (with_git) {
                    commit("pushJekyllLogItem", `фиксирую изменения в stage\n`)
                    await spawnAsync(`git add ${(state.activeDiscipline as Discipline).jekyll_folder}`, {
                        shell: true,
                        cwd: (state.activeDiscipline as Discipline).jekyll_folder,
                    }, (data) => {
                        commit("pushJekyllLogItem", `${data}\n`)
                    })

                    commit("pushJekyllLogItem", `пытаюсь создать коммит\n`)
                    await spawnAsync(`git commit -a -m "автоматический коммит из чаинки натуральной"`, {
                        shell: true,
                        cwd: (state.activeDiscipline as Discipline).jekyll_folder
                    }, (data) => {
                        commit("pushJekyllLogItem", `${data}\n`)
                    })

                    commit("pushJekyllLogItem", `отправляю на сервер\n`)
                    await spawnAsync("git push", {
                        shell: true,
                        cwd: (state.activeDiscipline as Discipline).jekyll_folder,
                    }, (data) => {
                        commit("pushJekyllLogItem", `${data}\n`)
                    })
                }
                let params = (state.activeDiscipline as Discipline).deploy_command.split(/\s+/)

                let fab = params[0]
                let cwd = path.dirname((path.dirname((state.activeDiscipline as Discipline).jekyll_folder)));
                console.log(cwd);
                let args = params.splice(1)
                let ps = child_process.spawn(fab, args, {
                    cwd,
                });

                ps.stderr.on('data', (data) => {
                    let content = data.toString().replace(/\n|(\r\n)|(\n\r)/gi, "<br>")
                    content = content.replace(/\s/gi, "&nbsp;")
                    state.jekyllProcessLog.push(content)
                });

                ps.on('error', (err) => {
                    console.log(err)
                    state.jekyllProcessLog.push(`${err}\n`)
                });

                ps.on('close', (code) => {
                    if (code == 0) {
                        commit("setConsoleActive", false)
                    }
                    commit("pushJekyllLogItem", `Процесс завершен с кодом ${code}\n`)
                });
            }
        }
    },
})
