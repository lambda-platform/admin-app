<template>
  <div class="grid grid-cols-3 gap-4 pt-4 ">
    <!-- Left side: Employee selection (EmployeesSelector Component) -->
    <div class="bg-gray-100  col-span-1 text-xs">
      <h3 class="flex items-center mb-1 font-semibold text-gray-900 dark:text-white">Ажилтнуудыг сонгох</h3>
      <!-- EmployeesSelector -->
      <div class="mb-2">
        <label>
          Алба хэлтэс <br />
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
          Ажилтан <br />
          <!-- Custom list of employees -->
          <ul class="max-h-[300px] overflow-y-auto">
            <li v-for="(employee, index) in employees" :key="index" class="flex justify-between items-center py-2 border-b">
              <div class="flex items-center space-x-3">
                <a-avatar style="width: 32px; height: 32px; flex: none;">
                  <template #icon>
                    <div class="flex items-center justify-center h-full w-full">
                      <img
                        alt="avatar"
                        class="h-full w-full object-cover bg-no-repeat bg-center"
                        :src="employee.avatar !== null && employee.avatar !== '' ? 'https://emiat.miat.com' + employee.avatar : '/miat/defaultAvatar.svg'"
                      />
                    </div>
                  </template>
                </a-avatar>
                <span>{{ employee.lastname }} {{ employee.firstname }}</span>
              </div>
              <button
                @click="addEmployee(employee)"
                type="button"
                class="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-600"
              >
                +
              </button>
            </li>
          </ul>
        </label>
      </div>
    </div>
    <!-- Right side: View selected employees -->
    <div class="bg-white p-4  rounded-lg col-span-2 text-xs">
      <h3 class="flex items-center mb-1 font-semibold text-gray-900 dark:text-white">Сонгосон ажилтнууд</h3>
      <table class="min-w-full table-auto border-collapse border border-gray-300 text-xs">
        <thead>
        <tr>
          <th class="border border-gray-300 px-1 py-1">#</th>
          <th class="border border-gray-300 px-1 py-1">Овог</th>
          <th class="border border-gray-300 px-1 py-1">Нэр</th>
          <th class="border border-gray-300 px-1 py-1">Албан тушаал</th>
          <th class="border border-gray-300 px-1 py-1">Хэлтэс</th>
          <th class="border border-gray-300 px-1 py-1">Үйлдэл</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(employee, index) in selectedEmployees" :key="employee.id">
          <td class="border border-gray-300 px-1 py-1">{{ index + 1 }}</td>
          <td class="border border-gray-300 px-1 py-1">{{ employee.lastname }}</td>
          <td class="border border-gray-300 px-1 py-1">{{ employee.firstname }}</td>
          <td class="border border-gray-300 px-1 py-1">{{ employee.position }}</td>
          <td class="border border-gray-300 px-1 py-1">{{ employee.department }}</td>
          <td class="border border-gray-300 px-1 py-1 align-center">
            <DeleteOutlined class="ml-2 hover:text-primary_color text-red-600  cursor-pointer" @click="removeEmployee(employee.id)" />
          </td>
        </tr>
        </tbody>
      </table>
      <!-- Action Buttons: Save and Cancel -->
      <div class="mt-4 flex items-start justify-end space-x-2 ">
        <div class="flex-grow">
          <a-textarea v-model:value="description" placeholder="Тайлбар" allow-clear class="w-full"/>
        </div>
        <div class="flex justify-between space-x-2 text-xs">
           <span
             @click="emitSave"
             type="button"
             class="bg-blue-500 text-white px-3 py-2  rounded-xl cursor-pointer hover:bg-blue-600"
           >
          {{props.isTransfer ? 'Сонгогдсон ажилтанруу явуулах' : 'Сонгогдсоныг хадгал'}}
        </span>
          <span
            @click="emitCancel"
            type="button"
            class="bg-gray-500 text-white px-3 py-2  rounded-xl cursor-pointer hover:bg-gray-600"
          >
          Болих
        </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, defineEmits, defineProps} from 'vue';
import {getStructs, getStructEmployees} from '~/modules/workflow/graphql/fetch.js';
import {DeleteOutlined} from '@ant-design/icons-vue';
import {message} from "ant-design-vue";

// Emit events for saving and canceling
const emit = defineEmits(['save', 'cancel']);
const props = defineProps({
  selectedEmployees: Array,
  isTransfer: Boolean
});
const description = ref(null)
const struct_id_v = ref(null);
const structs = ref([]); // Define structs ref here
const employees = ref([]);
const selectedEmployees = ref([...props.selectedEmployees]); // Initialize with prop data

// Fetch structures on mounted
onMounted(() => {
  getStructs("").then(({eo_structure}) => {
    processStructData(eo_structure);
  });
});

function processStructData(structureData) {
  let map = {}, node, roots = [];
  const treeData = structureData.map((struct) => ({
    key: struct.struct_id,
    value: struct.struct_id,
    label: struct.STRUCT_NAME,
    parent1: struct.STRUCT_PID,
    children: [],
  }));
  treeData.forEach((item, i) => (map[item.key] = i));
  treeData.forEach((item) => {
    node = item;
    if (node.parent1 !== 0 && map[node.parent1] !== undefined) {
      treeData[map[node.parent1]].children.push(node);
    } else {
      roots.push(node);
    }
  });
  structs.value = roots;  // Set structs to be used in the tree selector
}

// Fetch employees when a struct is selected
async function selectStruct() {
  if (struct_id_v.value) {
    getStructEmployees(struct_id_v.value.toString()).then(({vw_userstruct}) => {
      employees.value = uniqueByEmpId(vw_userstruct).map(emp => ({
        id: emp.emp_id,
        emp_id: emp.emp_id,
        JOB_ID: emp.JOB_ID,
        struct_id: emp.struct_id,
        lastname: emp.LNAME,
        firstname: emp.FNAME,
        label: emp.FNAME,
        searchValue: `${emp.firstname} ${emp.lastname}`,
        avatar: emp.USER_AVATAR ? emp.USER_AVATAR : "/uploaded/idpic/" + emp.emp_idNUM + ".jpg",
        position: emp.JOB_NAME,
        department: emp.STRUCT_NAME,
        ...emp
      }));
    });
  } else {
    employees.value = [];
  }
}



// Add employee to selectedEmployees list
function addEmployee(employee) {
  if (!selectedEmployees.value.find((emp) => emp.id === employee.id)) {
    selectedEmployees.value.push(employee);
  }
}

// Remove employee from the selected list
function removeEmployee(id) {
  selectedEmployees.value = selectedEmployees.value.filter((emp) => emp.id !== id);
}

// Emit save event with selected employees
function emitSave() {
  if(selectedEmployees.value.length > 0) {
    emit('save', selectedEmployees.value, description.value);
  } else {
    message.warn("Ажилтан сонгоогүй байна !!!!")
  }

}

// Emit cancel event
function emitCancel() {
  emit('cancel');
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
</script>
