<template>
    <div id="app" class="d-flex" style="height: 100%">
        <div class="d-flex flex-column w-100">
            <b-navbar toggleable="lg" variant="light">
                <b-container>
                    <b-navbar-brand>
                        Чаинка Натуральная
                    </b-navbar-brand>
                    <b-breadcrumb v-if="breadcrumbs.length">
                        <b-breadcrumb-item :to="item.to" v-for="item in breadcrumbs" :key="item.to">
                            <span v-html="item.title"></span>
                        </b-breadcrumb-item>
                    </b-breadcrumb>
                </b-container>
            </b-navbar>
            <div class="flex-grow-1 overflow-auto">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Watch} from "vue-property-decorator";
import Component from "vue-class-component";
import {mapState} from "vuex";

@Component({
    computed: {
        ...mapState({
            activeDiscipline: "activeDiscipline",
            activeLab: "activeLab",
        })
    }
})
export default class App extends Vue {
    private activeDiscipline!: any
    private activeLab!: any

    get breadcrumbs() {
        let result = []

        if (this.$route.name == "DisciplinePage" || this.$route.name == "LabPage") {
            result.push({
                "to": `/`,
                "title": this.activeDiscipline.title,
            })
        }

        if (this.$route.name == "LabPage") {
            result.push({
                "to": `/discipline/${this.activeDiscipline.id}`,
                "title": `<i class="${this.activeLab.icon}"></i> ${this.activeLab.title}`,
            })
        }

        return result
    }
}
</script>

<style lang="scss">
#app {
    .breadcrumb {
        margin-bottom: 0;
    }
}
</style>
