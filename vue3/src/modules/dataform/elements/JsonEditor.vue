<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <Vue3JsonEditor v-model="json" :show-btns="false"  @json-change="onJsonChange"></Vue3JsonEditor>
    </a-form-item>
</template>

<script>
import { Vue3JsonEditor } from 'vue3-json-editor'
export default {
    props: ["model", "rule", "label", "meta"],
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
