<template>
  <div class="mb-2">
    <label>
      Алба хэлтэс <br>
      <a-tree-select
        v-model:value="struct_id_v"
        placeholder="Алба хэлтэс сонгох"
        :tree-data="structs"
        @change="selectStruct"
        tree-node-filter-prop="label"
        :dropdownMatchSelectWidth="false"
        tree-line
        tree-default-expand-all
        allow-clear
        show-search
        style="width: 100%"
      ></a-tree-select>
    </label>
  </div>
  <div>
    <label>
      Ажилтан <br>
      <a-select
        v-model:value="emp_id_v"
        show-search
        style="width: 100%"
        placeholder="Ажилтан сонгох"
        optionFilterProp="searchValue"
        optionLabelProp="label"
        :options="employees"
        :show-search="true"
        allow-clear
      >
        <template #option="{ value: val, label, avatar}">
          <div class="flex items-center space-x-3 font-semibold">
            <a-avatar style="width: 32px; height: 32px; flex: none;">
              <template #icon>
                <div class="flex items-center justify-center h-full w-full">
                  <img alt="avatar" class="h-full w-full object-cover bg-no-repeat bg-center"
                       :src="avatar !== null && avatar !== '' ? 'https://emiat.miat.com'+avatar : '/miat/defaultAvatar.svg'">
                </div>
              </template>
            </a-avatar>
            <span>{{ label }}</span>
          </div>
        </template>


      </a-select>
    </label>
  </div>
</template>
<script setup>
import {ref, onMounted, defineEmits, defineProps} from 'vue';

const emit = defineEmits(['update:struct_id', 'update:emp_id', 'change']);

const props = defineProps({
  struct_id: Number,
  emp_id: Number
});

import {getStructs, getStructEmployees} from "~/modules/workflow/graphql/fetch.js"

const struct_id_v = ref(null);
const emp_id_v = ref(null);
const structs = ref([]);
const employees = ref([]);

onMounted(() => {

  const name = '';
  getStructs(name).then(({eo_structure}) => {

    if (props.struct_id) {
      struct_id_v.value = props.struct_id;
      selectStruct();
    }
    if (props.emp_id) {
      emp_id_v.value = props.emp_id;
    }
    processStructData(eo_structure);
  });

});

function processStructData(structureData) {
  let map = {}, node, roots = [];
  const treeData = structureData.map(struct => ({
    key: struct.struct_id,
    value: struct.struct_id,
    label: struct.STRUCT_NAME,
    parent1: struct.STRUCT_PID,
    children: [],
  }));
  treeData.forEach((item, i) => (map[item.key] = i));
  treeData.forEach(item => {
    node = item;
    if (node.parent1 !== 0 && map[node.parent1] !== undefined) {
      treeData[map[node.parent1]].children.push(node);
    } else {
      roots.push(node);
    }
  });
  structs.value = roots;
}

function uniqueByEmpId(arr) {
  const unique = arr.reduce((acc, current) => {
    const x = acc.find(item => item.emp_id === current.emp_id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return unique;
}

async function selectStruct() {
  emp_id_v.value = null;

  if (struct_id_v.value) {
    getStructEmployees(struct_id_v.value.toString()).then(({vw_userstruct}) => {
      employees.value = uniqueByEmpId(vw_userstruct.map(emp => ({
        value: emp.emp_id,
        id: emp.emp_id,
        emp_id: emp.emp_id,
        lastname: emp.LNAME,
        firstname: emp.FNAME,
        label: emp.FNAME,
        searchValue: `${emp.firstname} ${emp.lastname}`,
        avatar: emp.USER_AVATAR ? emp.USER_AVATAR : "/uploaded/idpic/" + emp.emp_idNUM + ".jpg",
        ...emp
      })));
    })
  } else {
    employees.value = [];
  }

}



watch(() => props.struct_id, (newVal) => {
  struct_id_v.value = newVal;
});

watch(() => props.emp_id, (newVal) => {
  emp_id_v.value = newVal;
});

watch(struct_id_v, (newValue, oldValue) => {
  emit('update:struct_id', newValue);
  emit('change', {struct_id: newValue, emp_id: emp_id_v.value});
});

watch(emp_id_v, (newValue, oldValue) => {
  emit('update:emp_id', newValue);
  emit('change', {struct_id: struct_id_v.value, emp_id: newValue});
});

</script>

