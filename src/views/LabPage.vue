<template>
    <div class="d-flex" style="height: 100%">
        <div class="d-flex flex-column w-100">
            <div class="p-2" style="background-color: #f1f1f1; border-top: 2px solid #e7e7e7">
                <b-container class="pr-4 d-flex justify-content-end">
                    <b-select size="sm" :options="taskGroupsOptions" v-model="activeTaskGroup"></b-select>
                    <b-button-group class="flex-shrink-0">

                        <b-button class="ml-2 flex-shrink-0" size="sm" variant="warning" @click="onCreateTaskGroup"
                                  v-b-modal.newTaskGroupModal>Создать группу
                        </b-button>
                         <b-button class="ml-2 flex-shrink-0" size="sm" variant="warning"
                                  v-b-modal.orderGroupsModal>Упорядочить группы
                        </b-button>
                         <b-button v-if="activeTaskGroup != -1" class="ml-2 flex-shrink-0" size="sm" variant="danger"
                                  @click="onRemoveTaskGroup">Удалить группу
                        </b-button>
                    </b-button-group>
                    <b-button class="ml-2" size="sm" variant="info" @click="onCopyTasksClick">Скопировать</b-button>
                    <b-button class="ml-2" size="sm" variant="info" @click="onAddTaskClick">Добавить</b-button>
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
                @cancel="activeTask=null"
                @save="onSaveTaskClick"
            >
            </task-editor>

        </div>
        <copy-tasks-modal ref="copyTasksModal" @ok="onCopyTasksConfirm"/>
        <b-modal id="newTaskGroupModal" title="Создать новую группу" @ok="onCreateTaskGroupOkClicked">
            <b-form-group>
                <b-input v-model="newTaskGroupTitle"></b-input>
            </b-form-group>
        </b-modal>
        <b-modal id="orderGroupsModal" title="Упорядочить группы">
            <b-list-group>
                <draggable v-model="taskGroups" group="people" @start="drag=true" @end="drag=false">
                    <b-list-group-item v-for="g in taskGroups" :key="g.id">
                        {{g.title}}
                    </b-list-group-item>
                </draggable>
            </b-list-group>
        </b-modal>
    </div>
</template>

<script lang="ts">

import {Vue, Watch} from "vue-property-decorator";
import {mapGetters, mapState} from "vuex";
import Component from "vue-class-component";
import TaskItem from "./TaskItem.vue";
import draggable from 'vuedraggable'
import TaskEditor from "./TaskEditor.vue";
import Task, {ITask} from "../models/Task";
import {ComplexityTypes} from "../consts";
import _ from 'lodash';
import Discipline from "../models/Discipline";
import CopyTasksModal from "./CopyTasksModal.vue";
import TaskGroup from "../models/TaskGroup";
import has = Reflect.has;

@Component({
    components: {CopyTasksModal, TaskEditor, TaskItem, draggable},
    computed: {
        ...mapState({
            activeDiscipline: "activeDiscipline",
            activeLab: "activeLab",
        }),
    }
})
export default class LabPage extends Vue {
    public activeTask: any = null;
    public activeLab!: any;
    public activeTaskGroup = -1;
    public newTaskGroupTitle = "";

    @Watch("$route", {deep: true, immediate: true})
    onRouteChange() {
        this.$store.dispatch("setActiveLabId", this.$route.params.labId)
    }

    get tasks() {
        return this.$store.state.tasks.filter(x => {
            return (this.activeTaskGroup == -1 && x.group_id == null) || x.group_id == this.activeTaskGroup
        });
    }

    set tasks(tasks) {
        this.$store.commit("setTasks", tasks)
        this.$store.dispatch("updateTasksOrder", tasks)
    }

    get taskGroups() {
        return this.$store.state.taskGroups;
    }

    set taskGroups(taskGroups) {
        this.$store.commit("setTaskGroups", taskGroups)
        this.$store.dispatch("updateTaskGroupsOrder", taskGroups)
    }

    get taskGroupsOptions() {
        return [{value: -1, text: "без группы"}, ...this.taskGroups.map(x => {
            return {
                value: x.id,
                text: x.title,
            }
        })]
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

    async onSaveTaskClick(task_form: ITask, buttonClicked) {
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

        if (isNew || buttonClicked) {
            this.activeTask = null;
            await this.$store.dispatch("fetchTasks")
        }
    }

    async onAddTaskClick() {
        let task = Task.build({
            title: "",
            order: (_(this.tasks).map(x => x.order).max() + 1) || 0,
            custom_class: "",
            content: "",
            complexity: ComplexityTypes.easy,
            additional_content: "",
            visible: true,
            group_id: this.activeTaskGroup == -1 ? null : this.activeTaskGroup,
            lab_id: this.activeLab.id,
        })
        this.activeTask = task;
    }

    async onCopyTasksClick() {
        (this.$refs.copyTasksModal as any).show()
    }

    async onCopyTasksConfirm(tasks) {
        for (const t of tasks) {
            let data = t.get({plain: true})
            delete data.id
            data.lab_id = this.activeLab.id
            data.LabId = this.activeLab.id
            data.group_id = this.activeTaskGroup == -1 ? null : this.activeTaskGroup
            data.TaskGroupId = this.activeTaskGroup == -1 ? null : this.activeTaskGroup
            await Task.create(data)
            await this.$store.dispatch("fetchTasks")
        }
    }

    async onCreateTaskGroup() {
        this.newTaskGroupTitle = ""
    }

    async onRemoveTaskGroup() {
        let has_subtasks = await Task.count({
            where: {group_id: this.activeTaskGroup}
        })

        if (has_subtasks) {
            await this.$bvModal.msgBoxOk(
                'У группы есть задачи, не могу ее удалить', {
                    title: 'Бесполезно',
                    size: 'md',
                    okVariant: 'info',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                })
            return;
        }

        let doDelete = await this.$bvModal.msgBoxConfirm(
            `Точно удалить группу?`, {
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
            await TaskGroup.destroy({
                where: {
                    id: this.activeTaskGroup
                }
            });
            await this.$store.dispatch("fetchTaskGroups")
            this.activeTaskGroup = -1
        }
    }

    async onCreateTaskGroupOkClicked() {
        let order = _(this.taskGroups).map((x: TaskGroup) => x.order || 0).max()
        let task_group = TaskGroup.build({
            lab_id: this.activeLab.id,
            title: this.newTaskGroupTitle,
            type: this.activeLab.type,
            order: order + 1,
        })
        await task_group.save()
        await this.$store.dispatch("fetchTaskGroups")
        this.activeTaskGroup = task_group.id
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


