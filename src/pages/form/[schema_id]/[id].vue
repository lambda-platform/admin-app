<template>
  <div class="form-preview-page">
    <dataform ref="form" :schemaID="$route.params.schema_id"
              :editMode="editMode"
              :hideTitle="true"
              :onSuccess="onSuccess"
              :do_render="true"
              :onReady="getData"
              :url="url"
              :permissions="{
                        c: true,
                        r: false,
                        u: false,
                        d: false,
                    }"
              :user_condition="null"
              :onError="onError"></dataform>
  </div>
</template>

<script>

import {base_url} from "../../../consts/const"
definePageMeta({
  layout: 'form',
})
export default {
  components: {

  },
  computed:{
    url(){
      // if(this.projects_id !== null && this.projects_id != "" && this.projects_id != undefined){
      //     if(window.init.microserviceSettings){
      //         if(window.init.microserviceSettings.length >= 1){
      //             let si = window.init.microserviceSettings.findIndex(set=>set.project_id == this.projects_id);
      //             if(si >= 0){
      //
      //                 if(window.lambda.microservice_dev){
      //                     return  window.init.microserviceSettings[si].dev_url;
      //                 } else {
      //                     return  window.init.microserviceSettings[si].production_url;
      //                 }
      //
      //             }
      //         }
      //     }
      // }
      return base_url;
    },
  },
  methods:{
    onSuccess(){

    },
    onError(){

    },
    getData(){
      this.editMode = true;
      this.$refs.form.editModel(this.$route.params.id);
    },

  },

  data() {
    return {
      editMode:false,
      formId: null,
    };
  },

};
</script>
<style lang="scss">
.form-preview-page{

  .dataform-body {
    padding: 15px
  }
  .dataform-header, .dataform-footer, .sub-form-add-btn, .subform-header, .clear-container, .leaflet-draw{
    display: none;
  }
  .subform-grid{
    .action{
      display: none;
    }
  }
  .ivu-input-inner-container, .multiselect{
    pointer-events: none;
  }
  textarea{
    max-height: 52px !important;
  }
  .ivu-form-item-label{
    background: #ccc;
    width: 100%;
    padding: 7px 15px;
    color: #333;
    text-align: left;
    font-weight: 500;
  }
  .ivu-input, .multiselect__tags{
    border-radius: 0;
  }
  .with-info-caller {
    width: calc(100% - 30px);
    display: inline-block;
  }
  .info-caller{
    width: 30px;
    display: inline-block;
    vertical-align: top;
    padding-top: 2px;
    padding-left: 2px;
    /*border-top: solid 1px #ccc;*/
    height: 20px;
    position: absolute;

  }

}
</style>
