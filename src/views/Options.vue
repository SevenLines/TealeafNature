<template>
    <div>
      <b-form-input
      id="inline-form-input-name"
      class="mb-2 mr-sm-2 mb-sm-0"
      placeholder="Jane Doe"
    ></b-form-input>

    </div>
</template>

<script>
import Component from "vue-class-component";
import {Vue} from "vue-property-decorator";
import {mapState} from "vuex";

@Component({
    computed: {
        ...mapState({

        })
    }
})
export default class Options extends Vue {
}
</script>

<style scoped>

</style>