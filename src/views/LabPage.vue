<template>
    <div class="d-flex" style="height: 100%">
        <div class="d-flex flex-column w-100">
            <div class="p-2" style="background-color: #f1f1f1; border-top: 2px solid #e7e7e7">
                <b-container class="pr-4 d-flex justify-content-end">
                    <b-button size="sm" variant="info" @click="onAddTaskClick">Добавить</b-button>
                </b-container>
            </div>
            <div class="flex-grow-1 overflow-auto p-2">
                <div class="container">
                    <draggable v-model="tasks" group="people" @start="drag=true" @end="drag=false">
                        <task-item class="m-2"
                                   :task="t"
                                   v-for="t in tasks"
                                   :key="t.id"
                                   :active-task="activeTask"
                                   :preview-render-func="previewRenderFunc"
                                   @edit="onEdit(t)"
                                   @eye="onEyeClick(t)"
                                   @remove="onRemove(t)"
                        ></task-item>
                    </draggable>
                </div>
            </div>
            <task-editor
                class="task-editor"
                style=" box-sizing: border-box"
                :class="{'active': !!activeTask}"
                :task="activeTask"
                :preview-render-func="previewRenderFunc"
                :on-upload="onUpload"
                @cancel="activeTask=null"
                @save="onSaveTaskClick"
            >
            </task-editor>
        </div>
    </div>
</template>

<script lang="ts">

import {Vue, Watch} from "vue-property-decorator";
import {mapState} from "vuex";
import Component from "vue-class-component";
import TaskItem from "./TaskItem.vue";
import draggable from 'vuedraggable'
import TaskEditor from "./TaskEditor.vue";
import Task, {ITask} from "../models/Task";
import {ComplexityTypes} from "../consts";
import _ from 'lodash';
import path from "path";
import marked from "marked";
import fs from "fs";
import {Buffer} from "buffer";

@Component({
    components: {TaskEditor, TaskItem, draggable},
    computed: {
        ...mapState({
            activeDiscipline: "activeDiscipline",
            activeLab: "activeLab",
        })
    }
})
export default class LabPage extends Vue {
    public activeTask: any = null;

    @Watch("$route", {deep: true, immediate: true})
    onRouteChange() {
        this.$store.dispatch("setActiveLabId", this.$route.params.labId)
    }

    get tasks() {
        return this.$store.state.tasks;
    }

    set tasks(tasks) {
        this.$store.commit("setTasks", tasks)
        this.$store.dispatch("updateTasksOrder", tasks)
    }

    onEdit(task) {
        if (this.activeTask == task) {
            this.activeTask = null
        } else {
            this.activeTask = task;
        }
    }

    async onEyeClick(task) {
        task.visible = !task.visible
        await task.save()
    }

    async onRemove(task) {
        let doDelete = await this.$bvModal.msgBoxConfirm(
            'Точно удалить задачу?', {
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
            await task.destroy();
            await this.$store.dispatch("fetchTasks")
        }
    }

    async onSaveTaskClick(task_form: ITask) {
        this.activeTask.title = task_form.title;
        this.activeTask.order = task_form.order;
        this.activeTask.custom_class = task_form.custom_class;
        this.activeTask.content = task_form.content;
        this.activeTask.complexity = task_form.complexity;
        this.activeTask.additional_content = task_form.additional_content;
        this.activeTask.visible = task_form.visible;

        let isNew = !this.activeTask.id;

        await this.activeTask.save()
        this.$notify({
            group: 'messages',
            title: 'Database',
            type: 'success',
            duration: 500,
            text: 'Successfully task saved!'
        });

        if (isNew) {
            this.activeTask = null;
            await this.$store.dispatch("fetchTasks")
        }
    }

    async onAddTaskClick() {
        let task = Task.build({
            title: "",
            order: _(this.tasks).map(x => x.order).max() + 1,
            custom_class: "",
            content: "",
            complexity: ComplexityTypes.easy,
            additional_content: "",
            visible: true,
            lab_id: this.activeLab.id,
        })
        this.activeTask = task;
    }

    async onUpload(file: File) {
        let assets_folder = path.join('assets', "tasks");
        let folder = path.join(this.activeDiscipline.jekyll_folder, assets_folder)

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }

        let length = fs.readdirSync(folder).length
        let filename = `${String(length).padStart(3, '0')}_${file.name.trim()}`

        console.log(filename)

        let arrayBuffer = await file.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer);
        fs.writeFile(path.join(folder, filename), (buffer as any), err => {
            if (err) return console.log(err);
        })

        return {
            link: path.join("/", assets_folder, filename).replace(/\s/, "%20").replace(/\\/g, "/"),
        }
    }

    previewRenderFunc(text: string) {
        let dir = "file://" + this.activeDiscipline.jekyll_folder.replace(/\\/g, "/");
        text = text.replace(/(!\[.*?\]\()(\/assets.*?)(\))/g, `$1${dir}$2$3`)
        text = marked(text)
        return text;
    }
}
</script>

<style lang="scss">
.task-editor {
    box-shadow: 0 0 4px silver;

    width: 100%;
    height: 0;
    overflow: hidden;
    flex-basis: 0;

    left: 0;
    background-color: white;
    transition: all 0.3s;
    animation-timing-function: ease-out;

    &.active {
        padding: 1em;
        flex-basis: 500px;
        flex-shrink: 0;
        overflow: hidden;
    }
}
</style>


