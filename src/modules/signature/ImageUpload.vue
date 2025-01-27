<template>
 <div class="mt-12">
   <a-upload
     v-model:file-list="uploadList"


     name="file"
     list-type="picture-card"
     :action="`/lambda/krud/upload`"
     @preview="handleView"
     @change="handleChange"
     @remove="handleRemove"
   >
     <div>
       <loading-outlined v-if="loading"></loading-outlined>
       <i class="ti ti-camera" v-else></i>
       <div class="ant-upload-text">Зурган файл</div>
     </div>
   </a-upload>
   <a-image
     :width="200"
     :style="{ display: 'none' }"
     :preview="{
                visible:showImage,
                onVisibleChange:onVisibleChange
            }"
     :src="showImageUrl"
   />
 </div>
</template>

<script>

import {message} from 'ant-design-vue'
import {PlusOutlined, LoadingOutlined} from '@ant-design/icons-vue'

export default {
  emits:["success", "remove"],
  props:["imageFile"],
  components: {
    LoadingOutlined,
    PlusOutlined,
  },
  computed: {

  },
  mounted() {

    this.init()
  },

  data() {
    return {
      defaultList: [],
      uploadList: [],
      showImage: false,
      showImageUrl: '',
      loading: false,
      file:""
    }
  },

  watch: {

    itemValue(value, oldValue) {
      if ((oldValue && !value) || (value && !oldValue)) {
        if (value) {
          this.init()
        } else {
          this.uploadList = [];
        }
      } else if (value) {
        this.init();
      }
    }

  },

  methods: {
    init() {

      if (this.imageFile) {
        this.file = this.imageFile;
        let name = this.file.split("/")
        let fileName = "";
        if (name.length >= 1) {
          fileName = name[name.length - 1]
        }

        if (this.uploadList.length >= 1) {
          if (this.uploadList[0].response !== this.file) {
            this.uploadList = [{
              status: 'done',
              thumbUrl: '' + this.file,
              response: this.file,
              name: fileName
            }]
          }
        } else {
          this.uploadList = [{
            status: 'done',
            thumbUrl: '' + this.file,
            response: this.file,
            name: fileName
          }]
        }
      }

    },
    onVisibleChange(v) {
      this.showImage = v
    },
    handleView(file) {
      this.showImage = true
      this.showImageUrl = `` + file.response
    },
    handleChange(info) {

      if (info.file.status === 'uploading') {
        this.loading = true

        return
      }

      if (info.file.status === 'done') {


        this.file = info.file.response;

        this.$emit("success", info.file.response)
        this.uploadList = [{
          status: 'done',
          thumbUrl: '' + this.file,
          response: this.file,
          name: info.file.name
        }]
        this.loading = false;
      }

      if (info.file.status === 'error') {
        this.uploadList = this.uploadList.filter(u => u.status === 'done');
        this.loading = false;
        message.error(this.$t("alertMessage.errorMsg"))
      }


    },

    success(val) {

      this.file = val;
      this.$emit("success", val)
    },

    handleRemove(e) {

      this.file = null
      this.$emit("remove")

    },

  }
}
</script>
