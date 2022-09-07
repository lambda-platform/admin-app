<template>
    <lambda-form-item :rule="rule" :label=label  :name="model.component" :meta="meta">
        <a-date-picker
            v-model:value="model.form[model.component]"
            show-time
            :placeholder="placeholder"
            :disabled="disabled"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            ></a-date-picker>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
};
</script>
