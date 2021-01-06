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
                    <task-item class="m-2"
                               :task="t"
                               v-for="t in tasks"
                               :key="t.id"
                               :active-task="activeTask"
                               @edit="onEdit(t)"
                               @remove="onRemove(t)"
                    ></task-item>
                </div>
            </div>
            <task-editor
                class="task-editor"
                style=" box-sizing: border-box"
                :class="{'active': !!activeTask}"
                :task="activeTask"
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


@Component({
    components: {TaskEditor, TaskItem},
    computed: {
        ...mapState({
            tasks: "tasks",
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

    onEdit(task) {
        if (this.activeTask == task) {
            this.activeTask = null
        } else {
            this.activeTask = task;
        }
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
        // this.activeTask.tags = task_form.tags;
        this.activeTask.order = task_form.order;
        // this.activeTask.group_id = task_form.group_id;
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
            order: 0,
            custom_class: "",
            content: "",
            complexity: ComplexityTypes.easy,
            additional_content: "",
            visible: true,
            lab_id: this.activeLab.id,
        })
        this.activeTask = task;
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


