<template>
  <lambda-form-item :label=label :name="model.component" :meta="meta">
    <a-cascader v-model:value="value" :options="layers"
                @change="setLayerValue"
                v-if="do_render"
                :placeholder="placeholder"
                :disabled="disabled"
    />
  </lambda-form-item>
</template>

<script>
import mixin from '../../vue3/src/modules/dataform/elements/_mixin'
import axios from 'axios'


import {getLayers, LayerData} from "./arcGISHelper"

const config = {}
const instance = axios.create(config)

export default {

  mixins: [mixin],

  data () {
    return {
      layers: [],
      value: [],
      featureFields: [],
      layerType: 'feature',
      token: '',
      ignoreWatching: true
    }
  },
  methods: {

    async getData () {

      if(!this.isBuilder){

        let res = await getLayers()

        this.layers = res.layers;
        this.token = res.token
      }

    },
    setLayerValue (value) {


      this.model.form[this.model.component] = JSON.stringify(value)

      this.getLayerData(value)
    },
    async getLayerData (value, igNore) {

     let response = await LayerData(value[value.length - 1], this.token)


        if (response.data.type === 'Feature Layer') {

          this.featureFields = response.data.fields.map(field => {
            return {
              value: field.name,
              label: field.name,
            }
          });


          this.model.form['layer_type'] = "feature";

          this.setSchemaByModel('popup_fields', 'hidden', false)
          this.setSchemaByModel('search_fields', 'hidden', false)
          this.setSchemaByModel('style_field', 'hidden', false)
          this.setSchemaByModel('info_template', 'hidden', false)
          this.setSchemaByModel('search_info', 'hidden', false)

        } else {
          this.featureFields = []

          this.model.form['layer_type'] = 'mapserver'

          this.setSchemaByModel('popup_fields', 'hidden', true)
          this.setSchemaByModel('search_fields', 'hidden', true)
          this.setSchemaByModel('style_field', 'hidden', true)
          this.setSchemaByModel('info_template', 'hidden', true)
          this.setSchemaByModel('search_info', 'hidden', true)
        }

        this.setSchemaByModel('popup_fields', 'options', this.featureFields)
        this.setSchemaByModel('search_fields', 'options', this.featureFields)
        this.setSchemaByModel('style_field', 'options', this.featureFields)
        //
        if (!igNore) {
          this.model.form["popup_fields"] = null
          this.model.form["search_fields"] = null
          this.model.form["style_field"] = null
          this.model.form["info_template"] = ""
          this.model.form["search_info"] = null

        } else {
          this.ignoreWatching = false
        }


    },

  },
  created () {

    const value = this.model.form[this.model.component]
    if (value !== null && value != '' && value != '\'\'') {
      if (value) {
        this.value = JSON.parse(value)

      }
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    popupFieldValue () {
      return this.model.form.popup_fields
    },
    searchFieldValue () {
      return this.model.form.search_fields
    },
    layerValue () {
      return this.model.form[this.model.component]
    },

  },
  watch: {
    popupFieldValue (value, oldValue) {

      if (!this.ignoreWatching) {
        let fields = []
        if (value !== null && value != '' && value != '\'\'') {
          if (value) {

            fields = value.split(',')
          }
        }
        let infoValue = ''
        fields.forEach(field => {

          infoValue = infoValue + '' + field + ' ' + '<b>{' + field + '}</b> <br/>'

        })

        this.model.form.info_template = infoValue
      }

    },
    searchFieldValue (value, oldValue) {
      if (!this.ignoreWatching) {
        let fields = []
        if (value !== null && value != '' && value != '\'\'') {
          if (value) {
            fields = value.split(',')
          }
        }
        let searchValue = ''
        fields.forEach((field, index) => {
          if (index >= fields.length - 1) {
            searchValue = searchValue + '' + field + ' ' + '{' + field + '}'
          } else {
            searchValue = searchValue + '' + field + ' ' + '{' + field + '}, '
          }

        })

        this.model.form.search_info = searchValue
      }
    },
    layerValue (value, oldValue) {

      if ((oldValue && !value) || (value && !oldValue)) {
        if (value) {

          this.value = JSON.parse(value)
          this.ignoreWatching = true
          this.getLayerData(this.value, true)
        }

      }
    }
  }

}
</script>
