<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-input-number type="number"
               v-model:value="model.form[model.component]"
               :disabled="meta && meta.disabled ? meta.disabled : false" :number="true" />
<!--        <Input type="number" v-if="meta.no_format"-->
<!--               v-model="model.form[model.component]"-->
<!--               :disabled="meta && meta.disabled ? meta.disabled : false" :number="true" />-->
<!--        <numeric-->
<!--            v-else-->
<!--                currency=""-->
<!--                currencySymbolPosition="suffix"-->
<!--                :precision="meta.precision >= 0 ? meta.precision : 0"-->
<!--                separator=","-->
<!--                v-model="model.form[model.component]"-->
<!--                :disabled="meta && meta.disabled ? meta.disabled : false"></numeric>-->
    </a-form-item>
</template>

<script>
    // import Numeric from "./Numeric";
    export default {
        props: ["model", "label", "rule", "meta"],

        data() {
            return {
                price: ""
            };
        }
    };
</script>
