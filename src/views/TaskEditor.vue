<template>
    <div>
        <div class="d-flex justify-content-between mb-4">
            <b-button size="sm" class="mr-2" variant="danger" @click="onSaveClick(true);">Сохранить</b-button>
            <difficult-selector v-model="form.complexity"></difficult-selector>
            <b-button size="sm" variant="info" @click="$emit('cancel')">Отменить</b-button>
        </div>
        <div class="row mb-2">
            <div class="col">
                <input v-model="form.title" placeholder="Название" type="text" class="form-control">
            </div>
            <div class="col-auto">
                <div class="btn btn-info" @click="$emit('edit-subtask-clicked')">Сабтаски
                <span class="badge badge-light" v-if="task.subtasks">{{ task.subtasks.length }}</span></div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <label>Описание</label>
                <markdown-editor v-model="form.content"
                                 min-height="200px"
                                 max-height="200px"
                                 :preview-render-func="previewRenderFuncProxy"
                                 :upload-func="uploadFileFuncProxy"
                />
            </div>
            <div class="col">
                <label>Подсказка</label>
                <markdown-editor v-model="form.additional_content"
                                 min-height="200px"
                                 max-height="200px"
                                 :preview-render-func="previewRenderFuncProxy"
                                 :upload-func="uploadFileFuncProxy"
                />
            </div>
        </div>
        <div class="row mb-2">
            <div class="col d-flex align-items-center">
                <div class="mr-2"><i class="fab fa-2x fa-youtube"></i></div> <b-input v-model="form.youtube_link"></b-input>
            </div>
        </div>
        <div class="row">
            <div class="col d-flex align-items-center">
                <div class="flex-shrink-0 mr-2">Кастомный класс:</div> <b-input v-model="form.custom_class"></b-input>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import {Prop, Vue, Watch} from "vue-property-decorator";
import MarkdownEditor from "./MarkdownEditor.vue";
import DifficultSelector from "./DifficultSelector.vue";
import {previewRenderFunc, uploadFileFunc} from "../utils";
import Task from "../models/Task";

@Component({
    components: {DifficultSelector, MarkdownEditor}
})
export default class TaskEditor extends Vue {
    @Prop() task!: Task;

    form: any = {
        title: null,
        tags: null,
        order: null,
        group_id: null,
        custom_class: null,
        youtube_link: null,
        content: "",
        complexity: null,
        additional_content: "",
        visible: null,
        lab_id: null,
    };

    previewRenderFuncProxy(text: string) {
        return previewRenderFunc(text, this.$store.state.activeDiscipline.jekyll_folder)
    }

    uploadFileFuncProxy(file: File) {
        return uploadFileFunc(file, this.$store.state.activeDiscipline.jekyll_folder)
    }

    @Watch("task")
    onTaskChange() {
        this.form = {
            title: this.task ? this.task.title : null,
            tags: this.task ? this.task.tags : null,
            order: this.task ? this.task.order : null,
            group_id: this.task ? this.task.group_id : null,
            custom_class: this.task ? this.task.custom_class : null,
            youtube_link: this.task ? this.task.youtube_link : null,
            content: this.task ? this.task.content : "",
            complexity: this.task ? this.task.complexity : null,
            additional_content: this.task ? this.task.additional_content : "",
            visible: this.task ? this.task.visible : null,
            lab_id: this.task ? this.task.lab_id : null,
        }
    }

    onSaveClick(buttonClicked) {
        this.$emit("save", this.form, buttonClicked)
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
            this.onSaveClick(false)
        }
    }
}
</script>

<style scoped>

</style>