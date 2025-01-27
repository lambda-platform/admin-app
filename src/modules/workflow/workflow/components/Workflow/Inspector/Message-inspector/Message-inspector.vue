<template>
  <div>
    <h1>Тохиргоо</h1>
    <label>Нэр
      <a-input v-model:value="label" v-batch="{ eventBusService }" @change="()=>changeCellProp(cellProps.label, label)"
               placeholder="Нэр"/>
    </label>
    <label>Тайлбар
      <a-textarea placeholder="Тайлбар" v-batch="{ eventBusService }" v-model:value="description" show-count
                  @change="()=>changeCellProp(cellProps.description, description)"/>
    </label>
    <label>Хариуцагчийн төрөл
      <a-radio-group
          v-model:value="subject_type"
          @change="()=>changeCellProp(cellProps.subject_type, subject_type)">
        <a-radio value="ANY_EMP">Бүртгэлтэй хэрэглэгч</a-radio>
        <a-radio  value="VOTERS">Санал өгөгчид</a-radio>
        <a-radio  value="TO_ROLE">Системийн Хандах эрхээр</a-radio>
        <a-radio  value="DIRECT">Системийн хэрэглэгч</a-radio>
        <a-radio value="CREATOR">Боловсруулсан хэрэглэгч</a-radio>
      </a-radio-group>
    </label>
    <div v-if="subject_type === 'TO_ROLE'">
      <RoleUserSelector  v-model:role_id="role_id" v-model:user_id="user_id"  @change="changeStructEmp" :hide-user-select="true" />
    </div>
    <div v-if="subject_type === 'DIRECT'">
      <RoleUserSelector  v-model:role_id="role_id" v-model:user_id="user_id"  @change="changeStructEmp" />
    </div>
    <hr class="my-3">
    <a-checkbox v-model:checked="is_read_only"  @change="()=>changeCellProp(cellProps.is_read_only, is_read_only)">Зөвхөн харах</a-checkbox>
    <br>
    <a-checkbox v-model:checked="is_signature_needed"  @change="()=>changeCellProp(cellProps.is_signature_needed, is_signature_needed)">Цахимаар гарын үсэг зурах</a-checkbox>
    <div class="ports">
      <div class="out-ports-bar">
        <span>Үйлдлүүд</span>
        <button :disabled="!canAddPort"
                @click="addCellPort"
                class="add-port"
                type="button"
                data-tooltip="Үйлдэл нэмэх">
        </button>
      </div>
      <div class="port" v-for="port in ports" :key="port.id">
        <a-input v-model:value="port.label" v-batch="{ eventBusService }" @change="()=>changeCellPort(port)"
                 placeholder="Үйлдэл нэр"/>
        <div class="remove-port"
             @click="removeCellPort(port.id)"
             data-tooltip="Үйлдэл устгах"></div>
      </div>
    </div>
  </div>
</template>
<script setup>

import RoleUserSelector from "~/modules/common/RoleUserSelector.vue";
import {dia} from '@clientio/rappid/rappid';
import {ref, watch, onMounted} from 'vue';

const eventBusService = getCurrentInstance().appContext.config.globalProperties.$eventBusService;

const props = defineProps({
  cell: dia.Cell,
  structs: Array,
});

const context = ref({id: props.cell.id});

const label = ref('');
const description = ref('');
const icon = ref('');
const ports = ref([]);
const canAddPort = ref(false);
const is_read_only = ref(false);
const is_signature_needed = ref(false);

const object_type = ref('');
const subject_type = ref('');
const user_id = ref('');
const role_id = ref('');

const cellProps = {
  label: ['attrs', 'label', 'text'],
  description: ['attrs', 'description', 'text'],
  object_type: ['attrs', 'subject', 'object_type'],
  subject_type: ['attrs', 'subject', 'subject_type'],
  user_id: ['attrs', 'subject', 'user_id'],
  role_id: ['attrs', 'subject', 'role_id'],
  is_read_only: ['attrs', 'subject', 'is_read_only'],
  is_signature_needed: ['attrs', 'subject', 'is_signature_needed'],
  icon: ['attrs', 'icon', 'xlinkHref'],
  portLabel: ['attrs', 'portLabel', 'text']
};

// Assign form fields
const assignFormFields = () => {
  label.value = props.cell.prop(cellProps.label);
  description.value = props.cell.prop(cellProps.description);
  object_type.value = props.cell.prop(cellProps.object_type);
  subject_type.value = props.cell.prop(cellProps.subject_type);
  user_id.value = props.cell.prop(cellProps.user_id);
  role_id.value = props.cell.prop(cellProps.role_id);
  is_read_only.value = props.cell.prop(cellProps.is_read_only);
  is_signature_needed.value = props.cell.prop(cellProps.is_signature_needed);
  icon.value = props.cell.prop(cellProps.icon);
  assignFormPorts();
};

// Assign form ports
const assignFormPorts = () => {
  canAddPort.value = props.cell.canAddPort('out');
  ports.value = props.cell.getGroupPorts('out').map(({id}) => ({
    id,
    label: props.cell.portProp(id, cellProps.portLabel)
  }));
};

const changeCellProp = (path, value) => {
  props.cell.prop(path, value);
}

const changeStructEmp = (structEmp) => {
  changeCellProp(cellProps.role_id, structEmp.role_id)
  changeCellProp(cellProps.user_id, structEmp.user_id)
}

const addCellListener = (cell) => {
  cell.on('change', () => assignFormFields(), context.value);
}

const removeCellListener = (cell) => {
  cell.off(null, null, context.value);
}

const addCellPort = () => {
  props.cell.addDefaultPort();
  assignFormPorts();
}

const removeCellPort = (portId) => {
  props.cell.removePort(portId);
  assignFormPorts();
}

const changeCellPort = (port) => {
  props.cell.portProp(port.id, cellProps.portLabel, port.label);
}

// Watch for changes
watch(() => props.cell, (newCell, oldCell) => {
  removeCellListener(oldCell);
  addCellListener(newCell);
  assignFormFields();
});

onMounted(() => {
  addCellListener(props.cell);
  assignFormFields();
});
</script>
