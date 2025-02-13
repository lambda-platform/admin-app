<template>
  <div>
    {{loading}}
    <Loading v-if="loading"/>
    <div
      v-if="!loading && computedStatusHistory &&computedStatusHistory.length && currentStep">
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
        :isVote="currentStep.attrs.subject.object_type === 'VOTE'"
      />


    </div>

  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter} from "vue-router";
const { commit } = useStore()
const router = useRouter();
import {defineProps, ref, computed, onMounted, watch, toRaw} from "vue";
import Status from "~/modules/process/Status.vue";
import {Flow} from "~/modules/workflow/flow/flow";
import {createStatusHistory} from "~/modules/workflow/flow/status";
import Loading from "~/modules/common/Loading.vue";
import { useRoute, } from 'vue-router';
const route = useRoute();

import {userInfo, currentStep} from "~/store/useSiteSettings";
import {WorkFlowByCategory, WorkFlowByID} from "~/modules/workflow/graphql/fetch";
import {IS_CAN_EDIT, IS_READ_ONLY, CURRENT_STEP} from "~/modules/process/store/mutation-types";
import axios from "~/plugins/core/axios";

import {message} from "ant-design-vue"

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
  isBuilder: Boolean
});


const creatorEmpID = computed(() => {
  return props.model.form["emp_id"];
});
const creatorUserID = computed(() => {
  return props.model.form["user_id"];
});

const votingPeople = computed(() => {
  return props.model.form["process_voting_people"];
});

const schemaID = computed(() => {
  return parseInt(props.meta.schemaID);
});

const flowData = ref({});
const workflow = ref(null);
const currentSteps = ref([]);
const loading = ref(true);
const withEndVote = ref(false);



function handleSubmit(step) {


  props.validateWithSubForm();

  if(step){

    // axios.post('/process/notification', {
    //   ...step,
    //   creator_id: creatorEmpID.value,
    //   form_id: ID.value,
    //   // workflow_category_id: workflowCategoryID.value,
    //   votingPeople: votingPeople.value,
    //   notify: true
    // }).catch(error => {
    //     console.error("API call failed: ", error);
    // });
  }

}

async function saveAndGoToNext(step, transferEmployees, endVote)
{

  let actionNum = step.action_num ? step.action_num + 1 : 0;

  let transferHistories = []
  if(transferEmployees){


    transferHistories = toRaw(transferEmployees.map(e=>{
      return {
        ...step,
        ID:undefined,
        CREATED_AT:undefined,
        emp_id:e.emp_id,
        struct_id:e.struct_id,
        subject_type:"DIRECT",
        action_num:actionNum
      }
    }))

  }


  try {
    const formValid = await props.validateDataForm();

    if (formValid) {
      /*
      *
      * NEED IMPROVE !!!!
      * */
      // loading.value = true;

      // if (currentStep.value.attrs.subject.object_type === 'PREPARE_VOTE') {
      //   if(votingPeople.value.length <= 0){
      //
      //     loading.value = true ;
      //     setTimeout(()=>{
      //       loading.value = false;
      //     }, 500)
      //     message.warn("Санал өгөх албан тушаалтан сонгоно уу !!!");
      //
      //
      //     return null
      //   }
      // }

      if (currentStep.value.attrs.subject.object_type === 'VOTE') {



        const {  emp_id } = userInfo.value;
        const index = props.model.form['process_voting_people'].findIndex(
          ({  emp_id }) => Number(emp_id) === Number(emp_id)
        );

        if (index >= 0 && !endVote) {
          if (step.sourcePortLabel === "Дэмжсэн" || step.sourcePortLabel === "Зөвшөөрнө") {
            props.model.form['process_voting_people'][index]["APPROVE"] = 1;
            props.model.form['process_voting_people'][index]["RECREATE"] = 0;
          } else if (step.sourcePortLabel === "Нэмэлт материал шаардлагатай") {
            props.model.form['process_voting_people'][index]["APPROVE"] = 0;
            props.model.form['process_voting_people'][index]["RECREATE"] = 1;
          } else {
            props.model.form['process_voting_people'][index]["APPROVE"] = 0;
            props.model.form['process_voting_people'][index]["RECREATE"] = 0;
          }
          props.model.form['process_voting_people'][index]["VOTED"] = 1;
          props.model.form['process_voting_people'][index]["signature_IMAGE"] = step.signature ? JSON.stringify(step.signature) : null;
          props.model.form['process_voting_people'][index]["signature_DATE"] = new Date();
          props.model.form['process_voting_people'][index]["description"] = step.currentdescription;


          let votedCount = 0;
          let approveCount = 0;
          let notApproveCount = 0;
          // let recreateCount = 0;
          let votersCount = props.model.form['process_voting_people'].length;

          props.model.form['process_voting_people'].forEach(vote => {
            if (vote.VOTED === 1) {
              votedCount++
            }
            // if (vote.approve !== 1 && vote.RECREATE === 0) {
            //   allApproved = false;
            //   allRecreate = false;
            //   notApproveCount++;
            // }
            if (vote.approve === 1) {
              approveCount++;
            } else {
              notApproveCount++;
            }
            // if (vote.approve === 0 && vote.RECREATE === 1) {
            //   allApproved = false;
            //   allNotApproved = false;
            //   recreateCount++;
            // }
          });

          if (votedCount >= votersCount) {

            if (approveCount >= notApproveCount) {
              const approveIndex = currentSteps.value.findIndex(c => c.sourcePortLabel === "Дэмжсэн" || c.sourcePortLabel === "Зөвшөөрнө")

              if (approveIndex >= 0) {
                const stepStatus = await createStatusHistory(currentSteps.value[approveIndex], undefined, [], route)

                setStatus(stepStatus);

                if (stepStatus.status_type === "CANCEL" || stepStatus.status_type === "END") {
                  const endIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === stepStatus.status_id);

                  if (endIndex >= 0) {
                    props.model.form['process_status_history'][endIndex].is_done = 1;
                    props.model.form['process_status_history'][endIndex].struct_id = userInfo.value.struct_id * 1;
                    props.model.form['process_status_history'][endIndex].emp_id = userInfo.value.emp_id;


                    const max_action_num = Math.max(props.model.form['process_status_history'].map(item => item["action_num"]));;
                    props.model.form['process_status_history'][endIndex].action_num = max_action_num+1
                  }
                }

                const statusIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === currentStep.value.id);
                if (statusIndex >= 0) {
                  props.model.form['process_status_history'][statusIndex].is_done = 1;
                }
              }
            } else  {
              const approveIndex = currentSteps.value.findIndex(c => c.sourcePortLabel === "Дэмжээгүй" || c.sourcePortLabel === "Зөвшөөрөхгүй")

              if (approveIndex >= 0) {
                const stepStatus = await createStatusHistory(currentSteps.value[approveIndex], undefined, [], route)

                setStatus(stepStatus);

                if (stepStatus.status_type === "CANCEL" || stepStatus.status_type === "END") {
                  const endIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === stepStatus.status_id);

                  if (endIndex >= 0) {
                    props.model.form['process_status_history'][endIndex].is_done = 1;
                    props.model.form['process_status_history'][endIndex].struct_id = userInfo.value.struct_id * 1;
                    props.model.form['process_status_history'][endIndex].emp_id = userInfo.value.emp_id;
                  }
                }

                const statusIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === currentStep.value.id);
                if (statusIndex >= 0) {
                  props.model.form['process_status_history'][statusIndex].is_done = 1;
                }
              }
            }
            // else {
            //   const approveIndex = currentSteps.value.findIndex(c => c.sourcePortLabel === "Нэмэлт материал шаардлагатай")
            //
            //   if (approveIndex >= 0) {
            //     const stepStatus = await createStatusHistory(currentSteps.value[approveIndex], undefined, [])
            //
            //     setStatus(stepStatus);
            //
            //     if (stepStatus.status_type === "CANCEL" || stepStatus.status_type === "END") {
            //       const endIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === stepStatus.status_id);
            //
            //       if (endIndex >= 0) {
            //         props.model.form['process_status_history'][endIndex].is_done = 1;
            //         props.model.form['process_status_history'][endIndex].struct_id = userInfo.value.struct_id * 1;
            //         props.model.form['process_status_history'][endIndex].emp_id = userInfo.value.emp_id;
            //       }
            //     }
            //
            //     const statusIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === currentStep.value.id);
            //     if (statusIndex >= 0) {
            //       props.model.form['process_status_history'][statusIndex].is_done = 1;
            //     }
            //   }
            // }
          }
        } else {

          if(endVote){
            const endVoteIndex = props.model.form['process_status_history'].findIndex(h=>h.status_type === "END_VOTE")


            if (endVoteIndex >= 0) {


              props.model.form['process_status_history'][endVoteIndex].is_done = 1;
              props.model.form['process_status_history'][endVoteIndex].struct_id = userInfo.value.struct_id * 1;
              props.model.form['process_status_history'][endVoteIndex].emp_id = userInfo.value.emp_id;




              let nextStepsOfEndVote = workflow.value.getNextSteps({id:props.model.form['process_status_history'][endVoteIndex]["status_id"]})


              if(nextStepsOfEndVote.length > 0) {
                const stepStatus = await createStatusHistory(nextStepsOfEndVote[0], undefined, [], route)

                for (const nextStepOfEndVote of nextStepsOfEndVote) {

                  const nextStepOfEndVoteHistory = await createStatusHistory(nextStepOfEndVote, undefined, props.model.form['process_status_history'], route)




                  transferHistories.push({
                    workflow_category_id: workflowCategoryID.value,
                    ...nextStepOfEndVoteHistory,
                    action_num:props.model.form['process_status_history'][endVoteIndex]["action_num"]+1,
                    signature: null,
                    open: false
                  })
                }


                setStatus(stepStatus);
              }


              const statusIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === currentStep.value.id);
              if (statusIndex >= 0) {
                props.model.form['process_status_history'][statusIndex].is_done = 1;
              }
            }
          }
        }
      }
        // else if (currentStep.value.attrs.subject.object_type === "RECEIVE") {
        //   const index = props.model.form['process_status_history'].findIndex(h => h.status_id === currentStep.value.id && h.emp_id === userInfo.value.emp_id);
        //
        //
        //
        //   if (index >= 0 ) {
        //
        //     props.model.form['process_status_history'][index].status_action = step.sourcePortLabel;
        //     props.model.form['process_status_history'][index].is_done = 1;
        //     props.model.form['process_status_history'][index].signature = step.signature ? JSON.stringify(step.signature) : null;
        //     props.model.form['process_status_history'][index].description = step.currentdescription;
        //
        //   }
        //
        //   const notReceivedIndex = props.model.form['process_status_history'].findIndex(h=>h.status_type === "RECEIVE" && h.is_done === 0);
        //   if(notReceivedIndex === -1) {
        //     const endIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === step.status_id);
        //
        //     if (endIndex >= 0) {
        //       props.model.form['process_status_history'][endIndex].is_done = 1;
        //       props.model.form['process_status_history'][endIndex].struct_id = userInfo.value.struct_id * 1;
        //       props.model.form['process_status_history'][endIndex].emp_id = userInfo.value.emp_id;
        //       props.model.form['process_status_history'][endIndex].status_action = step.sourcePortLabel;
        //
        //       setStatus(step);
        //     }
        //   }
        //
      // }
      else {


        setStatus(step);


        if (step.status_type === "CANCEL" || step.status_type === "END") {
          const endIndex = props.model.form['process_status_history'].findIndex(h => h.status_id === step.status_id);

          if (endIndex >= 0) {
            props.model.form['process_status_history'][endIndex].is_done = 1;
            props.model.form['process_status_history'][endIndex].struct_id = userInfo.value.struct_id * 1;
            props.model.form['process_status_history'][endIndex].emp_id = userInfo.value.emp_id;
          }

        }

        const index = props.model.form['process_status_history'].findIndex(h => h.status_id === currentStep.value.id);



        if (index >= 0) {


          if (props.model.form['process_status_history'][index].status_type === "START") {

            props.model.form['process_status_history'][index].status_action = "Боловсруулсан"

          } else {

            props.model.form['process_status_history'][index].status_action = step.sourcePortLabel;

          }




          props.model.form['process_status_history'][index].is_done = 1;
          props.model.form['process_status_history'][index].signature = step.signature ? JSON.stringify(step.signature) : null;
          props.model.form['process_status_history'][index].description = step.currentdescription;

          props.model.form['process_status_history'][index].struct_id = userInfo.value.struct_id * 1;
          props.model.form['process_status_history'][index].emp_id = userInfo.value.emp_id;

          props.model.form['process_status_history'][index].role_id = userInfo.value.role_id * 1;
          props.model.form['process_status_history'][index].user_id = userInfo.value.id;
        }
      }
      /*
      *
      * NEED IMPROVE !!!!
      * */

      if(transferHistories.length >= 1){
        props.model.form['process_status_history'] = [...props.model.form['process_status_history'].filter(s=>{
          if(s.status_type === "TRANSFER"){
            return s.subject_type !== 'ANY_EMP'
          } else {
            return s.status_type !== "RECEIVE"
          }
        }), ...transferHistories];
      } else {
        props.model.form['process_status_history'] = [...props.model.form['process_status_history'].filter(s=>{
          if(s.status_type === "TRANSFER"){
            return s.subject_type !== 'ANY_EMP'
          } else {
            return true
          }
        }), ...transferHistories];
        if(endVote){
          props.model.form['process_status_history'] = [...props.model.form['process_status_history'].filter(s=>{
            if(s.status_type === "END_VOTE"){
              return s.is_done === 1
            } else {
              return true
            }
          }), ...transferHistories];
        }

      }

      console.log(toRaw(props.model.form['process_status_history'].map(h=>toRaw(h))))

      handleSubmit(step)
    }

  } catch (error) {
  }

}


function setStatus(step) {
  props.model.form['STATUS'] = step.step_data.attrs.label.text
  props.model.form['status_type'] = step.step_data.attrs.subject.object_type
  props.model.form['status_id'] = step.step_data.id


}

function changeEmp(payload) {
  const index = props.model.form['process_status_history'].findIndex(h => h.status_id === payload.status_id);
  if (index >= 0) {
    if (payload.emp_id || payload.emp_id === null) {
      props.model.form['process_status_history'][index].emp_id = payload.emp_id;
    }

    if (payload.struct_id || payload.struct_id === null) {
      props.model.form['process_status_history'][index].struct_id = payload.struct_id;
    }
    // if (payload.org_id || payload.org_id === null) {
    //   props.model.form['process_status_history'][index].org_id = payload.org_id;
    // }
    // if (payload.org_role_id || payload.org_role_id === null) {
    //   props.model.form['process_status_history'][index].org_role_id = payload.org_role_id;
    // }
    // if (payload.user_id || payload.user_id === null) {
    //   props.model.form['process_status_history'][index].user_id = payload.user_id;
    // }
    // if (payload.role_id || payload.role_id === null) {
    //   props.model.form['process_status_history'][index].role_id = payload.role_id;
    // }
  }
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
            struct_id: votingPeople.struct_id,
            emp_id: votingPeople.emp_id,
            role_id: votingPeople.role_id,
            user_id: votingPeople.user_id,
            // id: null,
            // row_id: null,
            // approve: 0,
            // recreate: 0,
            // voted: 0,
            // signature_date: null,
            // signature_image: null,
            // description: null,
            workflow_category_id: workflowCategoryID.value
          }

        });

        props.subFormFillData('process_voting_people')
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


watch(() => votingPeople, () => {

  if (votingPeople.value && votingPeople.value.length > 0) {

    for (let i = 0; i < votingPeople.value.length; i++) {
      if (votingPeople.value[i].workflow_category_id !== workflowCategoryID.value) {
        votingPeople.value[i].workflow_category_id = workflowCategoryID.value;
      }
    }
  }
}, {deep: true});

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
  console.log("init status");

  const flow = await getWorkFlowData();
  let currentStepPre = null;

  let actionNum = 0;
  if (flow !== null) {

    workflow.value = flow;

    withEndVote.value = flow.withEndVote;
    let preHistories = [];

    if (!props.editMode || props.model.form['status_id'] === null || props.model.form['status_id'] === undefined) {

      if (flow.starts.length >= 1) {

        const steps = flow.getNextSteps(flow.starts[0]);
        currentSteps.value = steps
        const startStep = flow.starts[0];
        const startStatusHistory = await createStatusHistory(startStep, userInfo.value, preHistories, route)


        setStatus(startStatusHistory);

        preHistories.push({
          workflow_category_id: workflowCategoryID.value,
          ...startStatusHistory,
          action_num:actionNum
        });



        if (steps && steps.length >= 1) {

          for (const step of steps) {
            actionNum = actionNum + 1;
            const stepStatusHistory = await createStatusHistory(step, undefined, preHistories, route)

            preHistories.push({
              workflow_category_id: workflowCategoryID.value,
              ...stepStatusHistory,
              action_num:actionNum,
              signature: null,
              open: false
            })
          }

          currentStepPre = startStep
        }
      }
    } else {

      preHistories = toRaw(props.model.form['process_status_history']);

      if(preHistories.length >= 1) {
        actionNum = preHistories[preHistories.length - 1].action_num + 1;
      }

      currentStepPre = flow.getCellById(props.model.form['status_id'])

      // if(!currentStepPre.attrs.subject.emp_id){
      //   const currentIndex = preHistories.findIndex((h) => h.status_id === props.model.form['status_id']);
      //   currentStepPre.attrs.subject.emp_id = preHistories[currentIndex].emp_id
      //   currentStepPre.attrs.subject.struct_id = preHistories[currentIndex].struct_id
      // }

      // if (flow.withVote) {
      //   if (currentIndex < flow.voteIndex) {
      //     props.setSchemaByModel('VOTE_ADDITIONAL_COMMENTS', 'hidden', true)
      //     props.setSchemaByModel('process_voting_people', 'hidden', false)
      //   } else {
      //     props.setSchemaByModel('VOTE_ADDITIONAL_COMMENTS', 'hidden', true)
      //     props.setSchemaByModel('process_voting_people', 'hidden', true)
      //   }
      // }

      if (currentStepPre) {
        const steps = flow.getNextSteps(currentStepPre);

        currentSteps.value = steps

        if (steps && steps.length >= 1) {
          for (const step of steps) {
            let index = preHistories.findIndex(h => h.status_id === step.id);


            const stepStatusHistory = await createStatusHistory(step, undefined, preHistories, route);

            if (index >= 0) {

              if (preHistories[index].step_data) {

                if (preHistories[index].step_data.sourcePortLabel !== step.sourcePortLabel) {
                  index = -1
                }

              }
            }

            if (index >= 0) {


              if(preHistories[index].status_type === "TRANSFER") {
                console.log(preHistories[index].is_done)

                if(preHistories[index].is_done === 1) {
                  let currentStepStatusHistory = await createStatusHistory(currentStepPre, undefined, preHistories, route);

                  currentStepStatusHistory.step_data.sourcePortLabel = 'Холбогдох хүмүүст цохсон'
                  preHistories.push({
                    workflow_category_id: workflowCategoryID.value,
                    ...currentStepStatusHistory,
                    action_num:actionNum,
                    subject_type:"ANY_EMP",
                    signature: null,
                    open: false
                  })
                } else {
                  preHistories[index].step_data = stepStatusHistory.step_data;
                  preHistories[index].IS_READ_ONLY = stepStatusHistory.is_read_only;
                  preHistories[index].IS_signature_NEEDED = stepStatusHistory.is_signature_needed;
                  preHistories[index].IS_SUBJECT_CHANGEABLE = stepStatusHistory.is_subject_changeable;
                  // props.model.form['process_status_history'][index].org_role_id = stepStatusHistory.org_role_id;
                  // props.model.form['process_status_history'][index].org_id = stepStatusHistory.org_id;
                  // props.model.form['process_status_history'][index].struct_id = stepStatusHistory.struct_id;
                  // props.model.form['process_status_history'][index].emp_id = stepStatusHistory.emp_id;
                  preHistories[index].description = stepStatusHistory.description;
                  // props.model.form['process_status_history'][index].description = stepStatusHistory.description;

                  preHistories[index].is_done = 0;
                }

              } else {
                // console.log(stepStatusHistory)
                preHistories[index].step_data = stepStatusHistory.step_data;
                preHistories[index].is_read_only = stepStatusHistory.is_read_only;
                preHistories[index].is_signature_needed = stepStatusHistory.is_signature_needed;
                preHistories[index].is_subject_changeable = stepStatusHistory.is_subject_changeable;
                // props.model.form['process_status_history'][index].org_role_id = stepStatusHistory.org_role_id;
                // props.model.form['process_status_history'][index].org_id = stepStatusHistory.org_id;
                // props.model.form['process_status_history'][index].struct_id = stepStatusHistory.struct_id;
                // props.model.form['process_status_history'][index].emp_id = stepStatusHistory.emp_id;
                preHistories[index].description = stepStatusHistory.description;
                // props.model.form['process_status_history'][index].description = stepStatusHistory.description;
                preHistories[index].is_done = 0;
              }
            } else {

              preHistories.push({
                workflow_category_id: workflowCategoryID.value,
                ...stepStatusHistory,
                action_num:actionNum,
                signature: null,
                open: false
              })
            }
          }
        }
      }

    }



    props.model.form['process_status_history'] = preHistories;

    commit(IS_CAN_EDIT, setPermission(currentStepPre, preHistories))
    commit(IS_READ_ONLY, iReadOnly(currentStepPre, preHistories))
    commit(CURRENT_STEP, currentStepPre)
    prepareForm(currentStepPre)
    loading.value = false;
  }

  console.log("init done");
}
function prepareForm(currentStepPre){


  if (currentStepPre.attrs.subject.object_type === "PREPARE_VOTE") {

    props.setSchemaByModel('process_voting_people', 'hidden', false)
  } else if (currentStepPre.attrs.subject.object_type === "VOTE") {

  } else {

    props.setSchemaByModel('process_voting_people', 'hidden', true)
  }


  // if (currentStepPre.attrs.subject.object_type === "GIVE" ) {
  //   props.setSchemaByModel('DOC_DATA', 'hidden', true)
  //   props.setSchemaByModel('VOTE_ADDITIONAL_COMMENTS', 'hidden', true)
  //   props.setSchemaByModel('process_voting_people', 'hidden', true)
  //   props.setSchemaByModel('DOC_DATE', 'hidden', false)
  //   props.setSchemaByModel('description', 'hidden', false)
  //   props.setSchemaByModel('DOC_NUMBER', 'hidden', false)
  //   props.setSchemaByModel('DOC_NAME', 'hidden', false)
  //
  //   props.setSchemaByModel('ATTACHMENTS', 'hidden', false)
  //   props.setSchemaByModel('ATTACHMENTS', 'disabled', false)
  // } else if (currentStepPre.attrs.subject.object_type === "RECEIVE") {
  //   props.setSchemaByModel('DOC_DATA', 'hidden', true)
  //   props.setSchemaByModel('VOTE_ADDITIONAL_COMMENTS', 'hidden', true)
  //   props.setSchemaByModel('process_voting_people', 'hidden', true)
  //   props.setSchemaByModel('DOC_DATE', 'hidden', true)
  //   props.setSchemaByModel('description', 'hidden', true)
  //   props.setSchemaByModel('DOC_NUMBER', 'hidden', true)
  //   props.setSchemaByModel('DOC_NAME', 'hidden', true)
  //
  //   props.setSchemaByModel('ATTACHMENTS', 'hidden', false)
  //   props.setSchemaByModel('ATTACHMENTS', 'disabled', true)
  // }

  if (currentStepPre.attrs.subject.object_type === "RECEIVE" || currentStepPre.attrs.subject.object_type === "PRE_END" || currentStepPre.attrs.subject.object_type === "END") {

    props.setSchemaByModel('DOC_DATE', 'disabled', true)
    props.setSchemaByModel('description', 'disabled', true)
    props.setSchemaByModel('DOC_NUMBER', 'disabled', true)
    props.setSchemaByModel('DOC_NAME', 'disabled', true)
    props.setSchemaByModel('ATTACHMENTS', 'disabled', true)
  }


  // PREPARE_VOTE
}
function isActionSubject(statusHistories, current){
  let cindex = statusHistories.findIndex(h => h.status_id === current.id && h.emp_id === userInfo.value.emp_id);
  if(cindex >=0){

    if(statusHistories[cindex].is_done === 0){
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
const setPermission =(current, statusHistories) => {

  if (current) {


    if (current.attrs.subject.object_type !== 'END' && current.attrs.subject.object_type !== 'VOTE' && !current.attrs.subject.is_read_only) {



      if ((props.model.form['emp_id'] && props.model.form['emp_id'] === userInfo.value.emp_id) ||  (props.model.form['user_id'] &&  props.model.form['user_id'] === userInfo.value.id)) {

        if (current.attrs.subject.object_type === 'START' || current.attrs.subject.object_type === 'RE_CREATE') {
          return true
        } else {
          let cindex = statusHistories.findIndex(h => h.status_id === current.id);

          if(cindex >=0){
            if((statusHistories[cindex].emp_id && statusHistories[cindex].emp_id === userInfo.value.emp_id) || (statusHistories[cindex].user_id && statusHistories[cindex].user_id === userInfo.value.id)){
              return true
            }
          }
          return false
        }
      } else {
        let cindex = statusHistories.findIndex(h => h.status_id === current.id);

        if(cindex >=0){

          if(current.attrs.subject.subject_type === "TO_ROLE"){

            if(statusHistories[cindex].role_id === userInfo.value.role){
              return true
            }
          } else if (current.attrs.subject.object_type === "DIRECT"){
            if((statusHistories[cindex].emp_id && statusHistories[cindex].emp_id === userInfo.value.emp_id) || (statusHistories[cindex].user_id && statusHistories[cindex].user_id === userInfo.value.id)){
              return true
            }
          }


        } else {

        }
        return false
      }

    } else {
      if (current.attrs.subject.object_type === 'VOTE') {
        if(withEndVote.value){
          if (props.model.form['emp_id'] === userInfo.value.emp_id || props.model.form['user_id'] === userInfo.value.id) {
            return true
          }
        }
        const index = props.model.form['process_voting_people'].findIndex(p => p.emp_id === userInfo.value.emp_id ||  p.user_id === userInfo.value.id);
        if (index >= 0) {
          return props.model.form['process_voting_people'][index]["VOTED"] === 0
        } else {
          return false
        }

      } else {

        if (current.attrs.subject.subject_type === 'CREATOR') {

          if ((props.model.form['emp_id'] && props.model.form['emp_id'] === userInfo.value.emp_id) || (props.model.form['user_id'] && props.model.form['user_id'] === userInfo.value.id)) {
            return true;
          } else {
            if(current.attrs.subject.object_type === "TRANSFER" || current.attrs.subject.object_type === "RECEIVE") {
              return isActionSubject(statusHistories, current)
            }
            return false
          }
        } else {

          if(current.attrs.subject.object_type === "TRANSFER" || current.attrs.subject.object_type === "RECEIVE") {
            return isActionSubject(statusHistories, current)
          } else {



            if ((current.attrs.subject.emp_id && current.attrs.subject.emp_id === userInfo.value.emp_id) || (current.attrs.subject.user_id && current.attrs.subject.user_id === userInfo.value.id)) {
              return true
            } else {
              return false
            }
          }

        }
        return false
      }

    }
  } else {
    return false;
  }


}

const iReadOnly =(current, statusHistories) => {


  if(current){
    if((current.attrs.subject.object_type !== 'END' && current.attrs.subject.is_read_only) || current.attrs.subject.object_type === 'VOTE') {

      return true

    } else {
      if(props.model.form['emp_id'] === userInfo.value.emp_id && current.attrs.subject.object_type !== 'END'){
        if(current.attrs.subject.object_type !== 'START' && current.attrs.subject.object_type !== 'RE_CREATE'){
          if(current.attrs.subject){
            if(current.attrs.subject.emp_id && current.attrs.subject.emp_id === userInfo.value.emp_id){

              return false
            }
          }

          return true
        } else {
          return false
        }
      } else {
        return false
      }

    }
  }


};

onMounted(() => {

  initStatus();

})

function close() {

}

const computedStatusHistory = computed(() => {
  return props.model.form['process_status_history'];
});
watch(() => props.model.form['process_status_history'], { deep: true });



</script>

<style scoped>

</style>
