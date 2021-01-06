<template>
    <div>
        <div v-for="l in labs" :key="l.id">
            <a href="#" @click="setActiveLabId(l.id)">
                <router-link :to="`/lab/${l.id}`">
                    {{ l.title }}
                </router-link>
            </a>
        </div>
    </div>
</template>

<script lang="ts">

import {Vue, Watch} from "vue-property-decorator";
import {mapActions, mapState} from "vuex";
import Component from "vue-class-component";

@Component({
    computed: {
        ...mapState({
            labs: "labs",
            activeDiscipline: "activeDiscipline",
        }),

    },
    methods: {
        ...mapActions({
            "setActiveLabId": "setActiveLabId",
        }),
    }
})
export default class Labs extends Vue {
    @Watch("$route", {deep: true, immediate: true})
    onRouteChange() {
        this.$store.dispatch("setActiveDisciplineId", this.$route.params.disciplineId)
    }
}
</script>
