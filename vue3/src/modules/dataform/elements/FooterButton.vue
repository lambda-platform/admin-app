<template>
    <lambda-form-item  :label=label  :name="model.component" :meta="meta">
        <a-radio-group v-model:value="model.form[model.component]">
            <a-radio :value="item.value" v-for="item in options" :key=item.index :disabled="disabled">
                <span>{{item.label}}</span>
            </a-radio>
        </a-radio-group>
    </lambda-form-item>
</template>

<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],

    };
</script>
