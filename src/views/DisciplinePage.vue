<template>
    <div>
        <b-form-group label="Название">
            <b-input v-model="form.title">
            </b-input>
        </b-form-group>
        <b-form-group label="Путь к папке jekyll">
            <b-input v-model="form.jekyll_folder"></b-input>
        </b-form-group>
        <b-button variant="info" @click="onSaveClick" :disabled="!isSaveEnabled">
            Сохранить
        </b-button>
        <hr>
        <h2>Лабы</h2>
        <div v-for="l in labs" :key="l.id">
            <a href="#" @click="setActiveLabId(l.id)">
                <router-link :to="`/lab/${l.id}`">
                    <i :class="l.icon"></i> {{ l.title }}
                </router-link>
            </a>
        </div>
    </div>
</template>

<script lang="ts">

import {Vue, Watch} from "vue-property-decorator";
import {mapActions, mapState} from "vuex";
import Component from "vue-class-component";
import {IDiscipline} from "../models/Discipline";

@Component({
    computed: {
        ...mapState({
            labs: "labs",
            activeDiscipline: "activeDiscipline",
        }),

    },
    methods: {
        ...mapActions({
            "setActiveLabId": "setActiveLabId",
        }),
    }
})
export default class DisciplinePage extends Vue {
    private activeDiscipline!: any;

    form: IDiscipline = {
        jekyll_folder: "",
        title: ""
    };

    @Watch("activeDiscipline")
    onActiveDisciplineChange() {
        this.form.title = this.activeDiscipline.title;
        this.form.jekyll_folder = this.activeDiscipline.jekyll_folder;
    }

    @Watch("$route", {deep: true, immediate: true})
    onRouteChange() {
        this.$store.dispatch("setActiveDisciplineId", this.$route.params.disciplineId)
    }

    get isSaveEnabled() {
        return this.activeDiscipline.title != this.form.title
            || this.activeDiscipline.jekyll_folder != this.form.jekyll_folder
    }

    onSaveClick() {
        this.activeDiscipline.title = this.form.title;
        this.activeDiscipline.jekyll_folder = this.form.jekyll_folder;
        this.activeDiscipline.save()
    }
}
</script>
