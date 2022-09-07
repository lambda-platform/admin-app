<template>
    <LambdaFormItem :rule="rule" :label=label  :name="model.component" :meta="meta">
        <a-switch v-model:checked="model.form[model.component]"  :disabled="disabled" />
    </LambdaFormItem>
</template>

<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
};
</script>
