export default {
    props: ["model", "label", "meta", "do_render", "editMode", "is_show", "rule", "relation_data"],
    computed:{
        placeholder(){
            return this.meta && this.meta.placeHolder !== null && this.meta.placeHolder !== "" && this.meta.placeHolder !== undefined ? this.meta.placeHolder : this.label;
        },
        disabled(){
            return this.meta && this.meta.disabled ? this.meta.disabled : false;
        },
    },
    // mounted () {
    //     console.log(this.placeholder)
    //     console.log(this.model.component)
    // }

};
