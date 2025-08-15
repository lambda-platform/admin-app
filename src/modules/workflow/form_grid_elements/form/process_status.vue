<template>
  <div>
    <Loading v-if="loading" />
    <div
      v-if="!loading && computedStatusHistory && computedStatusHistory.length && currentStep"
    >
      <div class="p-2 w-full mb-2" v-if="workflows.length">
        <div>Ажлын урсгал</div>
        <a-select
          v-model:value="props.model.form['workflow_id']"
          show-search
          style="width: 100%"
          placeholder="Ажлын урсгал"
          optionFilterProp="label"
          :options="workflows"
          :show-search="true"
          @change="()=>initStatus(true)"
        >
        </a-select>
      </div>
      <Status
        v-if="!loading"
        :statusHistory="computedStatusHistory"
        @transfer="saveAndGoToNext"
        @save-and-go-to-next="saveAndGoToNext"
        @save="handleSubmit"
        @changeEmp="changeEmp"
        @close="close"
        :emp_id="creatorEmpID"
        :user_id="creatorUserID"
        :isVote="currentStep.data.subject.object_type === 'VOTE'"
      />

    </div>
    <div v-else-if="!loading && !currentStep" class="p-2 w-full mb-2">
      <a-alert message="Ажлын урсгал олдсонгүй" type="warning" show-icon />
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { defineProps, ref, computed, onMounted, watch, toRaw } from 'vue';
import Status from '~/modules/process/Status.vue';
import { Flow } from '~/modules/workflow/flow/flow';
import { createStatusHistory } from '~/modules/workflow/flow/status';
import Loading from '~/modules/common/Loading.vue';
import { userInfo, organization, currentStep } from '~/store/useSiteSettings';
import { WorkFlowByCategory, WorkFlowByID, getWorkflowsByCategory } from '~/modules/workflow/graphql/fetch';
import { IS_CAN_EDIT, IS_READ_ONLY, CURRENT_STEP } from '~/modules/process/store/mutation-types';

import { message } from 'ant-design-vue';

const { commit } = useStore();
const router = useRouter();
const route = useRoute();

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
  validateWithSubForm: Function,
  validateDataForm: Function,
  subFormFillData: Function,
  isBuilder: Boolean,
});

const creatorEmpID = computed(() => props.model.form['emp_id']);
const orgID = computed(() => props.model.form['org_id']);
const creatorUserID = computed(() => props.model.form['user_id']);
const votingPeople = computed(() => props.model.form['process_voting_people']);
const schemaID = computed(() => parseInt(props.meta.schemaID));
const workflowCategoryID = computed(() => props.model.form['workflow_category_id']);
const workflowID = computed(() => props.model.form['workflow_id']);
const statusType = computed(() => props.model.form['status_type']);
const ID = computed(() => props.model.form['id']);

const flowData = ref({});
const workflow = ref(null);
const workflows = ref([]);
const currentSteps = ref([]);
const loading = ref(true);
const withEndVote = ref(false);



function handleSubmit(step) {
  props.validateWithSubForm(undefined, undefined, ()=>{step.loadingCallback(false)});
  if (step) {
    // axios.post('/process/notification', {
    //   ...step,
    //   creator_id: creatorEmpID.value,
    //   form_id: ID.value,
    //   votingPeople: votingPeople.value,
    //   notify: true
    // }).catch(error => {
    //   console.error("API call failed: ", error);
    // });
  }
}

async function saveAndGoToNext(step, transferEmployees, endVote) {
  let actionNum = step.action_num ? step.action_num + 1 : 0;
  let transferHistories = [];

  if (transferEmployees) {
    transferHistories = toRaw(
      transferEmployees.map((e) => ({
        ...step,
        ID: undefined,
        CREATED_AT: undefined,
        emp_id: e.emp_id,
        struct_id: e.struct_id,
        subject_type: 'DIRECT',
        action_num: actionNum,
      }))
    );
  }

  try {
    const formValid = await props.validateDataForm();

    if (formValid) {
      if (currentStep.value.data.subject.object_type === 'PREPARE_VOTE') {
        if (votingPeople.value.length <= 0) {
          loading.value = true;
          setTimeout(() => (loading.value = false), 500);
          message.warn('Санал өгөх албан тушаалтан сонгоно уу !!!');
          return null;
        }
      }

      if (currentStep.value.data.subject.object_type === 'VOTE') {
        const { emp_id } = userInfo.value;
        const index = props.model.form['process_voting_people'].findIndex(
          (voter) => Number(voter.emp_id) === Number(emp_id)
        );

        if (index >= 0 && !endVote) {
          if (step.sourcePortLabel === 'Зөвшөөрнө') {
            props.model.form['process_voting_people'][index]['APPROVE'] = 1;
            props.model.form['process_voting_people'][index]['RECREATE'] = 0;
          } else if (step.sourcePortLabel === 'Зөвшөөрөхгүй') {
            props.model.form['process_voting_people'][index]['APPROVE'] = 0;
            props.model.form['process_voting_people'][index]['RECREATE'] = 0;
          }
          props.model.form['process_voting_people'][index]['VOTED'] = 1;
          props.model.form['process_voting_people'][index]['signature_IMAGE'] = step.signature
            ? JSON.stringify(step.signature)
            : null;
          props.model.form['process_voting_people'][index]['signature_DATE'] = new Date();
          props.model.form['process_voting_people'][index]['description'] = step.currentdescription;

          let votedCount = 0;
          let approveCount = 0;
          let notApproveCount = 0;
          let votersCount = props.model.form['process_voting_people'].length;

          props.model.form['process_voting_people'].forEach((vote) => {
            if (vote.VOTED === 1) votedCount++;
            if (vote.APPROVE === 1) approveCount++;
            else notApproveCount++;
          });

          if (votedCount >= votersCount) {
            if (approveCount >= notApproveCount) {
              const approveIndex = currentSteps.value.findIndex(
                (c) => c.sourcePortLabel === 'Зөвшөөрнө'
              );
              if (approveIndex >= 0) {
                const stepStatus = await createStatusHistory(
                  currentSteps.value[approveIndex],
                  undefined,
                  [],
                  route
                );
                setStatus(stepStatus);
                if (stepStatus.status_type === 'CANCEL' || stepStatus.status_type === 'END') {
                  const endIndex = props.model.form['process_status_history'].findIndex(
                    (h) => h.status_id === stepStatus.status_id
                  );
                  if (endIndex >= 0) {
                    props.model.form['process_status_history'][endIndex].is_done = 1;
                    props.model.form['process_status_history'][endIndex].struct_id =
                      userInfo.value.struct_id * 1;
                    props.model.form['process_status_history'][endIndex].emp_id =
                      userInfo.value.emp_id;
                    const max_action_num = Math.max(
                      ...props.model.form['process_status_history'].map((item) => item['action_num'])
                    );
                    props.model.form['process_status_history'][endIndex].action_num =
                      max_action_num + 1;
                  }
                }
                const statusIndex = props.model.form['process_status_history'].findIndex(
                  (h) => h.status_id === currentStep.value.id
                );
                if (statusIndex >= 0) {
                  props.model.form['process_status_history'][statusIndex].is_done = 1;
                }
              }
            } else {
              const approveIndex = currentSteps.value.findIndex(
                (c) => c.sourcePortLabel === 'Зөвшөөрөхгүй'
              );
              if (approveIndex >= 0) {
                const stepStatus = await createStatusHistory(
                  currentSteps.value[approveIndex],
                  undefined,
                  [],
                  route
                );
                setStatus(stepStatus);
                if (stepStatus.status_type === 'CANCEL' || stepStatus.status_type === 'END') {
                  const endIndex = props.model.form['process_status_history'].findIndex(
                    (h) => h.status_id === stepStatus.status_id
                  );
                  if (endIndex >= 0) {
                    props.model.form['process_status_history'][endIndex].is_done = 1;
                    props.model.form['process_status_history'][endIndex].struct_id =
                      userInfo.value.struct_id * 1;
                    props.model.form['process_status_history'][endIndex].emp_id =
                      userInfo.value.emp_id;
                  }
                }
                const statusIndex = props.model.form['process_status_history'].findIndex(
                  (h) => h.status_id === currentStep.value.id
                );
                if (statusIndex >= 0) {
                  props.model.form['process_status_history'][statusIndex].is_done = 1;
                }
              }
            }
          }
        } else if (endVote) {
          const endVoteIndex = props.model.form['process_status_history'].findIndex(
            (h) => h.status_type === 'END_VOTE'
          );
          if (endVoteIndex >= 0) {
            props.model.form['process_status_history'][endVoteIndex].is_done = 1;
            props.model.form['process_status_history'][endVoteIndex].struct_id =
              userInfo.value.struct_id * 1;
            props.model.form['process_status_history'][endVoteIndex].emp_id = userInfo.value.emp_id;

            let nextStepsOfEndVote = workflow.value.getNextSteps({
              id: props.model.form['process_status_history'][endVoteIndex]['status_id'],
            });

            if (nextStepsOfEndVote.length > 0) {
              const stepStatus = await createStatusHistory(
                nextStepsOfEndVote[0],
                undefined,
                [],
                route
              );
              for (const nextStepOfEndVote of nextStepsOfEndVote) {
                const nextStepOfEndVoteHistory = await createStatusHistory(
                  nextStepOfEndVote,
                  undefined,
                  props.model.form['process_status_history'],
                  route
                );
                transferHistories.push({
                  workflow_category_id: workflowCategoryID.value,
                  ...nextStepOfEndVoteHistory,
                  action_num:
                    props.model.form['process_status_history'][endVoteIndex]['action_num'] + 1,
                  signature: null,
                  open: false,
                });
              }
              setStatus(stepStatus);
            }

            const statusIndex = props.model.form['process_status_history'].findIndex(
              (h) => h.status_id === currentStep.value.id
            );
            if (statusIndex >= 0) {
              props.model.form['process_status_history'][statusIndex].is_done = 1;
            }
          }
        }
      } else {
        setStatus(step);
        if (step.status_type === 'CANCEL' || step.status_type === 'END') {
          const endIndex = props.model.form['process_status_history'].findIndex(
            (h) => h.status_id === step.status_id
          );
          if (endIndex >= 0) {
            props.model.form['process_status_history'][endIndex].is_done = 1;
            props.model.form['process_status_history'][endIndex].struct_id =
              userInfo.value.struct_id * 1;
            props.model.form['process_status_history'][endIndex].emp_id = userInfo.value.emp_id;
          }
        }

        const index = props.model.form['process_status_history'].findIndex(
          (h) => h.status_id === currentStep.value.id
        );
        if (index >= 0) {
          if (props.model.form['process_status_history'][index].status_type === 'START') {
            props.model.form['process_status_history'][index].status_action = 'Боловсруулсан';
          } else {
            props.model.form['process_status_history'][index].status_action = step.sourcePortLabel;
          }
          props.model.form['process_status_history'][index].is_done = 1;
          props.model.form['process_status_history'][index].signature = step.signature
            ? JSON.stringify(step.signature)
            : null;
          props.model.form['process_status_history'][index].description = step.currentdescription;
          props.model.form['process_status_history'][index].role_id = userInfo.value.role_id * 1;
          props.model.form['process_status_history'][index].user_id = userInfo.value.id;

          if (
            organization.value.org_id !== null &&
            organization.value.org_id !== 0 &&
            organization.value.org_id !== undefined
          ) {
            props.model.form['process_status_history'][index].org_role_id = organization.value.role_id;
            props.model.form['process_status_history'][index].org_id = organization.value.org_id;
            props.model.form['process_status_history'][index].struct_id = userInfo.value.struct_id;
            props.model.form['process_status_history'][index].job_id = userInfo.value.job_id;
            props.model.form['process_status_history'][index].emp_id = userInfo.value.emp_id;
          }
        }
      }

      if (transferHistories.length >= 1) {
        props.model.form['process_status_history'] = [
          ...props.model.form['process_status_history'].filter((s) => {
            if (s.status_type === 'TRANSFER') {
              return s.subject_type !== 'ANY_EMP';
            } else {
              return s.status_type !== 'RECEIVE';
            }
          }),
          ...transferHistories,
        ];
      } else {
        props.model.form['process_status_history'] = [
          ...props.model.form['process_status_history'].filter((s) => {
            if (s.status_type === 'TRANSFER') {
              return s.subject_type !== 'ANY_EMP';
            } else {
              return true;
            }
          }),
          ...transferHistories,
        ];
        if (endVote) {
          props.model.form['process_status_history'] = [
            ...props.model.form['process_status_history'].filter((s) => {
              if (s.status_type === 'END_VOTE') {
                return s.is_done === 1;
              } else {
                return true;
              }
            }),
            ...transferHistories,
          ];
        }
      }

      // console.log(toRaw(props.model.form['process_status_history'].map((h) => toRaw(h))));
      handleSubmit(step);
    } else {
      step.loadingCallback(false);
    }
  } catch (error) {
    step.loadingCallback(false);
    console.error(error);
  }
}

function setStatus(step) {
  props.model.form['status'] = step.step_data.data.label;
  props.model.form['status_type'] = step.step_data.data.subject.object_type;
  props.model.form['status_id'] = step.step_data.id;
}

function changeEmp(payload) {
  const index = props.model.form['process_status_history'].findIndex(
    (h) => h.status_id === payload.status_id
  );
  if (index >= 0) {
    if (payload.emp_id || payload.emp_id === null)
      props.model.form['process_status_history'][index].emp_id = payload.emp_id;
    if (payload.struct_id || payload.struct_id === null)
      props.model.form['process_status_history'][index].struct_id = payload.struct_id;
    if (payload.org_id || payload.org_id === null)
      props.model.form['process_status_history'][index].org_id = payload.org_id;
    if (payload.org_role_id || payload.org_role_id === null)
      props.model.form['process_status_history'][index].org_role_id = payload.org_role_id;
    if (payload.user_id || payload.user_id === null)
      props.model.form['process_status_history'][index].user_id = payload.user_id;
    if (payload.role_id || payload.role_id === null)
      props.model.form['process_status_history'][index].role_id = payload.role_id;
  }
}

function isArrayEmpty(arr) {
  return Array.isArray(arr) && arr.length === 0;
}

function parseFlowData(view_workflow, index) {
  if (view_workflow && view_workflow.length) {
    props.model.form['workflow_id'] = view_workflow[index].id;
    if (view_workflow[index].workflow_voting_people && view_workflow[index].workflow_voting_people.length) {
      if (
        props.model.form['process_voting_people'] === undefined ||
        props.model.form['process_voting_people'] === null ||
        isArrayEmpty(props.model.form['process_voting_people'])
      ) {
        props.model.form['process_voting_people'] = view_workflow[index].workflow_voting_people.map(
          (votingPeople) => ({
            subject_type: votingPeople.subject_type,
            struct_id: votingPeople.struct_id,
            emp_id: votingPeople.emp_id,
            role_id: votingPeople.role_id,
            user_id: votingPeople.user_id,
            workflow_category_id: workflowCategoryID.value,
            org_id: organization.value.org_id,
          })
        );
        props.subFormFillData('process_voting_people');
      }
    }
    return new Flow(JSON.parse(view_workflow[index].flow_data));
  } else {
    return null;
  }
}

async function getWorkFlowData() {
  if (
    workflowCategoryID.value !== null &&
    workflowCategoryID.value !== '' &&
    workflowCategoryID.value !== undefined
  ) {
    if (
      workflowID.value !== null &&
      workflowID.value !== '' &&
      workflowID.value !== undefined
    ) {
      try {

        if(workflows.value.length === 0) {
          const { view_workflow } = await WorkFlowByID(workflowID.value);
          return parseFlowData(view_workflow, 0);
        } else {
          const index = workflows.value.findIndex((v) =>v.id === workflowID.value);

          if (index >= 0) {
            return parseFlowData(workflows.value, index);
          }
        }
      } catch (error) {
        return null;
      }
    } else {
      try {
        if (orgID.value !== null){
          const preWorkflows = await getWorkflowsByCategory(workflowCategoryID.value);

          if (userInfo.value.org_id === 'ca11f367-b3af-4df2-8910-2f796f324a62' && workflowCategoryID.value === '78658fc2-e1a0-4b22-adf2-e1a81fe68f37') {
            const specialId = 'da32a538-dcc2-418d-88c1-52776f108aed';
            const isSpecialJob = userInfo.value.job_id === '528e9d21-911c-4f69-8470-bf65e5455b27';
            workflows.value = preWorkflows.filter(v => isSpecialJob ? v.id === specialId : v.id !== specialId);
          } else {
            workflows.value = preWorkflows;
          }

          if (workflows.value.length){
            return parseFlowData(workflows.value, 0);
          }

        } else {
          const { view_workflow } = await WorkFlowByCategory(workflowCategoryID.value);
          return parseFlowData(view_workflow, 0);
        }

      } catch (error) {
        return null;
      }
    }
  } else {
    return null;
  }
}

async function initStatus(initAgain) {
  console.log('init status');
  loading.value = true;
  const flow = await getWorkFlowData();

  let currentStepPre = null;
  let actionNum = 0;

  if (flow !== null && flow !== undefined) {
    workflow.value = flow;
    withEndVote.value = flow.withEndVote;
    let preHistories = [];

    if (
      !props.editMode ||
      props.model.form['status_id'] === null ||
      props.model.form['status_id'] === undefined || initAgain
    ) {
      if (flow.starts.length >= 1) {

        const steps = flow.getNextSteps(flow.starts[0]);
        currentSteps.value = steps;
        const startStep = flow.starts[0];
        const startStatusHistory = await createStatusHistory(
          startStep,
          userInfo.value,
          preHistories,
          route
        );

        setStatus(startStatusHistory);
        preHistories.push({
          workflow_category_id: workflowCategoryID.value,
          ...startStatusHistory,
          action_num: actionNum,
        });

        if (steps && steps.length >= 1) {
          for (const step of steps) {
            actionNum = actionNum + 1;
            const stepStatusHistory = await createStatusHistory(step, undefined, preHistories, route);
            preHistories.push({
              workflow_category_id: workflowCategoryID.value,
              ...stepStatusHistory,
              action_num: actionNum,
              signature: null,
              open: false,
            });
          }
          currentStepPre = startStep;
        }
      }
    } else {
      preHistories = toRaw(props.model.form['process_status_history']);
      if (preHistories.length >= 1) {
        actionNum = preHistories[preHistories.length - 1].action_num + 1;
      }

      currentStepPre = flow.getNodeById(props.model.form['status_id']);
      if (currentStepPre) {
        const steps = flow.getNextSteps(currentStepPre);
        currentSteps.value = steps;

        if (steps && steps.length >= 1) {
          for (const step of steps) {
            let index = preHistories.findIndex((h) => h.status_id === step.id);
            const stepStatusHistory = await createStatusHistory(step, undefined, preHistories, route);

            if (index >= 0) {
              if (preHistories[index].step_data) {
                if (preHistories[index].step_data.sourcePortLabel !== step.sourcePortLabel) {
                  index = -1;
                }
              }
            }

            if (index >= 0) {
              if (preHistories[index].status_type === 'TRANSFER') {
                if (preHistories[index].is_done === 1) {
                  let currentStepStatusHistory = await createStatusHistory(
                    currentStepPre,
                    undefined,
                    preHistories,
                    route
                  );
                  currentStepStatusHistory.step_data.sourcePortLabel = 'Холбогдох хүмүүст цохсон';
                  preHistories.push({
                    workflow_category_id: workflowCategoryID.value,
                    ...currentStepStatusHistory,
                    action_num: actionNum,
                    subject_type: 'ANY_EMP',
                    signature: null,
                    open: false,
                  });
                } else {
                  preHistories[index].step_data = stepStatusHistory.step_data;
                  preHistories[index].is_read_only = stepStatusHistory.is_read_only;
                  preHistories[index].is_signature_needed = stepStatusHistory.is_signature_needed;
                  preHistories[index].is_subject_changeable = stepStatusHistory.is_subject_changeable;
                  preHistories[index].description = stepStatusHistory.description;
                  preHistories[index].is_done = 0;
                }
              } else {
                preHistories[index].step_data = stepStatusHistory.step_data;
                preHistories[index].is_read_only = stepStatusHistory.is_read_only;
                preHistories[index].is_signature_needed = stepStatusHistory.is_signature_needed;
                preHistories[index].is_subject_changeable = stepStatusHistory.is_subject_changeable;
                preHistories[index].description = stepStatusHistory.description;
                preHistories[index].is_done = 0;
              }
            } else {
              preHistories.push({
                workflow_category_id: workflowCategoryID.value,
                ...stepStatusHistory,
                action_num: actionNum,
                signature: null,
                open: false,
              });
            }
          }
        }
      }
    }
    props.model.form['process_status_history'] = preHistories;
    commit(IS_CAN_EDIT, setPermission(currentStepPre, preHistories));
    commit(IS_READ_ONLY, iReadOnly(currentStepPre, preHistories));
    commit(CURRENT_STEP, currentStepPre);
    prepareForm(currentStepPre);
    loading.value = false;
  } else {
    loading.value = false;
  }
  console.log('init done');
}

function prepareForm(currentStepPre) {
  if (currentStepPre.data.subject.object_type === 'PREPARE_VOTE') {
    props.setSchemaByModel('process_voting_people', 'hidden', false);
  } else if (currentStepPre.data.subject.object_type === 'VOTE') {
    // Handle VOTE-specific form settings
  } else {
    props.setSchemaByModel('process_voting_people', 'hidden', true);
  }

  if (
    currentStepPre.data.subject.object_type === 'RECEIVE' ||
    currentStepPre.data.subject.object_type === 'PRE_END' ||
    currentStepPre.data.subject.object_type === 'END'
  ) {
    props.setSchemaByModel('DOC_DATE', 'disabled', true);
    props.setSchemaByModel('description', 'disabled', true);
    props.setSchemaByModel('DOC_NUMBER', 'disabled', true);
    props.setSchemaByModel('DOC_NAME', 'disabled', true);
    props.setSchemaByModel('ATTACHMENTS', 'disabled', true);
  }
}

function isActionSubject(statusHistories, current) {
  let cindex = statusHistories.findIndex(
    (h) => h.status_id === current.id && h.emp_id === userInfo.value.emp_id
  );
  if (cindex >= 0) {
    return statusHistories[cindex].is_done === 0;
  } else {
    return false;
  }
}

// const setPermission = (current, statusHistories) => {
//   if (!current) return false;
//
//   const subject = current.data.subject;
//   const form = props.model.form;
//   const user = userInfo.value;
//
//   const isSelf =
//     (form['emp_id'] && form['emp_id'] === user.emp_id) ||
//     (form['user_id'] && form['user_id'] === user.id);
//
//   const cindex = statusHistories.findIndex((h) => h.status_id === current.id);
//   const currentHistory = cindex >= 0 ? statusHistories[cindex] : null;
//
//   const checkSubjectMatch = () => {
//     if (!currentHistory) return false;
//
//     if (subject.subject_type === 'TO_ROLE') {
//       return currentHistory.role_id === user.role;
//     }
//
//     if (subject.subject_type === 'DIRECT') {
//       return (
//         (currentHistory.emp_id && currentHistory.emp_id === user.emp_id) ||
//         (currentHistory.user_id && currentHistory.user_id === user.id)
//       );
//     }
//
//     if (subject.subject_type === 'ANY_EMP') return true;
//
//     // Deep structure match
//     if (currentHistory.emp_id) return currentHistory.emp_id === user.emp_id;
//     if (currentHistory.job_id) return currentHistory.job_id === user.job_id;
//     if (currentHistory.struct_id) return currentHistory.struct_id === user.struct_id;
//     if (currentHistory.org_id) return currentHistory.org_id === user.org_id;
//     if (currentHistory.org_role_id) return currentHistory.org_role_id === user.org_role_id;
//
//     return false;
//   };
//
//   if (subject.object_type === 'END' || subject.object_type === 'VOTE') {
//     if (subject.object_type === 'VOTE') {
//       if (withEndVote.value && isSelf) return true;
//
//       const personIndex = form['process_voting_people'].findIndex(
//         (p) => p.emp_id === user.emp_id || p.user_id === user.id
//       );
//       return personIndex >= 0 && form['process_voting_people'][personIndex]['VOTED'] === 0;
//     }
//
//     if (subject.subject_type === 'CREATOR') {
//       if (isSelf) return true;
//
//       if (subject.object_type === 'TRANSFER' || subject.object_type === 'RECEIVE') {
//         return isActionSubject(statusHistories, current);
//       }
//
//       return false;
//     }
//
//     if (subject.object_type === 'TRANSFER' || subject.object_type === 'RECEIVE') {
//       return isActionSubject(statusHistories, current);
//     }
//
//     return (
//       (subject.emp_id && subject.emp_id === user.emp_id) ||
//       (subject.user_id && subject.user_id === user.id)
//     );
//   }
//
//   // Not END/VOTE
//   if (!subject.is_read_only) {
//     if (isSelf || checkSubjectMatch()) {
//       if (['START', 'RE_CREATE'].includes(subject.object_type)) {
//         return true;
//       } else {
//         return checkSubjectMatch();
//       }
//     }
//   }
//
//   return false;
// };

const setPermission = (current, statusHistories) => {

  if (current) {
    if (
      current.data.subject.object_type !== 'END' &&
      current.data.subject.object_type !== 'VOTE' &&
      !current.data.subject.is_read_only
    ) {
      if (
        (props.model.form['emp_id'] && props.model.form['emp_id'] === userInfo.value.emp_id) ||
        (props.model.form['user_id'] && props.model.form['user_id'] === userInfo.value.id)
      ) {
        if (
          current.data.subject.object_type === 'START' ||
          current.data.subject.object_type === 'RE_CREATE'
        ) {
          return true;
        } else {
          let cindex = statusHistories.findIndex((h) => h.status_id === current.id);

          if (cindex >= 0) {
            if (statusHistories[cindex].emp_id) {
              return statusHistories[cindex].emp_id === userInfo.value.emp_id;
            } else if (statusHistories[cindex].job_id) {
              return statusHistories[cindex].job_id === userInfo.value.job_id;
            } else if (statusHistories[cindex].struct_id) {
              return statusHistories[cindex].struct_id === userInfo.value.struct_id;
            } else if (statusHistories[cindex].org_id) {
              return statusHistories[cindex].org_id === userInfo.value.org_id;
            } else if (statusHistories[cindex].org_role_id) {
              return statusHistories[cindex].org_role_id === userInfo.value.org_role_id;
            } else {
              return false;
            }
          }
          return false;
        }
      } else {
        let cindex = statusHistories.findIndex((h) => h.status_id === current.id);
        if (cindex >= 0) {
          if (current.data.subject.subject_type === 'TO_ROLE') {
            if (statusHistories[cindex].role_id === userInfo.value.role) {
              return true;
            }
          } else if (current.data.subject.subject_type === 'DIRECT') {
            if (
              (statusHistories[cindex].emp_id &&
                statusHistories[cindex].emp_id === userInfo.value.emp_id) ||
              (statusHistories[cindex].user_id &&
                statusHistories[cindex].user_id === userInfo.value.id)
            ) {
              return true;
            }
          } else if (current.data.subject.subject_type === 'ANY_EMP') {
            return true;
          } else {
            if (statusHistories[cindex].emp_id) {
              return statusHistories[cindex].emp_id === userInfo.value.emp_id;
            } else if (statusHistories[cindex].job_id) {
              return statusHistories[cindex].job_id === userInfo.value.job_id;
            } else if (statusHistories[cindex].struct_id) {
              return statusHistories[cindex].struct_id === userInfo.value.struct_id;
            } else if (statusHistories[cindex].org_id) {
              return statusHistories[cindex].org_id === userInfo.value.org_id;
            } else if (statusHistories[cindex].org_role_id) {
              return statusHistories[cindex].org_role_id === userInfo.value.org_role_id;
            } else {
              return false;
            }
          }
        }
        return false;
      }
    } else {
      if (current.data.subject.object_type === 'VOTE') {
        if (withEndVote.value) {
          if (
            props.model.form['emp_id'] === userInfo.value.emp_id ||
            props.model.form['user_id'] === userInfo.value.id
          ) {
            return true;
          }
        }
        const index = props.model.form['process_voting_people'].findIndex(
          (p) => p.emp_id === userInfo.value.emp_id || p.user_id === userInfo.value.id
        );
        if (index >= 0) {
          return props.model.form['process_voting_people'][index]['VOTED'] === 0;
        } else {
          return false;
        }
      } else {
        if (current.data.subject.subject_type === 'CREATOR') {
          if (
            (props.model.form['emp_id'] && props.model.form['emp_id'] === userInfo.value.emp_id) ||
            (props.model.form['user_id'] && userInfo.value.id === userInfo.value.id)
          ) {
            return true;
          } else {
            if (
              current.data.subject.object_type === 'TRANSFER' ||
              current.data.subject.object_type === 'RECEIVE'
            ) {
              return isActionSubject(statusHistories, current);
            }
            return false;
          }
        } else {
          if (
            current.data.subject.object_type === 'TRANSFER' ||
            current.data.subject.object_type === 'RECEIVE'
          ) {
            return isActionSubject(statusHistories, current);
          } else {
            return (
              (current.data.subject.emp_id &&
                current.data.subject.emp_id === userInfo.value.emp_id) ||
              (current.data.subject.user_id && current.data.subject.user_id === userInfo.value.id)
            );
          }
        }
      }
    }
  } else {
    return false;
  }
};

const iReadOnly = (current, statusHistories) => {
  if (current) {
    if (
      (current.data.subject.object_type !== 'END' && current.data.subject.is_read_only) ||
      current.data.subject.object_type === 'VOTE'
    ) {
      return true;
    } else {
      if (
        props.model.form['emp_id'] === userInfo.value.emp_id &&
        current.data.subject.object_type !== 'END'
      ) {
        if (
          current.data.subject.object_type !== 'START' &&
          current.data.subject.object_type !== 'RE_CREATE'
        ) {
          if (
            current.data.subject.emp_id &&
            current.data.subject.emp_id === userInfo.value.emp_id
          ) {
            return false;
          }
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
};

onMounted(() => {
  if (props.do_render){
    initStatus();
  }

});
watch(() => props.do_render, () => {
  if (props.do_render) {
    if (!props.editMode) {
      initStatus();
    }
  }
});

watch(ID, () => {
  if (props.editMode && ID.value !== null) {
    initStatus();
  }
});


function close() {}

const computedStatusHistory = computed(() => props.model.form['process_status_history']);
watch(() => props.model.form['process_status_history'], { deep: true });
</script>

<style scoped></style>
