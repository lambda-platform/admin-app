<template>
    <a-form-item :rules=rule :label=label  :name="model.component">
        <a-checkbox
            v-model:checked="value"
            :disabled="meta && meta.disabled ? meta.disabled : false"
            :true-value="1"
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
    watch:{
        value(v){
            console.log(v)
            console.log(v)
            console.log(v)
            console.log(v)
            if(v){
                this.model.form[this.model.component] = 1;
            } else {
                this.model.form[this.model.component] = 0;
            }
        }
    }
};
</script>
