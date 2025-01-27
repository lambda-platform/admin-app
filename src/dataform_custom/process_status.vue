<template>
  <div>
    <Loading v-if="loading"/>
    <div v-if="model.form['process_status_history'] && model.form['process_status_history'].length && currentStep">
      <Status
        v-if="iCanEdit && !loading"
        :current-step="currentStep"
        :statusHistory="model.form['process_status_history']"
        @save-and-go-to-next="saveAndGoToNext"
        @save="handleSubmit"
        @close="close"
        :isVote="currentStep.attrs.subject.object_type === 'VOTE'"
      />
    </div>
  </div>
</template>

<script setup>
import {defineProps, ref, computed, onMounted, watch} from "vue";
import Status from "~/modules/process/Status.vue";
import {Flow} from "~/modules/workflow/flow/flow";
import {createStatusHistory} from "~/modules/workflow/flow/status";
import Loading from "~/modules/common/Loading.vue";
import {userInfo} from "~/store/useSiteSettings";
import {WorkFlowByCategory, WorkFlowByID} from "~/modules/workflow/graphql/fetch";

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
  validateWithSubForm: Function,
  validateDataForm: Function,
  isBuilder: Boolean
});

const currentSteps = ref([]);
const currentStep = ref(null);
const loading = ref(true);

function handleSubmit() {
  props.validateWithSubForm();
}

async function saveAndGoToNext(step) {

  try {
    const formValid = await props.validateDataForm();
    if (formValid) {
      /*
      *
      * NEED IMPROVE !!!!
      * */
      // loading.value = true;
      if (currentStep.value.attrs.subject.object_type === 'VOTE') {
        const index = props.model.form['process_voting_people'].findIndex(p =>
          p.user_id === userInfo.value.id && p.role_id === userInfo.value.role
        );

        if (index >= 0) {
          if (step.sourcePortLabel === "Дэмжсэн" || step.sourcePortLabel === "Зөвшөөрсөн") {
            props.model.form['process_voting_people'][index]["approve"] = 1;
            props.model.form['process_voting_people'][index]["recreate"] = 0;
          } else if (step.sourcePortLabel === "Нэмэлт материал шаардлагатай") {
            props.model.form['process_voting_people'][index]["approve"] = 0;
            props.model.form['process_voting_people'][index]["recreate"] = 1;
          } else {
            props.model.form['process_voting_people'][index]["approve"] = 0;
            props.model.form['process_voting_people'][index]["recreate"] = 0;
          }
          props.model.form['process_voting_people'][index]["voted"] = 1;
          props.model.form['process_voting_people'][index]["signature_image"] = step.signature ? JSON.stringify(step.signature) : null;
          props.model.form['process_voting_people'][index]["signature_date"] = new Date();
          props.model.form['process_voting_people'][index]["description"] = step.currentDescription;

          let allVoted = true;
          let approveCount = 0;
          let recreateCount = 0;
          let notApproveCount = 0;

          props.model.form['process_voting_people'].forEach(vote => {
            if (vote.voted === 0) {
              allVoted = false;
            }
            if (vote.approve === 0 && vote.recreate === 0) {
              allApproved = false;
              allRecreate = false;
              notApproveCount++;
            }
            if (vote.approve === 1 && vote.recreate === 0) {
              allNotApproved = false;
              allRecreate = false;
              approveCount++;
            }
            if (vote.approve === 0 && vote.recreate === 1) {
              allApproved = false;
              allNotApproved = false;
              recreateCount++;
            }
          });

          if (allVoted) {

            if (approveCount > notApproveCount && approveCount > recreateCount) {
              const approveIndex = currentSteps.value.findIndex(c => c.sourcePortLabel === "Дэмжсэн" || c.sourcePortLabel === "Зөвшөөрсөн")

              if (approveIndex >= 0) {
                const stepStatus = await createStatusHistory(currentSteps.value[approveIndex], undefined, [])

                setStatus(stepStatus);

                if (stepStatus.status_type === "CANCEL" || stepStatus.status_type === "END") {
                  const endIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === stepStatus.status_id);

                  if (endIndex >= 0) {
                    props.model.form['process_status_history'][endIndex].is_done = 1;
                    props.model.form['process_status_history'][endIndex].role_id = userInfo.value.role * 1;
                    props.model.form['process_status_history'][endIndex].user_id = userInfo.value.id;
                  }
                }

                const statusIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === currentStep.value.id);
                if (statusIndex >= 0) {
                  props.model.form['process_status_history'][statusIndex].is_done = 1;
                }
              }
            } else if (notApproveCount > approveCount && notApproveCount > recreateCount) {
              const approveIndex = currentSteps.value.findIndex(c => c.sourcePortLabel === "Дэмжээгүй" || c.sourcePortLabel === "Татгалзсан")

              if (approveIndex >= 0) {
                const stepStatus = await createStatusHistory(currentSteps.value[approveIndex], undefined, [])

                setStatus(stepStatus);

                if (stepStatus.status_type === "CANCEL" || stepStatus.status_type === "END") {
                  const endIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === stepStatus.status_id);

                  if (endIndex >= 0) {
                    props.model.form['process_status_history'][endIndex].is_done = 1;
                    props.model.form['process_status_history'][endIndex].role_id = userInfo.value.role * 1;
                    props.model.form['process_status_history'][endIndex].user_id = userInfo.value.id;
                  }
                }

                const statusIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === currentStep.value.id);
                if (statusIndex >= 0) {
                  props.model.form['process_status_history'][statusIndex].is_done = 1;
                }
              }
            } else {
              const approveIndex = currentSteps.value.findIndex(c => c.sourcePortLabel === "Нэмэлт материал шаардлагатай")

              if (approveIndex >= 0) {
                const stepStatus = await createStatusHistory(currentSteps.value[approveIndex], undefined, [])

                setStatus(stepStatus);

                if (stepStatus.status_type === "CANCEL" || stepStatus.status_type === "END") {
                  const endIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === stepStatus.status_id);

                  if (endIndex >= 0) {
                    props.model.form['process_status_history'][endIndex].is_done = 1;
                    props.model.form['process_status_history'][endIndex].role_id = userInfo.value.role * 1;
                    props.model.form['process_status_history'][endIndex].user_id = userInfo.value.id;
                  }
                }

                const statusIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === currentStep.value.id);
                if (statusIndex >= 0) {
                  props.model.form['process_status_history'][statusIndex].is_done = 1;
                }
              }
            }
          }
        }
      } else {
        setStatus(step);

        if (step.status_type === "CANCEL" || step.status_type === "END") {
          const endIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === step.status_id);

          if (endIndex >= 0) {
            props.model.form['process_status_history'][endIndex].is_done = 1;
            props.model.form['process_status_history'][endIndex].role_id = userInfo.value.role * 1;
            props.model.form['process_status_history'][endIndex].user_id = userInfo.value.id;
          }
        }

        const index = props.model.form['process_status_history'].findIndex(h => h.status_id === currentStep.value.id);

        if (index >= 0) {
          props.model.form['process_status_history'][index].is_done = 1;
          props.model.form['process_status_history'][index].signature = step.signature ? JSON.stringify(step.signature) : null;
          props.model.form['process_status_history'][index].description = step.currentDescription;
          props.model.form['process_status_history'][index].role_id = userInfo.value.role * 1;
          props.model.form['process_status_history'][index].user_id = userInfo.value.id;
        }
      }
      /*
      *
      * NEED IMPROVE !!!!
      * */
      handleSubmit()
    }

  } catch (error) {
  }

}

function setStatus(step) {
  props.model.form['status'] = step.step_data.attrs.label.text
  props.model.form['status_type'] = step.step_data.attrs.subject.object_type
  props.model.form['status_id'] = step.step_data.id
}

const workflowCategoryID = computed(() => {
  return props.model.form["workflow_category_id"]
});

const workflowID = computed(() => {
  return props.model.form["workflow_id"]
});

const statusType = computed(() => {
  return props.model.form["status_type"]
});

const ID = computed(() => {
  return props.model.form["id"]
});

function isArrayEmpty(arr) {
  return Array.isArray(arr) && arr.length === 0;
}

function parseFlowData(view_workflow) {
  if (view_workflow && view_workflow.length) {
    props.model.form["workflow_id"] = view_workflow[0].id;

    if (view_workflow[0].workflow_voting_people && view_workflow[0].workflow_voting_people.length) {
      if (props.model.form['process_voting_people'] === undefined || props.model.form['process_voting_people'] === null || isArrayEmpty(props.model.form['process_voting_people'])) {
        props.model.form['process_voting_people'] = view_workflow[0].workflow_voting_people.map(votingPeople => {

          return {
            subject_type: votingPeople.subject_type,
            user_id: votingPeople.user_id,
            role_id: votingPeople.role_id,
            id: null,
            row_id: null,
            approve: 0,
            recreate: 0,
            voted: 0,
            signature_date: null,
            signature_image: null,
            description: null,
            workflow_category_id: workflowCategoryID.value
          }

        });
      }
    }
    return new Flow(JSON.parse(view_workflow[0].flow_data));
  } else {
    return null
  }
}

watch(() => props.do_render, () => {
  if (props.do_render) {
    if (!props.editMode) {
      initStatus();
    }
  }
});

watch(ID, () => {
  if (props.editMode && ID !== null) {
    initStatus();
  }
});

async function getWorkFlowData() {

  if (workflowCategoryID.value !== null && workflowCategoryID.value !== "" && workflowCategoryID.value !== undefined) {
    if (workflowID.value !== null && workflowID.value !== "" && workflowID.value !== undefined) {
      try {
        const {view_workflow} = await WorkFlowByID(workflowID.value)

        return parseFlowData(view_workflow)

      } catch (error) {
        return null;
      }
    } else {

      try {
        const {view_workflow} = await WorkFlowByCategory(workflowCategoryID.value)

        return parseFlowData(view_workflow)

      } catch (error) {
        return null;
      }
    }

  } else {
    return null;
  }
}

async function initStatus() {
  console.log("init");

  const flow = await getWorkFlowData();

  if (flow !== null) {

    if (flow.withVote) {
      // props.setSchemaByModel('VOTE_ADDITIONAL_COMMENTS', 'hidden', false)
    }

    if (!props.editMode || props.model.form['status_id'] === null || props.model.form['status_id'] === undefined) {

      props.model.form['process_status_history'] = [];
      if (flow.starts.length >= 1) {

        const steps = flow.getNextSteps(flow.starts[0]);
        currentSteps.value = steps
        const startStep = flow.starts[0];
        const startStatusHistory = await createStatusHistory(startStep, userInfo.value, props.model.form['process_status_history'])

        setStatus(startStatusHistory);
        props.model.form['process_status_history'].push(startStatusHistory)

        if (steps && steps.length >= 1) {

          for (const step of steps) {
            const stepStatusHistory = await createStatusHistory(step, undefined, props.model.form['process_status_history'])
            props.model.form['process_status_history'].push({
              ...stepStatusHistory,
              signature: null,
              open: false
            })
          }
          currentStep.value = startStep;
        }
      }
    } else {

      currentStep.value = flow.getCellById(props.model.form['status_id']);

      const currentIndex = flow.getCellIndex(props.model.form['status_id']);

      if (flow.withVote) {
        if (currentIndex < flow.voteIndex) {
          //props.setSchemaByModel('VOTE_ADDITIONAL_COMMENTS', 'hidden', false)
        } else {
          // props.setSchemaByModel('VOTE_ADDITIONAL_COMMENTS', 'hidden', true)
        }
      }

      if (currentStep.value) {
        const steps = flow.getNextSteps(currentStep.value);

        currentSteps.value = steps

        if (steps && steps.length >= 1) {
          for (const step of steps) {
            let index = props.model.form['process_status_history'].findIndex(h => h.status_id === step.id);

            const stepStatusHistory = await createStatusHistory(step, undefined, props.model.form['process_status_history']);

            if (index >= 0) {

              if (props.model.form['process_status_history'][index].step_data) {

                if (props.model.form['process_status_history'][index].step_data.sourcePortLabel !== step.sourcePortLabel) {
                  index = -1
                }

              }
            }

            if (index >= 0) {
              // console.log(stepStatusHistory)
              props.model.form['process_status_history'][index].step_data = stepStatusHistory.step_data;
              props.model.form['process_status_history'][index].is_read_only = stepStatusHistory.is_read_only;
              props.model.form['process_status_history'][index].is_signature_needed = stepStatusHistory.is_signature_needed;
              props.model.form['process_status_history'][index].is_subject_changeable = stepStatusHistory.is_subject_changeable;
              props.model.form['process_status_history'][index].description = stepStatusHistory.description;
              props.model.form['process_status_history'][index].is_done = 0;
            } else {

              props.model.form['process_status_history'].push({
                ...stepStatusHistory,
                signature: null,
                open: false
              })
            }
          }
        }
      }
      // console.log(props.model.form['process_status_history'])
    }
    loading.value = false;
  }
}

onMounted(() => {
  initStatus();
})

function close() {
  console.log("close action!")
}

const computedStep = computed(() => {
  if (props.model.form['process_status_history']) {
    return props.model.form['process_status_history'].find(item => item.status_type === props.model.form['status_type'] && item.is_done === 0)
  } else return null;
});

const iCanEdit = computed(() => {
  if (statusType.value === "START") {
    return true;
  }

  if (!computedStep.value) return false;

  switch (computedStep.value.subject_type) {
    case "ANY_EMP":
      return true;

    case "CREATOR":
      return userInfo.value.id && computedStep.value.user_id === userInfo.value.id;

    case "DIRECT":
      return computedStep.value.user_id === userInfo.value.id && computedStep.value.role_id === userInfo.value.role;

    case "CURRENT":
      return false;

    case "TO_ROLE":
      return computedStep.value.role_id === userInfo.value.role;

    case "VOTERS":
      return props.model.form['process_voting_people'].some(p =>
        p.user_id === userInfo.value.id && p.role_id === userInfo.value.role
      );

    default:
      return false;
  }
});

</script>

<style scoped>

</style>
