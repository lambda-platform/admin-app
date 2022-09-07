<template>
    <lambda-form-item :rule="rule" :label=label  :name="model.component" :meta="meta">
        <Vue3JsonEditor v-model="json" :show-btns="false"  :disabled="disabled"  @json-change="onJsonChange"></Vue3JsonEditor>
    </lambda-form-item>
</template>

<script>
import { Vue3JsonEditor } from 'vue3-json-editor'
import mixin from "./_mixin"
export default {
    mixins:[mixin],
    components: {
        Vue3JsonEditor
    },
    data () {
        return {
            json: JSON.parse(this.model.form[this.model.component])
        }
    },
    methods: {
        onJsonChange (value) {
            this.model.form[this.model.component]=JSON.stringify(value);
        }
    }
};
</script>
