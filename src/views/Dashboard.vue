<template>
    <div class="container mt-4">
        <h2>Дисциплины
            <button v-b-modal.disciplineEditModel class="btn btn-sm btn-primary">
                <i class="fas fa-plus"></i></button>
        </h2>
        <div class="d-flex align-items-center justify-content-between border-bottom p-1 pl-0" v-for="d in disciplines"
             :key="d.id">
            <div>
                <b-button v-if="d.site_url" class="mr-2" size="sm" variant="outline-primary" @click="onSiteUrlClick(d)">
                    <i class="fad fa-link"></i>
                </b-button>
                <router-link :to="`/discipline/${d.id}`">
                    {{ d.title }}
                </router-link>
            </div>
            <div>

                <b-button class="ml-4" size="sm" variant="outline-danger" @click="onRemove(d)">
                    <i class="fad fa-trash"></i>
                </b-button>
            </div>
        </div>

        <b-modal size="lg" id="disciplineEditModel" title="Добавить новую дисциплину" @ok="onDisciplineSaveClick">
            <b-form-group label="Название">
                <b-input v-model="newDisciplineTitle"></b-input>
            </b-form-group>
            <b-form-group label="Папка jekyll">
                <b-input v-model="newDisciplineJekyllFolder"></b-input>
            </b-form-group>
        </b-modal>
    </div>
</template>

<script lang="ts">

import {Vue, Watch} from "vue-property-decorator";
import {mapActions, mapState} from "vuex";
import Component from "vue-class-component";
import Discipline from "../models/Discipline";
import {shell} from "electron";

@Component({
    computed: {
        ...mapState({
            disciplines: "disciplines"
        }),

    },
    methods: {
        ...mapActions({
            setActiveDiscipline: "setActiveDiscipline",
            fetchDisciplines: "fetchDisciplines",
        }),
    },

})
export default class Dashboard extends Vue {
    newDisciplineTitle: string = "";
    newDisciplineJekyllFolder: string = "";

    created() {
        this.$store.dispatch("fetchDisciplines")
    }

    async onDisciplineSaveClick() {
        let discipline = Discipline.build({
            title: this.newDisciplineTitle,
            jekyll_folder: this.newDisciplineJekyllFolder,
        })
        await discipline.save();
        this.$store.dispatch("fetchDisciplines")
        this.$router.push({name: 'DisciplinePage', params: {disciplineId: discipline.id.toString()}})
    }

    async onRemove(discipline) {
        let doDelete = await this.$bvModal.msgBoxConfirm(
            `Точно удалить дисциплину ${discipline.title}?`, {
                title: 'Подтвердите',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'Удалить',
                cancelTitle: 'НЕЕЕЕТ!!!',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            })
        if (doDelete) {
            await discipline.destroy();
            await this.$store.dispatch("fetchDisciplines")
        }
    }

    onSiteUrlClick(d) {
        shell.openExternal(d.site_url);
    }
}
</script>
