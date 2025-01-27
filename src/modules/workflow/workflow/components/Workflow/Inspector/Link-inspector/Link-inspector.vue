<template>
    <div>
        <h1>Холбоос</h1>
        <label>Холбоос нэр
          <a-input v-model:value="label"  v-batch="{ eventBusService }"  @change="()=>changeCellProp(cellProps.label, label)" placeholder="Холбоос нэр" />
        </label>
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {dia} from "@clientio/rappid/rappid";

const eventBusService = getCurrentInstance().appContext.config.globalProperties.$eventBusService;

// Props
const props = defineProps({
  cell: dia.Cell,
});

const context = ref({ id: props.cell.id });
const label = ref('');

const cellProps = {
  label: ['labels', 0, 'attrs', 'labelText', 'text']
};

// Assign form fields
const assignFormFields = () => {
  label.value = props.cell.prop(cellProps.label);
};

const changeCellProp = (path, value)=>{
  props.cell.prop(path, value);
}

const addCellListener = (cell)=> {
  cell.on('change', () => assignFormFields(), context.value);
}

const removeCellListener = (cell) =>{
  cell.off(null, null, context.value);
}

// Watch for changes
watch(() => props.cell, (newCell, oldCell) => {
  removeCellListener(oldCell);
  addCellListener(newCell);
  assignFormFields();
}, { deep: false });

onMounted(()=>{
  addCellListener(props.cell);
  assignFormFields();
});
</script>
