import Vue from 'vue'
import Vuex from 'vuex'
import Discipline from "../models/Discipline";
import Lab from "../models/Lab";

Vue.use(Vuex)



export default new Vuex.Store({
    state: {
        disciplines: [],
        labs: [],
        tasks: [],
        activeDiscipline: {},
        activeLab: {},
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
        setActiveDiscipline(state, discipline) {
            state.activeDiscipline = discipline;
        },
        setActiveLab(state, lab) {
            state.activeLab = lab;
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
        async setActiveDisciplineId({commit, state, dispatch}, disciplineId) {
            let discipline = await Discipline.findOne({where: {id: disciplineId}})
            commit("setActiveDiscipline", discipline)
            dispatch("fetchLabs")
        },
        async setActiveLabId({commit, state, dispatch}, labId) {
            let lab = await Lab.findOne({where: {id: labId}, include: Discipline})
            let discipline = await (lab as any).getDiscipline();
            dispatch("setActiveDisciplineId", discipline.id)
            commit("setActiveLab", lab)
            dispatch("fetchTasks")
        }
    },
    modules: {}
})
