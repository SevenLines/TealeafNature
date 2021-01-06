<template>
    <div>

        <task-item class="m-2"
                   :task="t"
                   v-for="t in tasks"
                   :key="t.id"
                   :active-task="activeTask"
            @edit="onEdit(t)"
        ></task-item>
        <task-editor
            class="task-editor"
            :class="{'active': !!activeTask}"
            :task="activeTask"
            @cancel="activeTask=null"
        >
        </task-editor>
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
    padding: 1em;
    position: fixed;
    width: 100%;
    height: 50vh;
    left: 0;
    bottom: -50vh;
    background-color: white;
    transition: all 0.3s;
    animation-timing-function: ease-out;
    z-index: 9999;
    &.active {
        bottom: 0;
    }
}
</style>


