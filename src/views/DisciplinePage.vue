<template>
    <div class="container mt-4">
        <b-form-group label="Название">
            <b-input v-model="form.title">
            </b-input>
        </b-form-group>
        <b-form-group label="Путь к папке jekyll">
            <b-input-group>
                <b-input v-model="form.jekyll_folder"></b-input>
                <b-input-group-addon>
                    <b-button variant="info" size="sm" @click="onJekyllFolderSelect">...</b-button>
                </b-input-group-addon>
            </b-input-group>
        </b-form-group>
        <b-button variant="info" @click="onSaveClick" :disabled="!isSaveEnabled">
            Сохранить
        </b-button>
        <hr>
        <div class="row">
            <div class="col">
                <h2>Лабы
                    <button v-b-modal.labEditModel class="btn btn-sm btn-primary" @click="onLabAddClick"><i
                        class="fas fa-plus"></i></button>
                </h2>
                <draggable v-model="labs" group="people" @start="drag=true" @end="drag=false">
                    <div class="d-flex align-items-center justify-content-between border-bottom p-1 pl-0"
                         v-for="l in labs" :key="l.id">
                        <div>
                            <a href="#" @click="setActiveLabId(l.id)">
                                <router-link :to="`/lab/${l.id}`">
                                    <i :class="l.icon"></i> {{ l.title }}
                                </router-link>
                            </a>
                        </div>
                        <div>
                            <b-button v-b-modal.labEditModel class="ml-2" size="sm" variant="outline-info"
                                      @click="onLabEditClick(l)">
                                <i class="fad fa-edit"></i>
                            </b-button>
                            <b-button class="ml-2" size="sm" variant="outline-danger" @click="onRemove(l)">
                                <i class="fad fa-trash"></i>
                            </b-button>
                        </div>
                    </div>
                </draggable>
            </div>
            <div class="col ml-4">
                <h2>Статьи
                    <button class="btn btn-sm btn-warning"><i class="fas fa-plus"></i></button>
                </h2>
                <div v-for="f in activeDisciplineArticles" :key="f.name">
                    <router-link :to="`/discipline/${activeDiscipline.id}/article/${f}`">
                        {{ f }}
                    </router-link>
                </div>
            </div>
        </div>

        <b-modal size="xl" id="labEditModel" :title="labToEditForm.title" @ok="onLabSaveClick">
            <b-form-row>
                <b-col>
                    <b-form-group label="Название">
                        <b-input v-model="labToEditForm.title"/>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Иконка">
                        <b-input-group>
                            <b-input v-model="labToEditForm.icon"/>
                            <b-input-group-append>
                                <b-button variant="info">
                                    <i :class="labToEditForm.icon"></i>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>
            </b-form-row>

            <b-form-row>
                <b-col>
                    <b-form-group label="Алиас">
                        <b-input v-model="labToEditForm.alias"/>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Номер">
                        <b-input v-model="labToEditForm.order"/>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Ремарка">
                        <b-input v-model="labToEditForm.remark"/>
                    </b-form-group>
                </b-col>
            </b-form-row>


            <b-form-row>
                <b-col>
                    <b-form-group label="Описание">
                        <markdown-editor v-model="labToEditForm.content"
                                         min-height="200px"
                                         max-height="200px"
                                         :preview-render-func="previewRenderFuncProxy"
                                         :upload-func="uploadFileFuncProxy"
                        />
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Описание">
                        <markdown-editor v-model="labToEditForm.content_additional"
                                         min-height="200px"
                                         max-height="200px"
                                         :preview-render-func="previewRenderFuncProxy"
                                         :upload-func="uploadFileFuncProxy"
                        />
                    </b-form-group>
                </b-col>
            </b-form-row>
        </b-modal>
    </div>
</template>

<script lang="ts">

import {Vue, Watch} from "vue-property-decorator";
import {mapActions, mapGetters, mapState} from "vuex";
import Component from "vue-class-component";
import {IDiscipline} from "../models/Discipline";
import MarkdownEditor from "./MarkdownEditor.vue";
import Lab, {ILab} from "../models/Lab";
import {previewRenderFunc, uploadFileFunc} from "../utils";
import draggable from 'vuedraggable'
import _ from "lodash";

const {dialog} = require('electron').remote


@Component({
    components: {
        MarkdownEditor,
        draggable
    },
    computed: {
        ...mapState({
            activeDiscipline: "activeDiscipline",
        }),
        ...mapGetters({
            activeDisciplineArticles: "activeDisciplineArticles",
        })
    },
    methods: {
        ...mapActions({
            "setActiveLabId": "setActiveLabId",
        }),
    }
})
export default class DisciplinePage extends Vue {
    private activeDiscipline!: any;
    labToChange: any;
    labToEditForm: ILab = {
        alias: "",
        title: "",
        order: 0,
        icon: "",
        type: 0,
        content: "",
        content_additional: "",
        remark: "",
    }

    form: IDiscipline = {
        jekyll_folder: "",
        title: ""
    };

    get labs() {
        return this.$store.state.labs;
    }

    set labs(labs) {
        this.$store.commit("setLabs", labs)
        this.$store.dispatch("updateLabsOrder", labs)
    }

    previewRenderFuncProxy(text: string) {
        return previewRenderFunc(text, this.$store.state.activeDiscipline.jekyll_folder)
    }

    uploadFileFuncProxy(file: File) {
        return uploadFileFunc(file, this.$store.state.activeDiscipline.jekyll_folder)
    }

    @Watch("activeDiscipline", {deep: true})
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

    updateLabToEditForm() {
        this.labToEditForm = {
            alias: this.labToChange.alias,
            title: this.labToChange.title,
            order: this.labToChange.order,
            icon: this.labToChange.icon,
            type: this.labToChange.type,
            content: this.labToChange.content,
            content_additional: this.labToChange.content_additional,
            remark: this.labToChange.remark,
        }
    }

    onLabEditClick(lab) {
        this.labToChange = lab;
        this.updateLabToEditForm()
    }

    onLabAddClick(lab) {
        this.labToChange = Lab.build({
            alias: "",
            title: "Новая",
            order: (_(this.labs).map(x => x.order).max() + 1) || 0,
            icon: "",
            type: 0,
            content: "",
            content_additional: "",
            remark: "",
            discipline_id: this.activeDiscipline.id,
        });
        this.updateLabToEditForm()
    }

    async onLabSaveClick() {
        if (this.labToChange != null) {
            this.labToChange.alias = this.labToEditForm.alias;
            this.labToChange.title = this.labToEditForm.title;
            this.labToChange.order = this.labToEditForm.order;
            this.labToChange.icon = this.labToEditForm.icon;
            this.labToChange.type = this.labToEditForm.type;
            this.labToChange.content = this.labToEditForm.content;
            this.labToChange.content_additional = this.labToEditForm.content_additional;
            this.labToChange.remark = this.labToEditForm.remark;

            let isNew = !this.labToChange.id;

            await this.labToChange.save()

            if (isNew) {
                await this.$store.dispatch("fetchLabs")
            }
        }
    }

    async onRemove(lab) {
        let doDelete = await this.$bvModal.msgBoxConfirm(
            `Точно удалить лабу ${lab.title}?`, {
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
            await lab.destroy();
            await this.$store.dispatch("fetchLabs")
        }
    }

    async onJekyllFolderSelect() {
        let result = dialog.showOpenDialogSync({
            defaultPath: this.activeDiscipline.jekyll_folder,
            properties: ['openDirectory']
        })
        if (result) {
            this.activeDiscipline.jekyll_folder = result[0];
            await this.activeDiscipline.save()
        }
    }

}
</script>
