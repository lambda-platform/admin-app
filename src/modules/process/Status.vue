<template>
  <div>

    <Loading v-if="loading"/>
    <div v-else>



      <div class="flex justify-end items-center gap-3" :class="chooseEmployees ? 'opacity-50 cursor-none pointer-events-none' : 'opacity-100'">

        <div v-if="iCanEdit"
             v-for="(nextStep, index) in statusHistory.filter(h=>{
               if(h.status_type === 'TRANSFER'){
                 return h.is_done === 0 && h.step_data
               } else {
                 return h.is_done === 0 && h.status_id !== currentStep.id && h.step_data
               }
             })"
             :key="index"


        >

          <a-popover trigger="click" placement="leftBottom" :open="statusHistory[index].open"
                     v-if="(currentStep.attrs.subject.object_type !== 'GIVE' && nextStep.step_data.sourcePortLabel !== 'Холбогдох хүмүүст цохсон') ? nextStep.step_data.attrs.subject.object_type === 'END_VOTE' ? (nextStep.step_data.attrs.subject.object_type === 'END_VOTE' && props.user_id !== userInfo.id) : true : false"

          >
            <template #content>
              <div>
                <button @click="statusHistory[index].open = false" class="absolute right-3 top-3">


              <span role="img" aria-label="close" class="anticon anticon-close">
                <svg focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" fill-rule="evenodd" viewBox="64 64 896 896"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>
              </span>
                </button>




                <div >

                  <div class="p-2">
                    <a-alert
                      v-if="nextStep.step_data.attrs.description && currentStep.attrs.subject.object_type !== 'VOTE' && nextStep.step_data.attrs.description.text"
                      :message="`${getStatusLabel(nextStep.step_data.attrs.description.text)}`"
                      type="info"
                      size="small"
                      show-icon
                      style="max-width: 95%"
                    />
                    <div v-if="nextStep.status_type !== 'VOTE' && currentStep.attrs.subject.object_type !== 'VOTE'">
                      <div class="">{{ nextStep.step_data.attrs.label.text }} </div>
                      <div class="w-full">
                        <div class="w-full">
                          <div v-if="nextStep.subject_type === 'TO_ROLE'">
                            <RoleUserSelector :disabled="!nextStep.is_subject_changeable" v-model:role_id="nextStep.role_id" v-model:user_id="nextStep.user_id" @change="(d)=>changeEmp(nextStep.status_id, d)" :hide-user-select="true" />
                          </div>
                          <div v-if="nextStep.subject_type === 'DIRECT'">
                            <RoleUserSelector :disabled="!nextStep.is_subject_changeable" v-model:role_id="nextStep.role_id" v-model:user_id="nextStep.user_id" @change="(d)=>changeEmp(nextStep.status_id, d)" />
                          </div>
                          <div v-if="nextStep.subject_type === 'TO_ORG_STRUCT'">
                            <OrgStructEmployeeSelector :disabled="!nextStep.is_subject_changeable"  v-model:org_role_id="nextStep.org_role_id" v-model:org_id="nextStep.org_id" v-model:struct_id="nextStep.struct_id" v-model:job_id="nextStep.job_id" v-model:emp_id="nextStep.emp_id" @change="(d)=>changeEmp(nextStep.status_id, d)" mode="TO_ORG_STRUCT"/>
                          </div>
                          <div v-if="nextStep.subject_type === 'TO_ORG_JOB'">
                            <OrgStructEmployeeSelector :disabled="!nextStep.is_subject_changeable" v-model:org_role_id="nextStep.org_role_id" v-model:org_id="nextStep.org_id" v-model:struct_id="nextStep.struct_id" v-model:job_id="nextStep.job_id" v-model:emp_id="nextStep.emp_id"  @change="(d)=>changeEmp(nextStep.status_id, d)" mode="TO_ORG_JOB"/>
                          </div>
                          <div v-if="nextStep.subject_type === 'TO_ORG_EMPLOYEE'">
                            <OrgStructEmployeeSelector :disabled="!nextStep.is_subject_changeable"  v-model:org_role_id="nextStep.org_role_id" v-model:org_id="nextStep.org_id" v-model:struct_id="nextStep.struct_id" v-model:job_id="nextStep.job_id" v-model:emp_id="nextStep.emp_id" @change="(d)=>changeEmp(nextStep.status_id, d)"  mode="TO_ORG_EMPLOYEE"/>
                          </div>
                        </div>


                      </div>
                    </div>
                    <a-textarea v-model:value="description" placeholder="Тайлбар" allow-clear class="mb-1 mt-1"/>
                  </div>

                  <signature v-if="currentStep.attrs.subject.is_signature_needed"
                             class="mb-2"
                             ref="Digitalsignature"
                             :action="nextStep.step_data.sourcePortLabel"
                             :userSigned="empsignature !== null && empsignature !== undefined && empsignature !== ''"
                             @signed="Signed"
                             @settingsOpened="()=>settingsOpened(index)"
                  />

                  <div class="flex justify-end" >


              <span
                v-if="currentStep.attrs.subject.object_type !== 'VOTE'"

                @click="saveAndGoToNext(nextStep, nextStep.step_data.sourcePortLabel)"
                :class="`px-3 py-2  rounded-xl cursor-pointer ${getStatusBgColor(nextStep.status_type)} ${ currentStep.attrs.subject.is_signature_needed && !empsignature ? 'opacity-50 cursor-none pointer-events-none' :''}`">
                <span>
                  {{ getStatusLabel(nextStep.status) }}
                  <span v-if="nextStep.step_data.attrs.subject.object_type !== 'END' && nextStep.step_data.attrs.subject.object_type !== 'CANCEL'"> шат руу илгээх</span>
                </span>
              </span>
                    <span
                      v-else-if="currentStep.attrs.subject.object_type === 'VOTE'"
                      @click="saveAndGoToNext(nextStep, nextStep.step_data.sourcePortLabel)"
                      :class="`fff px-3 py-2  rounded-xl cursor-pointer ${getStatusBgColor(nextStep.status_type)} ${ currentStep.attrs.subject.is_signature_needed && !empsignature ? 'opacity-50 cursor-none pointer-events-none' :''}`">
                      <span>
                        {{
                          nextStep.step_data.sourcePortLabel
                        }} санал илгээх
                      </span>
                    </span>





                  </div>
                </div>


              </div>

            </template>
            <div>

        <span
          @click="statusHistory[index].open = true"
          :class="`px-3 py-2  rounded-xl cursor-pointer ${getStatusBgColor(nextStep.step_data.attrs.subject.object_type)}`">
          <span>
              {{
              nextStep.step_data.sourcePortLabel ? getStatusLabel(nextStep.step_data.sourcePortLabel) : getStatusLabel(nextStep.status) + ' шат руу илгээх'
            }}
          </span>
        </span>

            </div>
          </a-popover>


          <span v-if="currentStep.attrs.subject.object_type === 'GIVE'"
                @click="startTransfer(nextStep, nextStep.step_data.sourcePortLabel)"
                :class="`px-3 py-2 rounded-xl cursor-pointer ${getStatusBgColor(nextStep.step_data.attrs.subject.object_type)}`">
          <span>
            Ажилтнуудыг сонгох
          </span>
        </span>

          <span v-if="currentStep.attrs.subject.object_type === 'TRANSFER' && nextStep.step_data.sourcePortLabel === 'Холбогдох хүмүүст цохсон'"
                @click="startTransfer(nextStep, nextStep.step_data.sourcePortLabel)"
                :class="`px-3 py-2 rounded-xl cursor-pointer ${getStatusBgColor(nextStep.step_data.attrs.subject.object_type)}`">
          <span>
           Цохох
          </span>
        </span>

          <span v-if="nextStep.step_data.attrs.subject.object_type === 'END_VOTE' && props.emp_id === userInfo.emp_id && nextStep.step_data.sourcePortLabel === 'Зөвшөөрнө'"
                @click="saveAndGoToNext(nextStep, nextStep.step_data.sourcePortLabel, true)"
                :class="`px-3 py-2 rounded-xl cursor-pointer ${getStatusBgColor(nextStep.step_data.attrs.subject.object_type)}`">
                        Төсөл хаах
                      </span>

          <div>
          </div>


        </div>
        <div class="absolute  left-0 flex justify-end pt-2 hidden sm:block">


          <span :class="`px-3 py-2 rounded-xl cursor-pointer ${getStatusBgColor(currentStep.attrs.subject.object_type)}`"
                @click="save" v-if="currentStep.attrs.subject.object_type !== 'END' && !isVote && iCanEdit">
            {{t("process.save")}}
          </span>
<!--          <span :class="`px-3 py-2 rounded-xl cursor-pointer ${getStatusBgColor(currentStep.attrs.subject.object_type)}`"-->
<!--                @click="close" v-if="currentStep.attrs.subject.object_type === 'END' || isVote || !iCanEdit">-->
<!--            {{t("process.back")}}-->
<!--          </span>-->
<!--          <span :class="`ml-1 ml-2 px-3 py-2 rounded-xl cursor-pointer ${getStatusBgColor(currentStep.attrs.subject.object_type)}`"-->
<!--                @click="close">-->
<!--            {{t("process.back")}}-->
<!--          </span>-->
        </div>

      </div>
      <div v-if="chooseEmployees">

        <EmployeesSelector
          :selected-employees="selectedEmployees"
          :is-transfer="currentStep.attrs.subject.object_type === 'TRANSFER'"
          @cancel="cancelSelectedEmployee"
          @save="saveSelectedEmployee" />
      </div>
    </div>
  </div>
</template>
<script setup>
import {defineEmits, defineProps, ref, getCurrentInstance} from "vue";
import {useI18n} from 'vue-i18n';
import { EventBus } from '~/modules/process/subjectEvent';
import { userInfo } from '~/store/useSiteSettings';
const {te, t} = useI18n();
import signature from "~/modules/signature/signature.vue";
import EmployeesSelector from "./EmployeesSelector.vue";

const Digitalsignature = ref();
const {proxy} = getCurrentInstance();

import RoleUserSelector from "~/modules/common/RoleUserSelector.vue"
import OrgStructEmployeeSelector from "~/modules/common/OrgStructEmployeeSelector.vue"

const empsignature = ref(null)
const description = ref(null)

const globalOrgRoleID = ref(null);
const transferStep = ref(null);
const chooseEmployees = ref(false);
const loading = ref(false);
const selectedEmployees = ref([]);

function cancelSelectedEmployee() {
  selectedEmployees.value = [];
  chooseEmployees.value = false;
}
function saveSelectedEmployee(emps, description) {

  // selectedEmployees.value = emps;
  // chooseEmployees.value = false;

  loading.value = true;
  emit("transfer", {...transferStep.value, currentdescription:description}, emps);
}
function startTransfer(nextStep, sourcePortLabel) {
  transferStep.value = {...nextStep,
    signature: empsignature.value,
    currentdescription: description.value,
    sourcePortLabel: sourcePortLabel};
  chooseEmployees.value = true;

}

import {getStatusBgColor} from "~/modules/workflow/flow/status";
import StructAndEmpSelector from "~/modules/common/StructAndEmpSelector.vue"

import "~/modules/workflow/styles/status.scss";

import { currentStep, iCanEdit} from "~/store/useSiteSettings";
import Loading from "~/modules/common/Loading.vue";
const emit = defineEmits(['saveAndGoToNext', 'save', 'changeEmp', 'close', 'transfer']);
const props = defineProps({
  statusHistory: Array,
  isVote: Boolean,
  emp_id: Number,
  user_id: String,
});

function getStatusLabel(key) {
  if (te("process." + key)) {
    return t("process." + key)
  } else {
    return key
  }
}

function saveAndGoToNext(step, sourcePortLabel, endVote) {
  loading.value = true;
  emit('saveAndGoToNext', {
    ...step,
    signature: empsignature.value,
    currentdescription: description.value,
    sourcePortLabel: sourcePortLabel
  }, endVote ? [] : undefined, endVote);
}

function save(step) {
  loading.value = true;
  emit('save', step);
}

function close() {
  loading.value = true;
  emit('close');
}

function getSignTypeLabel() {
  const selectedOption = signTypes.value.find(option => option.value === signature.value.type);
  return selectedOption ? selectedOption.label : null;
}

function isSubjectSelected(step) {
  if (step.status_type === "VOTE") {
    return true
  } else {
    if (step.struct_id === null || step.emp_id === null) {
      return false
    } else {
      return true;
    }
  }

}

function changeEmp(status_id, data) {
  emit('changeEmp', {status_id, ...data});
}

function settingsOpened(index) {
  props.statusHistory[index].open = false;
}

function Signed(signatureData) {


  empsignature.value = signatureData;

}


const globalSubjectHandler = (payload) => {

  props.statusHistory.forEach(h=>{
    if(h.is_done === 0 && h.status_id !== currentStep.value.id && h.step_data){

      if(payload.emp_id || payload.emp_id === null){
        h.emp_id = payload.emp_id;
      }
      if(payload.job_id || payload.job_id === null){
        h.job_id = payload.job_id;
      }
      if(payload.struct_id || payload.struct_id === null){
        h.struct_id = payload.struct_id;
      }
      if(payload.org_id || payload.org_id === null){
        h.org_id = payload.org_id;
      }
      if(payload.org_role_id || payload.org_role_id === null){
        h.org_role_id = payload.org_role_id;
      }
      if(payload.user_id || payload.user_id === null){
        h.user_id = payload.user_id;
      }
      if(payload.role_id || payload.role_id === null){
        h.role_id = payload.role_id;
      }
    }

    emit('changeEmp', {status_id:h.status_id, ...h});
  })



};

onMounted(() => {
  EventBus.on('globalSubject', globalSubjectHandler);

  // console.log(props.statusHistory)
});

onUnmounted(() => {
  EventBus.off('globalSubject', globalSubjectHandler);

});

</script>

<style scoped lang="scss">

</style>
