<template>
    <lambda-form-item :rule="rule" :label=label  :name="model.component" :meta="meta">
        <a-checkbox
            :checked="model.form[model.component] === 1"
            :disabled="disabled"
            @change="change"
          >{{ placeholder }}
        </a-checkbox>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
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
