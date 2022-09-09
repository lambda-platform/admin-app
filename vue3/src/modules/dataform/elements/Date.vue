<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <a-date-picker
            v-model:value="model.form[model.component]"
            mode="date"
            :placeholder="placeholder"
            :disabled="disabled"
            valueFormat="YYYY-MM-DD"
          ></a-date-picker>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
};
</script>
