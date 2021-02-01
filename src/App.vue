<template>
    <div id="app" :class="{dark: darkTheme}" class="d-flex" style="height: 100%">
        <div class="d-flex flex-column w-100">
            <b-navbar toggleable="lg" :variant="darkTheme ? 'dark' : 'light'">
                <b-container>
                    <div class="d-flex align-items-center">
                        <b-navbar-brand to="/" class="ml-2">
                            <i class="fad fa-mug-hot"></i> Чаинка Натуральная
                        </b-navbar-brand>
                        <b-checkbox v-model="darkTheme">
                            <i class="fad fa-moon"></i>
                        </b-checkbox>
                    </div>
                    <div class="d-flex flex-shrink-0 align-items-center">
                        <b-breadcrumb v-if="breadcrumbs.length" class="mr-2">
                            <b-breadcrumb-item :to="item.to" v-for="item in breadcrumbs" :key="item.to">
                                <span v-html="item.title"></span>
                            </b-breadcrumb-item>
                        </b-breadcrumb>
                        <div v-if="jekyllProcess || activeDiscipline.id">
                            <div v-if="jekyllProcess" class="btn-group btn-group-sm">
                                <button class="btn btn-sm btn-success"  @click="onStopJekyllProcess">
                                    <i class="fas fa-stop"></i>
                                </button>
                                <button @click="onLinkOpen" class="btn btn-sm btn-info">
                                    <i class="fas fa-link"></i>
                                </button>
                            </div>
                            <button class="btn btn-sm btn-danger" v-else-if="activeDiscipline.id" @click="onLaunchJekyllProcess">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                </b-container>
            </b-navbar>
            <div class="console overflow-auto p-3" :class="{'active': consoleActive}" ref="log">
                <span v-for="(log, index) in jekyllProcessLog" :key="index">&gt; <span v-html="log"></span></span>
            </div>
                <b-overlay class="flex-grow-1 overflow-auto" :show="loading" rounded="sm">
                    <router-view/>
                </b-overlay>
        </div>

        <notifications group="messages"/>
    </div>
</template>

<script lang="ts">
import {Vue, Watch} from "vue-property-decorator";
import Component from "vue-class-component";
import {mapState} from "vuex";
import {shell} from "electron";

@Component({
    computed: {
        ...mapState({
            activeDiscipline: "activeDiscipline",
            activeLab: "activeLab",
            consoleActive: "consoleActive",
            jekyllProcess: "jekyllProcess",
            jekyllProcessLog: "jekyllProcessLog",
            options: "options",
            loading: "loading",
        })
    }
})
export default class App extends Vue {
    private activeDiscipline!: any
    private activeLab!: any
    private jekyllProcess!: any
    private consoleActive!: any
    darkTheme = false;

    created() {

    }

    mounted() {
        document.addEventListener("keydown", this.onKey);
    }

    beforeDestroy() {
        document.removeEventListener("keydown", this.onKey);
    }

    @Watch("consoleActive")
    onConsoleActiveChange () {
        (this.$refs.log as Element).scrollTop = (this.$refs.log as Element).scrollHeight
    }

    @Watch("jekyllProcessLog", {deep: true})
    onJekyllProcessChange () {
        this.$nextTick(() => {
            (this.$refs.log  as Element).scrollTop = (this.$refs.log as Element).scrollHeight
        })
    }

    onKey(e: any) {
        if (e.ctrlKey && (e.keyCode == 192)) {
            e.preventDefault();
            this.$store.commit("setConsoleActive", !this.consoleActive)
        }
    }

    get breadcrumbs() {
        let result = []

        if (this.$route.name == "DisciplinePage" || this.$route.name == "LabPage" || this.$route.name == "ArticleEditor") {
            result.push({
                "to": `/discipline/${this.activeDiscipline.id}`,
                "title": this.activeDiscipline.title,
            })
        }

        if (this.$route.name == "LabPage") {
            result.push({
                "to": `/lab/${this.activeLab.id}`,
                "title": `<i class="${this.activeLab.icon}"></i> ${this.activeLab.title}`,
            })
        }

        if (this.$route.name == "ArticleEditor") {
            result.push({
                "to": `/discipline/${this.activeDiscipline.id}/article/${this.$route.params.article}`,
                "title": `<i class="fas fa-file-code"></i> ${this.$route.params.article}`,
            })
        }

        return result
    }

    onStopJekyllProcess() {
        this.$store.dispatch("killJekyllProcess")
    }

    onLaunchJekyllProcess() {
        this.$store.dispatch("runJekyllProcess")
    }

    onLinkOpen () {
        let href = `http://localhost:4000/`
        shell.openExternal(href);
    }

}
</script>

<style lang="scss">
@import "bootstrap-dark-theme";

#app {
    .breadcrumb {
        margin-bottom: 0;
    }
}

.dark {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #839496;
    text-align: left;
    background-color: #002b36;
}

.console {
    font-family: Courier, "Courier New", monospace;
    font-size: 14px;
    position: absolute;
    top: -100vh;
    left: 0;
    right: 0;
    height: 100vh;
    background-color: black;
    color: white;
    z-index: 1000;
    box-sizing: border-box;
    opacity: 0;

    transition: all 0.3s;

    &.active {
        top: 0;
        opacity: 0.95;
    }
}
</style>
