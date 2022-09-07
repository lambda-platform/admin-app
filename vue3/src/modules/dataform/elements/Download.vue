<template>
    <lambda-form-item :rule="rule" :label=label  :name="model.component" :meta="meta">
        <div class="multi-upload">
            <label>{{ label }}</label>

            <div class="multi-upload-list">
                <div class="upload-list" v-for="item in uploadList" :key="item.index">
                    <template>
                        <img v-if="item" :src="item">
                        <a class="upload-control" :href="item" download>{{lang.download}}</a>
                    </template>
                </div>
            </div>
        </div>
    </lambda-form-item>
</template>
<script>
import mixin from "./_mixin"
export default {
    mixins:[mixin],
        computed: {
            lang() {
                const labels = ['download', ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataForm.' + labels[i]);
                    return obj;
                }, {});
            },
        },
        data(){
            return{
                uploadList:[]
            }
        },
        watch: {
            'model.form'(val) {
                this.uploadList = JSON.parse(this.model.form[this.model.component]);
            }
        },

    };
</script>


