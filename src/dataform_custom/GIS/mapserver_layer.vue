<template>
  <div>
    <a-form-item :label=label :name="model.component" class="data-form-item" :validateStatus="validateStatus">
      <a-switch v-model:checked="model.form[model.component]"  :disabled="meta.disabled" />
      <template #help v-if="meta.warn !== '' && meta.warn !== undefined">
        {{meta.warn}}
      </template>
    </a-form-item>
  </div>

</template>

<script setup>
import {defineProps, ref, computed, onMounted, watch} from "vue";

import axios from "~/plugins/core/axios"


const props = defineProps({
  model: Object,
  label: String,
  meta: Object,
  do_render: Boolean,
  editMode: Boolean,
  is_show: Boolean,
  relation_data: Function,
  showInformationModal: Boolean,
  url: String,
  setSchemaByModel: Function,
  getSchemaByModel: Function,
  validateDataForm: Function,
  validateWithSubForm: Function,
  validateStatus: Function,
  isBuilder: Boolean,
});
const geometryTables = ref([]);
const columns = ref([]);

function getUniqueSchemas(data) {
  const schemaSet = new Set();
  data.forEach(item => schemaSet.add(item.Schema));
  return Array.from(schemaSet);
}

function getTables() {
  return geometryTables.value.map( item=> ({parent_value:item.Schema, value:item.TableName, label:item.TableName})).filter(v=>db_schema.value == v.parent_value);
}

function getGeometryTables() {
  axios.get('/mapserver/api/geometry-tables').then(({data}) => {
    geometryTables.value = data

    props.setSchemaByModel("db_schema", "options", getUniqueSchemas(data).map(v=>({value:v,label:v})));


  });
}
function getTableColumns(schema, table) {
  return axios.get(`/mapserver/api/table-columns/${schema}/${table}`).then(({data}) => {
    columns.value = data.map(v=>({value:v.ColumnName,label:v.ColumnName}));

    props.setSchemaByModel("id_fieldname", "options",columns.value );
    props.setSchemaByModel("column_selects", "options",columns.value);
    props.setSchemaByModel("unique_value_field", "options",columns.value);

  });
}

const db_schema = computed(() => {
  return props.model.form["db_schema"];
});

const db_table = computed(() => {
  return props.model.form["db_table"];
});
const column_selects = computed(() => {
  return props.model.form["column_selects"];
});
function contains(str, target) {
  const lowerCaseStr = str.toLowerCase();
  return lowerCaseStr.includes(target);
}
watch(db_schema, () => {
  props.setSchemaByModel("db_table", "options", getTables());
  // props.model.form["db_table"] = null;
  // props.model.form["geometry_type"] = null;
  // props.model.form["geometry_fieldname"] = null;
  // props.model.form["id_fieldname"] = null;
  // props.model.form["column_selects"] = null;
})
watch(column_selects, (value, oldValue) =>{

  if(oldValue !== null){
    if(value !== oldValue){
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

      props.model.form["popup_template"] = infoValue
    }

  }


})
watch(db_table, () => {
  if(props.model.form["db_schema"] && props.model.form["db_table"]){

    getTableColumns(props.model.form["db_schema"], props.model.form["db_table"]);

  }

  const index = geometryTables.value.findIndex(v=>v.TableName === db_table.value);
  if(index !== -1) {
    if(contains(geometryTables.value[index].Type, "line")) {
      props.model.form["geometry_type"] = "LineString"
    } else if(contains(geometryTables.value[index].Type, "poly")) {
      props.model.form["geometry_type"] = "Polygon"
    } else if(contains(geometryTables.value[index].Type, "point")) {
      props.model.form["geometry_type"] = "Point"
    } else {
      props.setSchemaByModel("geometry_type", "disabled", false);
    }

    props.model.form["geometry_fieldname"] = geometryTables.value[index].GeometryColumn;
  }
});

onMounted(() => {
  getGeometryTables();
});

</script>
