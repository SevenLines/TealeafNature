<template>
    <div class="d-flex" style="height: 100%">
        <div class="d-flex flex-column w-100">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <b-form-group label="Название">
                            <b-input v-model="form.title">
                            </b-input>
                        </b-form-group>
                    </div>
                    <div class="col">
                        <b-form-group label="Путь к папке jekyll">
                            <b-input-group>
                                <b-input v-model="form.jekyll_folder"></b-input>
                                <b-input-group-addon>
                                    <b-button variant="info" size="sm" @click="onJekyllFolderSelect">...</b-button>
                                </b-input-group-addon>
                            </b-input-group>
                        </b-form-group>
                    </div>
                </div>
                <b-form-group label="Скрипт для деплоя">
                    <b-input v-model="form.deploy_command">
                    </b-input>
                </b-form-group>
                <b-form-group label="Ссылка на сайт">
                    <b-input-group>
                        <b-input v-model="form.site_url">
                        </b-input>
                        <b-input-group-append>
                            <b-button @click="onSiteUrlClick" type="link"><i class="fas fa-link"></i></b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
                <div class="d-flex justify-content-between">
                    <b-button variant="info" @click="onSaveClick" :disabled="!isSaveEnabled">
                        Сохранить
                    </b-button>
                    <div>
                        <b-button-group>
                            <b-button class="ml-2" variant="warning" @click="onGenerateClick">
                                Сгенерировать
                            </b-button>
                            <b-button class="ml-2" variant="warning" @click="onRunProcessClick">
                                Запустить
                            </b-button>
                        </b-button-group>
                        <b-button class="ml-2" variant="danger" @click="onDeployClick">
                            Задеплоить
                        </b-button>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col">
                        <h2>Лабы
                            <button v-b-modal.labEditModel class="btn btn-sm btn-primary" @click="onLabAddClick"><i
                                class="fas fa-plus"></i></button>
                        </h2>
                    </div>
                    <div class="col ml-4">
                        <h2>Статьи
                            <button class="btn btn-sm btn-warning" v-b-modal.addMarkdownFileModal><i
                                class="fas fa-plus"></i></button>
                        </h2>
                    </div>
                </div>
            </div>
            <div class="container flex-grow-1 overflow-hidden">
                <div class="row" style="height: 100%">
                    <div class="col overflow-auto" style="height: calc(100% - 2em)">
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
                                    <b-button class="ml-2" size="sm" variant="outline-info"
                                              @click="onToggleEye(l)">
                                        <i class="fad" :class="{'fa-eye': l.visible, 'fa-eye-slash': !l.visible}"></i>
                                    </b-button>
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
                    <div class="col ml-4 overflow-auto" style="height: calc(100% - 2em)">
                        <div class="d-flex align-items-center justify-content-between border-bottom p-1 pl-0"
                             v-for="f in activeDisciplineArticles" :key="f.name">
                            <div>
                                <router-link :to="`/discipline/${activeDiscipline.id}/article/${f.title}`">
                                    {{ f.title }}
                                </router-link>
                            </div>
                            <div>
                                <b-button @click="onOpenMarkdownLink(f)" class="ml-2" size="sm" variant="outline-info">
                                    <i class="fad fa-link"></i>
                                </b-button>
                                <b-button class="ml-2" size="sm" variant="outline-danger"
                                          @click="onRemoveMarkdownFile(f)">
                                    <i class="fad fa-trash"></i>
                                </b-button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <b-modal id="addMarkdownFileModal"
                     @show="markdownFileFormPermalink=''; markdownFileFormTitle=''"
                     @ok="onAddMarkdownFileOk"
                     ok-title="Добавить"
                     cancel-title="Отмена"
                     title="Добавление нового markdown файла"
            >
                <b-form-group label="permalink">
                    <b-input v-model="markdownFileFormPermalink"></b-input>
                </b-form-group>
                <b-form-group label="title">
                    <b-input v-model="markdownFileFormTitle"></b-input>
                </b-form-group>
            </b-modal>

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
    </div>
</template>

<script lang="ts">

import {Vue, Watch} from "vue-property-decorator";
import {mapActions, mapGetters, mapState} from "vuex";
import Component from "vue-class-component";
import Discipline from "../models/Discipline";
import MarkdownEditor from "./MarkdownEditor.vue";
import Lab from "../models/Lab";
import {previewRenderFunc, uploadFileFunc} from "../utils";
import draggable from 'vuedraggable'
import _ from "lodash";
import * as fs from "fs";
import path from "path";
import {shell} from "electron";

const {dialog} = require('electron').remote


@Component({
    components: {
        MarkdownEditor,
        draggable
    },
    computed: {
        ...mapState({
            activeDiscipline: "activeDiscipline",
            activeDisciplineArticles: "activeDisciplineArticles",
        }),
    },
    methods: {
        ...mapActions({
            "setActiveLabId": "setActiveLabId",
        }),
    }
})
export default class DisciplinePage extends Vue {
    private activeDiscipline!: Discipline;
    labToChange: any;
    labToEditForm: any = {
        alias: "",
        title: "",
        order: 0,
        icon: "",
        type: 0,
        content: "",
        content_additional: "",
        remark: "",
        visible: true,
    }

    form: any = {
        jekyll_folder: "",
        title: "",
        deploy_command: "",
        site_url: "",
    };

    markdownFileFormPermalink: string = "";
    markdownFileFormTitle: string = "";

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
        this.form.deploy_command = this.activeDiscipline.deploy_command;
        this.form.site_url = this.activeDiscipline.site_url;
    }

    @Watch("$route", {deep: true, immediate: true})
    onRouteChange() {
        this.$store.dispatch("setActiveDisciplineId", this.$route.params.disciplineId)
    }

    get isSaveEnabled() {
        return this.activeDiscipline.title != this.form.title
            || this.activeDiscipline.jekyll_folder != this.form.jekyll_folder
            || this.activeDiscipline.deploy_command != this.form.deploy_command
            || this.activeDiscipline.site_url != this.form.site_url
    }

    onSaveClick() {
        this.activeDiscipline.title = this.form.title;
        this.activeDiscipline.jekyll_folder = this.form.jekyll_folder;
        this.activeDiscipline.deploy_command = this.form.deploy_command;
        this.activeDiscipline.site_url = this.form.site_url;
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

    async onGenerateClick() {
        await this.activeDiscipline.generateLabsYaml()
    }

    onRunProcessClick() {
        this.$store.dispatch("runJekyllProcess")
    }

    async onDeployClick() {
        let createGit = await this.$bvModal.msgBoxConfirm(
            `Создать git коммит?`, {
                title: 'Подтвердите',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'Создать коммит',
                cancelTitle: 'Не надо',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            })
        this.$store.dispatch("runDeployProcess", !!createGit)
    }

    async onToggleEye(lab: Lab) {
        lab.visible = !lab.visible;
        await lab.save()
    }

    async onAddMarkdownFileOk() {
        let pth = path.join(this.activeDiscipline.jekyll_folder, "common", `${this.markdownFileFormTitle}.md`)
        let content = `---
layout: page
permalink: ${this.markdownFileFormPermalink}
title: ${this.markdownFileFormTitle}
toc: true
---`
        await fs.writeFile(pth, content, err => {
            if (err) {
                console.error(err)
            }
            this.$store.dispatch("fetchActiveDisciplineArticles")
        })
    }

    async onRemoveMarkdownFile(file) {
        console.log(file)
        let doDelete = await this.$bvModal.msgBoxConfirm(
            `Точно удалить файл ${file.title}?`, {
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
            fs.unlinkSync(file.path)
            await this.$store.dispatch("fetchActiveDisciplineArticles")
        }
    }

    onOpenMarkdownLink(f) {
        let href = `http://localhost:4000/${f.permalink}`
        shell.openExternal(href);
    }

    onSiteUrlClick(f) {
        shell.openExternal(this.activeDiscipline.site_url);
    }
}
</script>
