<template>
    <lambda-form-item :rule="rule" :label=label  :name="model.component" :meta="meta">
        <a-radio-group v-model:value="model.form[model.component]">
            <a-radio :value="item.value" v-for="item in options" :key=item.index :disabled="disabled">
                <img :src="item.thumb" alt="">
            </a-radio>
        </a-radio-group>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
        computed: {
            options() {
                if (this.meta.options.length >= 1) {
                    return this.meta.options;
                } else {
                    return this.relation_data;
                }
            }
        }
    };
</script>
