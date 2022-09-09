<template>
    <lambda-form-item :label=label :name="model.component" :meta="meta">

        <a-upload
            v-model:file-list="uploadList"
            :multiple="this.meta.file.isMultiple"
            name="file"
            list-type="picture-card"
            :action="`${url ? url : ''}/lambda/krud/upload`"
            @preview="handleView"
            @change="handleChange"
            @remove="handleRemove"
        >
            <div>
                <loading-outlined v-if="loading"></loading-outlined>
                <i class="ti ti-camera" v-else></i>
                <div class="ant-upload-text">{{ label }}</div>
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

    </lambda-form-item>
</template>

<script>
import mixin from './_mixin'
import { message } from 'ant-design-vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'

export default {
    mixins: [mixin],
    components: {
        LoadingOutlined,
        PlusOutlined,
    },
    computed: {
        lang () {
            const labels = ['viewPhotos', '_delete'
            ]
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i])
                return obj
            }, {})
        },
    },
    mounted () {

        this.init()
    },
    data () {
        return {
            defaultList: [],
            uploadList: [],
            showImage: false,
            showImageUrl: '',
            loading: false
        }
    },

    watch: {

        itemValue (value, oldValue) {
            if ((oldValue && !value) || (value && !oldValue)) {
                if (value) {
                    this.init()
                }
            }
        }

    },

    methods: {
        init () {

            if (this.model.form[this.model.component]) {
                if (typeof this.meta.file.isMultiple !== 'undefined' && this.meta.file.isMultiple) {
                    if (JSON.stringify(this.uploadList !== this.model.form[this.model.component])) {
                        let list = JSON.parse(this.model.form[this.model.component])
                        if (Array.isArray(list)) {
                            this.uploadList = list
                        }
                    }
                } else {
                    if (this.uploadList.length >= 1) {
                        if (this.uploadList[0].response !== this.model.form[this.model.component]) {
                            this.uploadList = [{
                                status: 'done',
                                thumbUrl: this.model.form[this.model.component],
                                response: this.model.form[this.model.component],
                            }]
                        }
                    } else {
                        this.uploadList = [{
                            status: 'done',
                            thumbUrl: this.model.form[this.model.component],
                            response: this.model.form[this.model.component],
                        }]
                    }
                }
            }

        },
        onVisibleChange (v) {
            this.showImage = v
        },
        handleView (file) {
            this.showImage = true
            this.showImageUrl = file.response
        },
        handleChange (info) {

            if (info.file.status === 'uploading') {
                this.loading = true

                return
            }
            if (info.file.status === 'done') {

                if (!this.meta.file.isMultiple) {
                    this.model.form[this.model.component] = info.file.response
                    this.uploadList = [{
                        status: 'done',
                        thumbUrl: this.model.form[this.model.component],
                        response: this.model.form[this.model.component],
                        name: info.file.name
                    }]
                } else {
                    this.uploadList = this.uploadList.map(u => {
                        return {
                            status: 'done',
                            thumbUrl: u.response,
                            response: u.response,
                            name: u.name
                        }
                    })
                    this.model.form[this.model.component] = JSON.stringify(this.uploadList)
                }
                this.loading = false
            }
            if (info.file.status === 'error') {
                this.uploadList = this.uploadList.filter(u=>u.status === 'done');
                this.loading = false;
                message.error(this.$t("alertMessage.errorMsg"))
            }
        },

        success (val) {

            if (this.meta.file.isMultiple) {
                this.uploadList = this.$refs.upload.fileList
                this.model.form[this.model.component] = JSON.stringify(this.uploadList.map(item => {
                    return {
                        name: item.name,
                        response: item.response
                    }
                }))
            } else {
                this.model.form[this.model.component] = val
            }
        },

        handleRemove (e) {

            if (this.meta.file.isMultiple) {
                this.model.form[this.model.component] = JSON.stringify(this.uploadList.filter(u=>u.response !== e.response))
            } else {
                this.model.form[this.model.component] = null
            }

        },

    }
}
</script>
