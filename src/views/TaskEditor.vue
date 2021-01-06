<template>
    <div>
        <div class="d-flex justify-content-between mb-4">
            <b-button size="sm" class="mr-2" variant="danger" @click="onSaveClick">Сохранить</b-button>
            <difficult-selector v-model="form.complexity"></difficult-selector>
            <b-button size="sm" variant="info" @click="$emit('cancel')">Отменить</b-button>
        </div>
        <div v-show="form" class="row">
            <div class="col">
                <label>Описание</label>
                <markdown-editor v-model="form.content"
                                 min-height="200px"
                                 max-height="200px"
                                 :preview-render-func="previewRenderFunc"
                                 :upload-func="onUpload"
                />
            </div>
            <div class="col">
                <label>Подсказка</label>
                <markdown-editor v-model="form.additional_content"
                                 min-height="200px"
                                 max-height="200px"
                                 :preview-render-func="previewRenderFunc"
                                 :upload-func="onUpload"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import {Prop, Vue, Watch} from "vue-property-decorator";
import MarkdownEditor from "./MarkdownEditor.vue";
import {ITask} from "../models/Task";
import DifficultSelector from "./DifficultSelector.vue";

@Component({
    components: {DifficultSelector, MarkdownEditor}
})
export default class TaskEditor extends Vue {
    @Prop() task!: any;
    @Prop() previewRenderFunc!: any;
    @Prop() onUpload!: any;

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
        this.$emit("save", this.form)
    }

    mounted() {
        document.addEventListener("keydown", this.onKey);
    }

    beforeDestroy() {
        document.removeEventListener("keydown", this.onKey);
    }

    onKey(e: any) {
        if (e.ctrlKey && (e.which == 83)) {
            e.preventDefault();
            this.onSaveClick()
        }
    }
}
</script>

<style scoped>

</style>