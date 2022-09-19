<template>
  <div>
    <lambda-form-item :label=label :name="model.component" :meta="meta">
      <div>
        <label>Газар зүйн элементийн төрөл:</label>

      </div>
    </lambda-form-item>
    <a-radio-group v-model:value="layerType" @change="saveData">
      <a-radio value="Point">Point</a-radio>
      <a-radio value="Polygon">Polygon</a-radio>
      <a-radio value="Polyline">Polyline</a-radio>
    </a-radio-group>
    <hr>
    <br>
    <div>
      <label>OBJECTID хадгаллах талбар (Маягтын)</label>
      <a-select v-model:value="objectIdField" style="width:200px" @change="saveData" :options="meta.options">
      </a-select>
    </div>
    <div>
      <label>Газарзүйн мэдээллийн талбар (Маягтын)</label>
      <a-select v-model:value="geoJsonField" style="width:200px" @change="saveData" :options="meta.options">
      </a-select>
    </div>
    <br>
    <hr>
    <div>
      <br>
      <table>
        <tr>
          <td>
            <label>ArcGIS атрибут</label>
            <a-select v-model:value="gisAttribute" style="width:100%" :options="gisAttributes">
            </a-select>
          </td>
          <td>
            <label>Маягтын талбар</label>
            <a-select v-model:value="formField" style="width:100%" :options="meta.options">
            </a-select>
          </td>
          <td>
            <br>
            <a-button type="primary" @click="addConnection">Нэмэх</a-button>
          </td>
        </tr>
      </table>
      <a-table border :columns="columns" :dataSource="connections">
        <template #bodyCell="{text, record, index, column}">

          <template v-if="column.dataIndex === 'operation'">
            <a-popconfirm
              v-if="connections.length"
              title="Утгах уу?"
              ok-text="Тийм" cancel-text="Үгүй"
              @confirm="remove(index)"
            >
              <a>Утгах</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>

    </div>


  </div>

</template>

<script>

import mixin from '../../vue3/src/modules/dataform/elements/_mixin'

export default {

  mixins: [mixin],

  data () {
    return {

      gisAttribute: null,
      formField: null,
      columns: [

        {
          title: 'ArcGIS атрибут',
          dataIndex: 'attribute',
          key: 'attribute'
        },
        {
          title: 'Маягтын талбар',
          dataIndex: 'field',
          key: 'field'
        },
        {
          title: 'operation',
          dataIndex: 'operation',
        },
      ],
      connections: [],
      objectIdField: null,
      geoJsonField: null,
      layerType: null,
    }
  },
  methods: {
    remove (index) {
      this.connections.splice(index, 1)

      this.saveData()
    },
    addConnection () {
      if (this.gisAttribute && this.formField) {
        this.connections.push({
          attribute: this.gisAttribute,
          field: this.formField,
        })

        this.gisAttribute = null
        this.formField = null

        this.saveData()
      }
    },
    saveData () {
      this.model.form[this.model.component] = JSON.stringify({
        connections: this.connections,
        objectIdField: this.objectIdField,
        geoJsonField: this.geoJsonField,
        layerType: this.layerType,
      })
    }
  },
  created () {

  },
  mounted () {
    if (this.model.form[this.model.component]) {

    }
  },
  computed: {
    gisAttributes () {
      return this.meta.gis_options ? this.meta.gis_options : []
    },
    connectionValue () {
      return this.model.form[this.model.component]
    }
  },
  watch: {
    connectionValue (value, oldValue) {

      if ((oldValue && !value) || (value && !oldValue)) {
        if (value) {

          let data = JSON.parse(this.model.form[this.model.component])

          this.connections = data.connections
          this.objectIdField = data.objectIdField
          this.geoJsonField = data.geoJsonField
          this.layerType = data.layerType
        } else {

        }
      }

    },

  }

}
</script>
