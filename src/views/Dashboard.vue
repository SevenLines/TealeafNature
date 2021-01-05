<template>
    <div>
        <div v-for="d in disciplines" :key="d.id">
            <a href="#" @click="setDiscipline(d)">
                {{d.title}}
            </a>
        </div>
    </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import {mapState} from "vuex";

@Component({
    computed: {
        ...mapState({
            disciplines: "disciplines"
        })
    }
})
export default class Dashboard extends Vue {
    created() {
        this.$store.dispatch("fetchDisciplines")
    }

    setDiscipline(discipline) {
        this.$store.commit("setActiveDiscipline", discipline)
        this.$store.dispatch("fetchLabs")
    }
}
</script>
