<template>
  <span class="btn btn-icon" @click="showForm = true">
    <span class="svg-icon">
      <inline-svg
        src="/assets/icons/duotone/Communication/Clipboard-check.svg"
      />
    </span>
  </span>
  <a-modal v-model:open="showForm" title="Нэмэлт маягт" :footer="null">
    <dataform
      v-if="showForm"
      ref="form"
      schemaID="0"
      :editMode="editMode"
      :hideTitle="true"
      :onSuccess="onSuccess"
      :onError="onError"
      :do_render="showForm"
      :onReady="formReady"
      :permissions="{
        c: false,
        r: true,
        u: true,
        d: false,
      }"
      :user_condition="null"
    ></dataform>
    <!--    </div>-->

    <template #footer> </template>
  </a-modal>
</template>

<script>export default {

  data() {
    return {
      showForm: false,
      editMode: false,
    };
  },
  methods: {
    onSuccess() {
      this.showForm = false;
      this.params.fetchData();
    },
    onError() {},
    formReady() {
      this.$nextTick(() => {
        this.editMode = true;
        this.$refs.form.editModel(this.params.value);
      });
    },
  },
};
</script>
<style lang="scss">
//.form-preview-page{
//
//  .dataform-body {
//    padding: 15px
//  }
//  .dataform-header, .dataform-footer, .sub-form-add-btn, .subform-header, .clear-container, .leaflet-draw{
//    display: none;
//  }
//  .subform-grid{
//    .action{
//      display: none;
//    }
//  }
//  .ivu-input-inner-container, .multiselect{
//    pointer-events: none;
//  }
//  textarea{
//    max-height: 52px !important;
//  }
//  .ivu-form-item-label{
//    background: #ccc;
//    width: 100%;
//    padding: 7px 15px;
//    color: #333;
//    text-align: left;
//    font-weight: 500;
//  }
//  .ivu-input, .multiselect__tags{
//    border-radius: 0;
//  }
//  .with-info-caller {
//    width: calc(100% - 30px);
//    display: inline-block;
//  }
//  .info-caller{
//    width: 30px;
//    display: inline-block;
//    vertical-align: top;
//    padding-top: 2px;
//    padding-left: 2px;
//    /*border-top: solid 1px #ccc;*/
//    height: 20px;
//    position: absolute;
//
//  }
//
//}
</style>
