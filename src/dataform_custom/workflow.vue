<template>
  <div>
    <label>{{label}}</label>
    <div class="workflow-creator">

      <div class="workflow-page">
        <Workflow :flow-data="model.form[model.component]" @changed="changed"/>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from "@lambda-platform/lambda-vue/src/modules/dataform/elements/_mixin";
import "~/modules/workflow/workflow/styles.scss"
import Workflow from "~/modules/workflow/workflow/components/Workflow/Workflow.vue"

export default {
  name: "datetimeFill",
  mixins: [mixin],
  components: {
    Workflow
  },
  data() {
    return {};
  },
  methods: {
    changed(flowJson) {
      this.model.form[this.model.component] = JSON.stringify(flowJson)
    }
  },
  mounted() {

  },
  watch: {
    do_render(show) {

    },
  },
};
</script>
<style scoped>
.workflow-creator {
  position: relative;
  margin-bottom: 30px;
  max-width: calc(100vw - 350px);
}
</style>
