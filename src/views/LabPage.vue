<template>
    <div class="d-flex" style="height: 100%">
        <div class="d-flex flex-column w-100">
            <div class="flex-grow-1 overflow-auto p-2">
                <div class="container">
                    <task-item class="m-2"
                               :task="t"
                               v-for="t in tasks"
                               :key="t.id"
                               :active-task="activeTask"
                               @edit="onEdit(t)"
                    ></task-item>
                </div>
            </div>
            <task-editor
                class="task-editor"
                style=" box-sizing: border-box"
                :class="{'active': !!activeTask}"
                :task="activeTask"
                @cancel="activeTask=null"
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


