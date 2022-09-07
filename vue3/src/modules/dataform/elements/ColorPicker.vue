<template>
    <lambda-form-item :rule="rule" :label=label  :name="model.component" :meta="meta">
        <input type="color"  :name="model.component" v-model="model.form[model.component]"
               :disabled="disabled"
        >
    </lambda-form-item>
</template>

<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
};
</script>
