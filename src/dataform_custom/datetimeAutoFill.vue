<template>
  <lambda-form-item :label=label :name="model.component" :meta="meta">
    <a-date-picker
            v-model:value="model.form[model.component]"
            show-time
            :placeholder="placeholder"
            :disabled="disabled"

            ></a-date-picker>
  </lambda-form-item>
</template>

<script>
import mixin from '@lambda-platform/lambda-vue/src/modules/dataform/elements/_mixin'
import axios from 'axios'

export default {
  mixins: [mixin],
  mounted () {
        if(this.itemValue === null){
            axios.get("/lambda/krud/today").then(({data})=>{

                this.model.form[this.model.component] = data.today
            });
        }
    }

}
</script>

<style scoped>

</style>
