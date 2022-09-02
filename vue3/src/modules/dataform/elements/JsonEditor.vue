<template>
    <a-form-item :rules=rule :label=label>
        <vue-json-editor v-model="json" :show-btns="false"  @json-change="onJsonChange"></vue-json-editor>
    </a-form-item>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
export default {
    props: ["model", "rule", "label", "meta"],
    components: {
        vueJsonEditor
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
