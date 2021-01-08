<template>
    <b-modal ref="modal" title="Скопировать задачи"
             @show="onShow"
             size="lg"
    >
        <b-form-group>
            <b-select v-model="activeCopyTasksDiscipline"
                      :options="copTasksDisciplinesOptions"></b-select>
        </b-form-group>
        <b-form-group v-if="copTasksLabsOptions">
            <b-select v-model="activeCopyTasksLab" :options="copTasksLabsOptions"></b-select>
        </b-form-group>

        <div v-for="task in tasks" :key="task.id">
            <task-item
                :task="task"
                :with-edit-bar="false"
                :with-selected-check-box="true"
                :selected="tasksToCopy.indexOf(task) >= 0"
                @click="onTaskClick(task)"
            ></task-item>
        </div>
    </b-modal>
</template>

<script lang="ts">
import Component from "vue-class-component";
import {Vue, Watch} from "vue-property-decorator";
import Discipline from "../models/Discipline";
import Lab from "../models/Lab";
import Task from "../models/Task";
import TaskItem from "./TaskItem.vue";

@Component({
    components: {TaskItem}
})
export default class CopyTasksModal extends Vue {
    public activeCopyTasksDiscipline = null;
    public activeCopyTasksLab = null;

    public labs = [];
    public tasks = [];
    public tasksToCopy = []

    async onShow() {
        await this.$store.dispatch("fetchDisciplines")
    }


    @Watch("activeCopyTasksDiscipline")
    async onActiveCopyTasksDisciplineChanged() {
        this.labs = await Lab.findAll({
            where: {
                discipline_id: this.activeCopyTasksDiscipline
            }
        })
        this.tasks = []
    }

    @Watch("activeCopyTasksLab")
    async onActiveCopyTasksLabsChanged() {
        this.tasks = await Task.findAll({
            where: {
                lab_id: this.activeCopyTasksLab
            },
            order: [
                ["group_id", "ASC"],
                ["order", "ASC"],
            ]
        })
    }


    get copTasksDisciplinesOptions() {
        let disciplines = this.$store.state.disciplines
        return disciplines.map((d: Discipline) => {
            return {
                value: d.id,
                text: d.title,
            }
        })
    }

    get copTasksLabsOptions() {
        return this.labs?.map((l: Lab) => {
            return {
                value: l.id,
                text: l.title,
            }
        })
    }

    show() {
        (this.$refs.modal as any).show();
    }

    onTaskClick (task) {
        if (this.tasksToCopy.indexOf(task) >= 0) {
            this.tasksToCopy = this.tasksToCopy.filter(x => x != task)
        } else {
            this.tasksToCopy = [...this.tasksToCopy, task]
        }
    }
}
</script>

<style scoped>

</style>