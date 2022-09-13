<template>
  <lambda-form-item  :label=label  :name="model.component" :meta="meta">
    <h1>I AM CUSTOM </h1>
    <a-input v-model:value="model.form[model.component]"
             :placeholder="placeholder"
             :disabled="disabled"
    />
  </lambda-form-item>
</template>
<script>
import mixin from "../../vue3/src/modules/dataform/elements/_mixin"
export default {
  mixins:[mixin]
};
</script>
