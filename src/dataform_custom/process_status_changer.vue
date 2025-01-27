<template>
  <lambda-form-item :label="label" :name="model.component" :meta="meta">

    <a-select
        v-model:value="model.form[model.component]"
        show-search
        style="width: 100%"
        placeholder="Төлөв сонгох"
        optionFilterProp="searchValue"
        optionLabelProp="label"
        :options="statusHistories"
        :show-search="true"
        @change="statusIDChange"
        :loading="!statusHistories.length"
        allow-clear
    >
    </a-select>
  </lambda-form-item>
</template>
<script setup>
import {ref, onMounted, defineProps} from 'vue';

import axios from "~/plugins/core/axios";

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
  isBuilder: Boolean
});

const statusHistories = ref([]);

onMounted(() => {

  getStatusHistories();

});

function statusIDChange(statusID) {
  const index = statusHistories.value.findIndex((e) => e.status_id === statusID);
  if (index >= 0) {
    props.model.form["status_type"] = statusHistories.value[index].status_type;
    props.model.form["status"] = statusHistories.value[index].status;
  }
}

async function getStatusHistories() {

  if (rowID.value) {
    axios.get(`/process/history/${rowID.value}`).then(({data}) => {
      statusHistories.value = data.statusHistories.map(s=>{
        return {...s, value:s.status_id, label:s.status}
      });
    })
  } else {
    statusHistories.value = [];
  }

}
const rowID = computed(() => {
  return props.model.form["id"]
});

watch(rowID, () => {
  getStatusHistories();
});

</script>

