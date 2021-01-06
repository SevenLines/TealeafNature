<template>
    <div>
        <div v-for="d in disciplines" :key="d.id">
            <router-link :to="`/discipline/${d.id}`">
                {{d.title}}
            </router-link>
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
            disciplines: "disciplines"
        }),

    },
    methods: {
        ...mapActions({
            setActiveDiscipline: "setActiveDiscipline",
            fetchDisciplines: "fetchDisciplines",
        }),
    },

})
export default class Dashboard extends Vue {
    created() {
        this.$store.dispatch("fetchDisciplines")
    }
}
</script>
