import Vue from 'vue'
import Vuex from 'vuex'
import Discipline from "../models/Discipline";

Vue.use(Vuex)



export default new Vuex.Store({
    state: {
        disciplines: [],
        labs: [],
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
        setActiveDiscipline(state, discipline) {
            state.activeDiscipline = discipline;
        },
        setActiveLab(state, lab) {
            state.activeLab = lab;
        },
    },
    actions: {
        async fetchDisciplines({commit}) {
            let r = await Discipline.findAll();
            commit("setDisciplines", r)
        },
        async fetchLabs({commit, state}) {
            let r = await (state.activeDiscipline as any).getLabs();
            commit("setLabs", r)
        },
        async setActiveLab({commit, state, dispatch}, discipline) {
            commit("setActiveDiscipline", discipline)
            dispatch("fetchLabs")
        }
    },
    modules: {}
})
