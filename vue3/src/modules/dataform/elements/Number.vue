<template>
    <lambda-form-item :rule="rule" :label=label  :name="model.component" :meta="meta">
        <a-input-number type="number"
                        v-if="meta.no_format"
               v-model:value="model.form[model.component]"
                        :placeholder="placeholder"
                        :disabled="disabled"

                        :number="true" />
        <a-input-number
                        v-else
               v-model:value="model.form[model.component]"
                        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                        :placeholder="placeholder"
                        :disabled="disabled"
        />
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],

    };
</script>
