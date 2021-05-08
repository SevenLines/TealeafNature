<template>
    <textarea ref="editor"></textarea>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import EasyMDE from 'easymde';
import marked from 'marked'
import hljs from 'highlight.js'
import _ from "lodash";

@Component
export default class MarkdownEditor extends Vue {
    @Prop() value!: string;
    @Prop() maxHeight!: "300px";
    @Prop() minHeight!: "300px";
    @Prop() uploadLocalFuncPath!: "";
    @Prop() uploadLocalFuncSubPath!: "";
    @Prop() customRenderFunction!: null;
    @Prop() uploadFunc?: Function;
    @Prop() previewRenderFunc?: Function;
    @Prop() sideBySideFullscreen?: true;

    private mde?: EasyMDE;

    @Watch("value", {immediate: true})
    onValueChange() {
        if (this.mde) {
            if (this.mde.value() != this.value) {
                this.mde.value(this.value);
            }
        }
    }

    mounted() {
        let self = this;

        this.mde = new EasyMDE({
            element: (this.$refs.editor as HTMLElement),
            spellChecker: false,
            uploadImage: true,
            maxHeight: this.maxHeight,
            minHeight: this.minHeight,
            imageAccept: "image/png,image/jpeg,image/gif,docx,xlsx",
            sideBySideFullscreen: this.sideBySideFullscreen,
            async imageUploadFunction(file: any, onSuccess: any) {
                if (self.uploadFunc != null) {
                    let data = await self.uploadFunc(file);
                    onSuccess(data.link);
                }
            },
            previewRender: function (plainText: string) {
                let result: string = "";
                if (self.previewRenderFunc != null) {
                    result = self.previewRenderFunc(plainText);
                } else {
                    result = marked(plainText);
                }
                return result; // Returns HTML from a custom parser
            },
            renderingConfig: {
                codeSyntaxHighlighting: true,
                hljs
            },
            indentWithTabs: false,
            tabSize: 4,
        });
        if (this.mde) {
            this.mde.value(this.value);
            this.mde.codemirror.on("change", () => {
                if (this.mde) {
                    this.$emit("input", this.mde.value())
                }
            });
            this.mde.codemirror.on("beforeChange", (cm, change) => {
                if (change.origin === "paste") {
                    let ltrim = _(change.text).filter(line => line.trim().length > 0).map(line => {
                        return (line.match(/^\s+/) || [""])[0].length || 0;
                    }).min();

                    let newLines = _(change.text).map(x => x.slice(ltrim)).value();
                    change.update(null, null, newLines);
                }
            });
        }
    }

    beforeDestroy() {
        if (this.mde) {
            this.mde.toTextArea();
        }
        this.mde = undefined;
    }

    insertCode() {
        console.log(this)
    }

}
</script>

<style scoped>
@import "~easymde/dist/easymde.min.css";
</style>

<style lang="scss">
.EasyMDEContainer {
    img {
        max-width: 100%;
    }
}

/*.CodeMirror,*/
/*.CodeMirror-scroll {*/
/*    max-height: 330px;*/
/*}*/

/*.CodeMirror-fullscreen .CodeMirror,*/
/*.CodeMirror-fullscreen .CodeMirror-scroll*/
/*{*/
/*    max-height: 100vh;*/
/*}*/
</style>