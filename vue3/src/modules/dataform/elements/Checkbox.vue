<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-checkbox
            :checked="model.form[model.component] === 1"
            :disabled="meta && meta.disabled ? meta.disabled : false"
            :true-value="1"
            @change="change"
            :false-value="0">{{ label }}
        </a-checkbox>
    </a-form-item>
</template>

<script>
export default {
    props: ["model", "label", "rule", "meta"],
    data(){
        return {
            value:false
        }
    },
    methods:{
        change(e){
            if(e.target.checked){
                this.model.form[this.model.component] = 1;
            } else {
                this.model.form[this.model.component] = 0;
            }
        },
    }

};
</script>
