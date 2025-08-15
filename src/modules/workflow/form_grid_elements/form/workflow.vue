<template>
  <div>
    <label>{{label}}</label>
    <div class="workflow-creator w-full mb-2 relative">

      <div class="workflow-page border border-gray-300">
        <Workflow :flow-data="model.form[model.component]" @changed="changed"/>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from "@lambda-platform/lambda-vue/src/modules/dataform/elements/_mixin";
import Workflow from "~/modules/workflow/Workflow.vue"

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

