<template>
    <div>
        <h1>Үндсэн үйлдэл</h1>
        <label>Нэр
          <a-input v-model:value="label"  v-batch="{ eventBusService }"  @change="()=>changeCellProp(cellProps.label, label)" placeholder="Нэр" />
        </label>

      <label>Хариуцагчийн төрөл

        <a-radio-group
            v-model:value="subject_type"
            @change="()=>changeCellProp(cellProps.subject_type, subject_type)">
          <a-radio  value="ANY_EMP">Бүртгэлтэй хэрэглэгч</a-radio>
          <a-radio  value="VOTERS">Санал өгөгчид</a-radio>
          <a-radio  value="TO_ROLE">Системийн Хандах эрхээр</a-radio>
          <a-radio  value="DIRECT">Системийн хэрэглэгч</a-radio>
          <a-radio  value="CREATOR">Боловсруулсан хэрэглэгч</a-radio>
        </a-radio-group>

      </label>
      <div v-if="subject_type === 'TO_ROLE'">
        <RoleUserSelector  v-model:role_id="role_id" v-model:user_id="user_id"  @change="changeStructEmp" :hide-user-select="true" />
      </div>
      <div v-if="subject_type === 'DIRECT'">
        <RoleUserSelector  v-model:role_id="role_id" v-model:user_id="user_id"  @change="changeStructEmp" />
      </div>
    </div>
</template>
<script setup>
import {onMounted, ref, watch} from 'vue';
import {dia} from "@clientio/rappid/rappid";
import RoleUserSelector from "~/modules/common/RoleUserSelector.vue";


const eventBusService = getCurrentInstance().appContext.config.globalProperties.$eventBusService;
// Props
const props = defineProps({
  cell: dia.Cell,

});

const label = ref('');
const object_type = ref('');
const subject_type = ref('');
const role_id = ref('');
const user_id = ref('');

const context = ref({ id: props.cell.id });

const cellProps = {
  label: ['attrs', 'label', 'text'],
  object_type: ['attrs', 'subject', 'object_type'],
  subject_type: ['attrs', 'subject', 'subject_type'],
  role_id: ['attrs', 'subject', 'role_id'],
  user_id: ['attrs', 'subject', 'user_id'],
};

// Assign form fields
const assignFormFields = () => {
  label.value = props.cell.prop(cellProps.label);
  object_type.value = props.cell.prop(cellProps.object_type);
  subject_type.value = props.cell.prop(cellProps.subject_type);
  role_id.value = props.cell.prop(cellProps.role_id);
  user_id.value = props.cell.prop(cellProps.user_id);
};


const changeCellProp = (path, value)=>{
  props.cell.prop(path, value);
}
const changeStructEmp = (structEmp)=>{
  changeCellProp(cellProps.role_id, structEmp.role_id)
  changeCellProp(cellProps.user_id, structEmp.user_id)
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
