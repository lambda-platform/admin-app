<template>
    <a-form-item :label=label :rules=rule>
        <numeric
                currency=""
                currencySymbolPosition="suffix"
                :precision="2"
                separator=","
                v-model="model.form[model.component]"
                :disabled="meta && meta.disabled ? meta.disabled : false"
        ></numeric>
    </a-form-item>
</template>

<script>
import Numeric from "./Numeric";
export default {
    props: ["model", "label", "rule", "meta"],
    components: {
        Numeric
    },
    data() {
        return {
            price: ""
        };
    }
};
</script>
