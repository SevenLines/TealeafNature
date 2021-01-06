<template>
    <div>
        <div class="d-flex justify-content-between mb-4">
            <b-button size="sm" class="mr-2" variant="danger" @click="onSaveClick">Сохранить</b-button>
            <b-button size="sm" variant="info" @click="$emit('cancel')">Отменить</b-button>
        </div>
        <div v-show="form" class="row">
            <div class="col">
                <label for="">Описание</label>
                <markdown-editor v-model="form.content" min-height="200px" max-height="200px"></markdown-editor>
            </div>
            <div class="col">
                <label for="">Подсказка</label>
                <markdown-editor v-model="form.additional_content" min-height="200px"
                                 max-height="200px"></markdown-editor>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import {Prop, Vue, Watch} from "vue-property-decorator";
import MarkdownEditor from "./MarkdownEditor.vue";
import {ITask} from "../models/Task";

@Component({
    components: {MarkdownEditor}
})
export default class TaskEditor extends Vue {
    @Prop() task!: any;

    form: ITask | null = {
        title: null,
        tags: null,
        order: null,
        group_id: null,
        custom_class: null,
        content: "",
        complexity: null,
        additional_content: "",
        visible: null,
    };

    @Watch("task")
    onTaskChange() {
        this.form = {
            title: this.task ? this.task.title : null,
            tags: this.task ? this.task.tags : null,
            order: this.task ? this.task.order : null,
            group_id: this.task ? this.task.group_id : null,
            custom_class: this.task ? this.task.custom_class : null,
            content: this.task ? this.task.content : "",
            complexity: this.task ? this.task.complexity : null,
            additional_content: this.task ? this.task.additional_content : "",
            visible: this.task ? this.task.visible : null,
        }
    }


    onSaveClick() {
        this.$emit("save")
    }
}
</script>

<style scoped>

</style>