<template>
  <div class="flex justify-end items-center gap-3">
    <div
      v-for="(nextStep, index) in statusHistory.filter(h=>h.is_done === 0 && h.status_id !== currentStep.id && h.step_data)"
      :key="index"
    >
      <a-popover trigger="click" placement="leftBottom" :open="statusHistory[index].open">
        <template #content>
          <div>
            <button @click="statusHistory[index].open = false" class="absolute right-3 top-3">
              <span role="img" aria-label="close" class="anticon anticon-close">
                <svg focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" fill-rule="evenodd" viewBox="64 64 896 896"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>
              </span>
            </button>
            <Signature v-if="currentStep.attrs.subject.is_signature_needed && empSignature === null"
                       class="mb-2"
                       ref="DigitalSignature"
                       :action="nextStep.step_data.sourcePortLabel"
                       @signed="Signed"
                       @settingsOpened="()=>settingsOpened(index)"
            />
            <div v-if="!currentStep.attrs.subject.is_signature_needed || (currentStep.attrs.subject.is_signature_needed && empSignature)">

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
                    <div v-if="nextStep.subject_type === 'TO_ROLE'">
                      <RoleUserSelector :disabled="!nextStep.is_subject_changeable" v-model:role_id="nextStep.role_id" v-model:user_id="nextStep.user_id" @change="(d)=>changeEmp(nextStep.status_id, d)" :hide-user-select="true" />
                    </div>
                    <div v-if="nextStep.subject_type === 'DIRECT'">
                      <RoleUserSelector :disabled="!nextStep.is_subject_changeable" v-model:role_id="nextStep.role_id" v-model:user_id="nextStep.user_id" @change="(d)=>changeEmp(nextStep.status_id, d)" />
                    </div>
                  </div>
                </div>
                <a-textarea v-model:value="description" :placeholder="$t('process.description')" allow-clear class="mb-1 mt-1"/>
              </div>
              <div class="flex justify-end">
              <span
                v-if="currentStep.attrs.subject.object_type !== 'VOTE'"
                @click="saveAndGoToNext(nextStep, nextStep.step_data.sourcePortLabel)"
                :class="`px-3 py-2  rounded-xl cursor-pointer ${getStatusBgColor(nextStep.status_type)}`">
                <span>
                  {{ getStatusLabel(nextStep.status) }}
                  <span v-if="nextStep.step_data.attrs.subject.object_type !== 'END' && nextStep.step_data.attrs.subject.object_type !== 'CANCEL'"> шат руу илгээх</span>
                </span>
              </span>
                <span
                  v-else
                  @click="saveAndGoToNext(nextStep, nextStep.step_data.sourcePortLabel)"
                  :class="`fff px-3 py-2  rounded-xl cursor-pointer ${getStatusBgColor(nextStep.status_type)}`">{{
                    nextStep.step_data.sourcePortLabel
                  }} {{ $t('process.vote') }}</span>
              </div>
            </div>
          </div>
        </template>
        <span
          @click="statusHistory[index].open = true"
          :class="`px-3 py-2  rounded-xl cursor-pointer ${getStatusBgColor(nextStep.step_data.attrs.subject.object_type)}`">
          <span>
              {{
              nextStep.step_data.sourcePortLabel ? getStatusLabel(nextStep.step_data.sourcePortLabel) : getStatusLabel(nextStep.status) + ' шат руу илгээх'
            }}
          </span>
        </span>
      </a-popover>
      <div>
      </div>
    </div>
    <div>
      <span :class="`px-3 py-2  rounded-xl cursor-pointer ${getStatusBgColor(currentStep.attrs.subject.object_type)}`"
            @click="save" v-if="currentStep.attrs.subject.object_type !== 'END' && !isVote">
        {{ $t('process.save') }}
      </span>
      <span :class="`px-3 py-2  rounded-xl cursor-pointer ${getStatusBgColor(currentStep.attrs.subject.object_type)}`"
            @click="close" v-if="currentStep.attrs.subject.object_type === 'END' || isVote">
        {{ $t('process.close') }}
      </span>
    </div>
  </div>
</template>

<script setup>
import {defineEmits, defineProps, ref, getCurrentInstance} from "vue";
import {useI18n} from 'vue-i18n';
import { EventBus } from '~/modules/process/subjectEvent';
import Signature from "~/modules/signature/Signature.vue";
import {getStatusBgColor} from "~/modules/workflow/flow/status";
import RoleUserSelector from "~/modules/common/RoleUserSelector.vue"
import "~/modules/workflow/styles/status.scss";

const {te, t} = useI18n();
const DigitalSignature = ref();
const {proxy} = getCurrentInstance();

const empSignature = ref(null)
const description = ref(null)

const emit = defineEmits(['saveAndGoToNext', 'save', 'changeEmp', 'close']);
const props = defineProps({
  statusHistory: Array,
  currentStep: Object,
  isVote: Boolean
});

function getStatusLabel(key) {
  if (te("process." + key)) {
    return t("process." + key)
  } else {
    return key
  }
}

function saveAndGoToNext(step, sourcePortLabel) {
  emit('saveAndGoToNext', {
    ...step,
    signature: empSignature.value,
    currentDescription: description.value,
    sourcePortLabel: sourcePortLabel
  });
}

function save(step) {
  emit('save', step);
}

function close() {
  emit('close');
}

function getSignTypeLabel() {
  const selectedOption = signTypes.value.find(option => option.value === Signature.value.type);
  return selectedOption ? selectedOption.label : null;
}

function isSubjectSelected(step) {
  if (step.status_type === "VOTE") {
    return true
  } else {
    if (step.role_id === null && step.user_id === null) {
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

function Signed(SignatureData) {
  empSignature.value = SignatureData;
}

const globalSubjectHandler = (payload) => {
  props.statusHistory.forEach(h=>{
    if(h.is_done === 0 && h.status_id !== props.currentStep.id && h.step_data){
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
});

onUnmounted(() => {
  EventBus.off('globalSubject', globalSubjectHandler);

});
</script>
