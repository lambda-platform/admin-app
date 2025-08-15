<template>
  <div class="w-[300px] bg-white p-4 overflow-y-auto shadow-md">
    <h2 class="text-lg font-semibold mb-4">Тохиргоо</h2>
    <div v-if="selectedNode">
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Нэр</label>
        <a-input
          v-model:value="selectedNode.data.label"
          placeholder="Нэр"
          class="w-full"
          @change="$emit('update-node-label')"
        />
      </div>
      <div class="mb-4" v-if="selectedNode.type !== 'trigger'">
        <label class="block text-sm font-medium mb-1">Тайлбар</label>
        <a-textarea
          v-model:value="selectedNode.data.description"
          placeholder="Тайлбарыг оруулна уу"
          :rows="2"
          show-count
          @change="$emit('update-node-description')"
        />
      </div>
      <div class="mb-4" v-if="selectedNode.type !== 'trigger' && selectedNode.data.subject">
        <label class="block text-sm font-medium mb-1">Хариуцагчийн төрөл</label>
        <a-radio-group
          v-model:value="selectedNode.data.subject.subject_type"
          @change="updateSubject"
        >
          <a-radio value="ANY_EMP">Бүртгэлтэй хэрэглэгч</a-radio>
          <a-radio value="VOTERS">Санал өгөгчид</a-radio>
          <a-radio value="TO_ORG_STRUCT">Байгууллага, алба хэлтэс</a-radio>
          <a-radio value="TO_ORG_JOB">Байгууллагын албан тушаал</a-radio>
          <a-radio value="TO_ORG_EMPLOYEE">Байгууллагын ажилтан</a-radio>
          <a-radio value="TO_ROLE">Системийн Хандах эрхээр</a-radio>
          <a-radio value="DIRECT">Тогтмол</a-radio>
          <a-radio value="CREATOR">Боловсруулсан хэрэглэгч</a-radio>
        </a-radio-group>
      </div>
      <div v-if="selectedNode.data.subject && selectedNode.data.subject.subject_type === 'TO_ROLE'" class="mb-4">
        <RoleUserSelector
          v-model:role_id="selectedNode.data.subject.role_id"
          v-model:user_id="selectedNode.data.subject.user_id"
          :hide-user-select="true"
          @change="updateSubject"
        />
      </div>
      <div v-if="selectedNode.data.subject && selectedNode.data.subject.subject_type === 'DIRECT'" class="mb-4">
        <RoleUserSelector
          v-model:role_id="selectedNode.data.subject.role_id"
          v-model:user_id="selectedNode.data.subject.user_id"
          @change="updateSubject"
        />
      </div>
      <div v-if="selectedNode.data.subject && selectedNode.data.subject.subject_type === 'TO_ORG_STRUCT'" class="mb-4">
        <OrgStructEmployeeSelector
          v-model:org_role_id="selectedNode.data.subject.org_role_id"
          v-model:org_id="selectedNode.data.subject.org_id"
          v-model:struct_id="selectedNode.data.subject.struct_id"
          v-model:job_id="selectedNode.data.subject.job_id"
          v-model:emp_id="selectedNode.data.subject.emp_id"
          @change="updateSubject"
          mode="TO_ORG_STRUCT"
        />
      </div>
      <div v-if="selectedNode.data.subject && selectedNode.data.subject.subject_type === 'TO_ORG_JOB'" class="mb-4">
        <OrgStructEmployeeSelector
          v-model:org_role_id="selectedNode.data.subject.org_role_id"
          v-model:org_id="selectedNode.data.subject.org_id"
          v-model:struct_id="selectedNode.data.subject.struct_id"
          v-model:job_id="selectedNode.data.subject.job_id"
          v-model:emp_id="selectedNode.data.subject.emp_id"
          @change="updateSubject"
          mode="TO_ORG_JOB"
        />
      </div>
      <div v-if="selectedNode.data.subject && selectedNode.data.subject.subject_type === 'TO_ORG_EMPLOYEE'" class="mb-4">
        <OrgStructEmployeeSelector
          v-model:org_role_id="selectedNode.data.subject.org_role_id"
          v-model:org_id="selectedNode.data.subject.org_id"
          v-model:struct_id="selectedNode.data.subject.struct_id"
          v-model:job_id="selectedNode.data.subject.job_id"
          v-model:emp_id="selectedNode.data.subject.emp_id"
          @change="updateSubject"
          mode="TO_ORG_EMPLOYEE"
        />
      </div>
      <div v-if="selectedNode.data.subject && selectedNode.type !== 'trigger'" class="mb-4">
        <a-checkbox
          v-model:checked="selectedNode.data.subject.is_read_only"
          @change="updateSubject"
        >
          Зөвхөн харах
        </a-checkbox>
        <a-checkbox
          v-model:checked="selectedNode.data.subject.is_signature_needed"
          @change="updateSubject"
        >
          Цахимаар гарын үсэг зурах
        </a-checkbox>
        <a-checkbox
          v-model:checked="selectedNode.data.subject.is_subject_changeable"
          @change="updateSubject"
        >
          Хариуцагч солих боломжтой
        </a-checkbox>
      </div>
      <div v-if="selectedNode.type === 'action'" class="mb-4">
        <h3 class="text-sm font-medium mb-2">Үйлдэлүүд</h3>
        <div class="space-y-2">
          <div
            v-for="triggerNode in getTriggerNodes(selectedNode.id)"
            :key="triggerNode.id"
            class="flex items-center"
          >
            <a-input
              v-model:value="triggerNode.data.label"
              placeholder="Үйлдэлийн Нэр"
              class="flex-1"
              @change="$emit('update-trigger-node', triggerNode.id)"
            />
            <a-popconfirm
              title="Энэ үйлдлийг устгахдаа итгэлтэй байна уу?"
              ok-text="Тийм"
              cancel-text="Үгүй"
              @confirm="$emit('delete-trigger', triggerNode.id)"
            >
              <button
                class="ml-2 text-red-500 hover:text-red-700 w-4 h-4 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-3 h-3 fill-current">
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 10.793a.5.5 0 0 1-.707.707L8 8.707 5.207 11.5a.5.5 0 0 1-.707-.707L7.293 8 4.5 5.207a.5.5 0 0 1 .707-.707L8 7.293l2.793-2.793a.5.5 0 0 1 .707.707L8.707 8l2.793 2.793z"/>
                </svg>
              </button>
            </a-popconfirm>
          </div>
        </div>
        <button
          class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          @click.prevent="$emit('add-trigger', selectedNode.id)"
        >
          Үйлдэл Нэмэх
        </button>
      </div>
      <a-popconfirm
        title="Устгахдаа итгэлтэй байна уу?"
        ok-text="Тийм"
        cancel-text="Үгүй"
        @confirm="$emit('delete-node', selectedNode.id)"
      >
        <button
          class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-4 h-4 fill-current mr-2">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 10.793a.5.5 0 0 1-.707.707L8 8.707 5.207 11.5a.5.5 0 0 1-.707-.707L7.293 8 4.5 5.207a.5.5 0 0 1 .707-.707L8 7.293l2.793-2.793a.5.5 0 0 1 .707.707L8.707 8l2.793 2.793z"/>
          </svg>
          Устгах
        </button>
      </a-popconfirm>
    </div>
    <div v-else class="text-gray-500">Засахын тулд үйлдэл сонгоно уу</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RoleUserSelector from '~/modules/common/RoleUserSelector.vue';
import OrgStructEmployeeSelector from '~/modules/common/OrgStructEmployeeSelector.vue';
import { Input as AInput, Textarea as ATextarea, Checkbox as ACheckbox, Radio as ARadio, RadioGroup as ARadioGroup } from 'ant-design-vue';

const props = defineProps({
  selectedNode: {
    type: Object,
    default: null
  },
  getTriggerNodes: {
    type: Function,
    required: true
  }
});

const emit = defineEmits([
  'update-node-label',
  'update-node-description',
  'update-trigger-node',
  'add-trigger',
  'delete-trigger',
  'delete-node',
  'update-subject'
]);

const updateSubject = () => {
  if (props.selectedNode && props.selectedNode.data.subject) {
    emit('update-subject', props.selectedNode.id);
  }
};
</script>

<style scoped>

</style>
