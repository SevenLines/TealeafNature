<template>
    <div id="app">
        <b-breadcrumb v-if="breadcrumbs.length">
            <b-breadcrumb-item :to="item.to" v-for="item in breadcrumbs" :key="item.to">
                {{item.title}}
            </b-breadcrumb-item>
        </b-breadcrumb>
        <router-view/>
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

        console.log(this.$route.name)

        if (this.$route.name == "Labs" || this.$route.name == "Tasks") {
            result.push({
                "to": `/`,
                "title": this.activeDiscipline.title,
            })
        }

        if (this.$route.name == "Tasks") {
            result.push({
                "to": `/discipline/${this.activeDiscipline.id}`,
                "title": this.activeLab.title,
            })
        }

        return result
    }
}
</script>

<style>

</style>
