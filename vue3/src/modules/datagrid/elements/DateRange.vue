<template>
<!--    <FormItem :label=label>-->
<!--        <DatePicker type="daterange" placement="bottom-end" @on-change="getDateValue"-->
<!--                    :placeholder="meta && meta.placeHolder !== null ? meta.placeHolder : label"></DatePicker>-->
<!--    </FormItem>-->
    <Calendar v-model="$props.model.form[model.component]" />
</template>

<script>
import {getDate} from "../utils/date";
import Calendar from 'primevue/calendar';
export default {
    props: ["model", "label", "meta"],
    components:{
        Calendar
    },
    methods: {
        getDateValue(value) {
            if (value) {
                this.$props.model.form[this.model.component] = value.map(item => {
                    return getDate(item);
                });
            }
        }
    }
};
</script>
