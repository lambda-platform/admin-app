<template>
    <lambda-form-item :rule="rule" :label=label :name="model.component" :meta="meta">
        <a-time-picker
            v-model:value="model.form[model.component]"
            :placeholder="placeholder"
            :disabled="disabled"
            valueFormat="HH:mm:ss"
        ></a-time-picker>
    </lambda-form-item>
</template>
<script>
import mixin from './_mixin'

export default {
    mixins: [mixin],
}
</script>
