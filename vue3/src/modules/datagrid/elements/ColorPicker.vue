<template>
    <ColorPicker v-model="$props.model.form[model.component]"  style="float: right"  />
</template>

<script>
import ColorPicker from 'primevue/colorpicker';
export default {
    props: ["model", "label", "rule", "meta"],
    components:{
        ColorPicker:ColorPicker
    },
    computed: {
        value() {
            return this.$props.model.form[this.model.component];
        }
    },
    beforeMount(){
        if(this.value === null){
            this.$props.model.form[this.model.component] = '';
        }
    },
    watch: {
        value(value) {

            if(value === null){
                this.$props.model.form[this.model.component] = '';
            }

        }
    }
};
</script>
