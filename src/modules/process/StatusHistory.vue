<template>
  <div class="w-full">
    <a-spin v-if="loading"/>
    <ol v-else :class="`relative  ${!smallSignature ? '' : ''}`">
      <li v-for="(item, index) in statusHistories" :key="index"
          :class="`mb-5 ${smallSignature ? 'ms-11' : 'ms-12'} ${item.is_done ? '' : 'opacity-60'}`">
        <span
          :class="`absolute flex items-center justify-center rounded-full ${smallSignature ? 'start-1 mt-1  w-8 h-8' : '-start-5 w-10 h-10'} ${getStatusBgColor(item.status_type)}`">
          <img :src="getIconByType(item.status_type)"
               :class="`${smallSignature ? 'w-4 h-4' : 'w-6 h-6'} text-blue-800 dark:text-blue-300 status-svg-icon-white`"
               alt="">
        </span>
        <h3 class="flex items-center mb-1 font-semibold  text-gray-900 dark:text-white">
          {{ getStatusLabel(item.status) }}
        </h3>
        <time class="block mb-2 text-sm font-normal leading-none text-gray-700 dark:text-gray-500">
          {{ t("process.date") }}: {{ item.is_done || item.status_type === 'END' || item.status_type === 'CANCEL' ? formatDateTime(item.created_at) : t("process.ActionPending") }}
        </time>
        <p class="text-sm font-normal text-gray-700 dark:text-gray-400 p-2 bg-blue-100 rounded" v-if="item.description">
          {{ t("process.description") }}: {{ item.description }}</p>
        <div class="border rounded p-3 mt-2" style="border-color: #0b4da3"
             v-if="item.signature && item.signature !== 'null' && !smallSignature">
          <table style="width:100%; margin: 0; padding: 0; color: #0b4da3">
            <tbody>
              <tr>
                <td style="text-align: left; font-family: Arial,serif; font-size: 12px; vertical-align: middle">
                  {{ item.signature.signAction }}: {{ item.signature.job_name }}<br>
                  {{ item.signature.struct }}
                </td>
                <td
                  style="text-align: center; font-family: Arial,serif; font-size: 12px; padding-left: 10px; vertical-align: middle">
                  <span v-if="item.signature.type === 'text'">{{ item.signature.signature }}<br/></span>
                  <img v-else-if="item.signature.signature !== null" class="h-10 mx-auto "
                       :src="`${item.signature.type === 'draw' ? '' : ''}${item.signature.signature}`"
                       alt="">
                  <span v-if="item.signature.type === 'text'">{{ t("process.ESignedDate") }}<br>
                    {{ formatDateTime(item.created_at) }}
                  </span>
                  <span v-else>
                    {{ $t('process.ESigned') }}: {{ item.signature.lastname ? item.signature.lastname.charAt(0).toUpperCase() : '' }}.{{ item.signature.firstname }}<br/>
                    {{ $t('process.datetime') }}: {{ formatDateTime(item.created_at) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="border rounded p-3 mt-2" style="border-color: #0b4da3"
             v-if="item.signature && item.signature !== 'null' && smallSignature">
          <table style="width:100%; margin: 0; padding: 0; color: #0b4da3">
            <tbody>
              <tr>
                <td style="text-align: left; font-family: Arial,serif; font-size: 12px; vertical-align: middle">
                  {{ item.signature.signAction }}: {{ item.signature.job_name }}<br>
                  {{ item.signature.struct }}
                </td>
              </tr>
              <tr>
                <td
                  style="text-align: center; font-family: Arial,serif; font-size: 12px; padding-left: 10px; vertical-align: middle">
                  <span v-if="item.signature.type === 'text'">{{ item.signature.signature }}<br/></span>
                  <img v-else-if="item.signature.signature !== null" class="h-10 mx-auto"
                       :src="`${item.signature.type === 'draw' ? '' : ''}${item.signature.signature}`"
                       alt="">
                  <span v-if="item.signature.type === 'text'">{{ $t('process.ESigned') }} огноо цаг:<br>
                    {{ formatDateTime(item.created_at) }}</span>
                  <span v-else>
                    {{ $t('process.ESigned') }}: {{ item.signature.lastname ? item.signature.lastname.charAt(0).toUpperCase() : '' }}.{{ item.signature.firstname }}<br/>
                    {{ $t('process.datetime') }}: {{ formatDateTime(item.created_at) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="" style="" v-else-if="item.status_type !== 'VOTE' && item.user">
          <table style="width:100%; margin: 0; padding: 0; ">
            <tbody>
              <tr>
                <td style="text-align: left; font-family: Arial,serif; font-size: 12px; vertical-align: middle" class="text-gray-700">
                  {{ item.user.display_name }}<br>
                  {{ item.user.baiguullaga_ner ? '\"' + item.user.baiguullaga_ner + '\" ' : '' }}
                  {{ item.user.last_name ? item.user.last_name.charAt(0).toUpperCase() + "." : '' }}
                  {{ item.user.first_name ? item.user.first_name : '' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="item.status_type === 'VOTE'">
          <h3 class="flex items-center mb-1 font-semibold  text-gray-900 dark:text-white">
            {{ t("process.CouncilorWhoVoted") }}
          </h3>
          <div v-for="(vote, vindex) in votingPeople" :key="vindex">
            <div class="border rounded p-3 mt-2" style="border-color: #0b4da3"
                 v-if="vote.voted">
              <table style="width:100%; margin: 0; padding: 0; color: #0b4da3">
                <tbody>
                  <tr>
                    <td style="text-align: left; font-family: Arial,serif; font-size: 12px; vertical-align: middle">
                      {{ vote.approve ? t("process.Supported") : vote.recreate ? t("process.ToRecreate") : t("process.Unsupported") }}:
                    </td>
                    <td
                      style="text-align: center; font-family: Arial,serif; font-size: 12px; padding-left: 10px; vertical-align: middle">
                      <div v-if="vote.signature_image">
                        <span v-if="vote.signature_image.type === 'text'">{{ vote.signature_image.signature }}<br/></span>
                        <img v-else-if="item.signature.signature !== null" class="h-10 mx-auto"
                             :src="`${vote.signature_image.type === 'draw' ? '' : ''}${vote.signature_image.signature}`"
                             alt="">
                        <span v-if="vote.signature_image.type === 'text'">
                          {{ $t('process.ESigned') }} {{ $t('process.datetime') }}:<br>
                          {{ formatDateTime(vote.signature_date) }}
                        </span>
                        <span v-else>
                          {{ $t('process.ESigned') }}: {{ vote.signature_image.lastname.charAt(0).toUpperCase() }}.{{ vote.signature_image.firstname }}<br/>
                          {{ $t('process.datetime') }}: {{ formatDateTime(vote.signature_date) }}
                        </span>
                      </div>
                      <div v-else>
                        <span>
                          {{ $t("process.voted") }}: {{ vote.user.last_name.charAt(0).toUpperCase() }}.{{ vote.user.first_name }}<br/>
                          {{ $t('process.datetime') }}: {{ formatDateTime(vote.signature_date) }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="border rounded p-3 mt-2" style="border-color: #0b4da3"
                 v-if="vote.signature_image && smallSignature">
              <table style="width:100%; margin: 0; padding: 0; color: #0b4da3">
                <tbody>
                  <tr>
                    <td style="text-align: left; font-family: Arial,serif; font-size: 12px; vertical-align: middle">
                      {{ vote.signature_image.signAction }}: {{ vote.signature_image.job_name }}
                      <br>{{ vote.signature_image.struct }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="text-align: center; font-family: Arial,serif; font-size: 12px; padding-left: 10px; vertical-align: middle">
                      <span v-if="vote.signature_image.type === 'text'">{{ vote.signature_image.signature }}<br/></span>
                      <img v-else-if="vote.signature_image.signature !== null" class="h-10 mx-auto"
                           :src="`${vote.signature_image.type === 'draw' ? '' : ''}${vote.signature_image.signature}`"
                           alt="">
                      <span v-if="vote.signature_image.type === 'text'">{{ $t('process.ESigned') }} огноо цаг: <br>{{
                          formatDateTime(vote.signature_date)
                        }}</span>
                      <span
                        v-else> {{ $t('process.ESigned') }}: {{
                          vote.signature_image.lastname.charAt(0).toUpperCase()
                        }}.{{ vote.signature_image.firstname }} <br/> {{ $t('process.datetime') }}: {{
                          formatDateTime(vote.signature_date)
                        }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup>
import {getStatusBgColor} from "~/modules/workflow/flow/status";
import {defineProps, ref, onMounted} from "vue";
import {useI18n} from 'vue-i18n';
import axios from "~/plugins/core/axios";
import moment from 'moment';
import {
  SEEN_ICON,
  CONFIRMATION_ICON,
  SEND_TO_DOC_ICON, TRASH_ICON,
  VOTE_ICON, BANK_ICON
} from "~/modules/workflow/workflow/theme";

const {te, t} = useI18n();

const props = defineProps({
  id: String,
  smallSignature: Boolean
})

const loading = ref(false)
const statusHistories = ref([]);
const votingPeople = ref([]);

function formatDateTime(dateString) {
  return moment.utc(dateString).format('YYYY-MM-DD HH:mm');
}

function getStatusLabel(key) {
  if (te("process." + key)) {
    return t("process." + key)
  } else {
    return key
  }
}

const types = [
  {
    object_type: 'START',
    icon: "data:image/svg+xml,<svg width=\"10\" height=\"10\" viewBox=\"0 0 10 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6 9.6L7.374 8.226L5.646 6.498L6.498 5.646L8.226 7.374L9.6 6V9.6H6ZM3.6 9.6H0V6L1.374 7.374L4.2 4.554V0H5.4V5.046L2.226 8.226L3.6 9.6Z\" fill=\"black\"/></svg>"
  },
  {
    object_type: 'CASE',
    icon: CONFIRMATION_ICON
  },
  {
    object_type: 'VOTE',
    icon: VOTE_ICON
  },
  {
    object_type: 'ASSIGN',
    icon: SEND_TO_DOC_ICON
  },
  {
    object_type: 'DATE',
    icon: VOTE_ICON
  },
  {
    object_type: 'COURT',
    icon: BANK_ICON
  },
  {
    object_type: 'DETAIN',
    icon: SEEN_ICON
  },
  {
    object_type: 'CANCEL',
    icon: TRASH_ICON
  },
  {
    object_type: 'RE_CREATE',
    icon: "data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"512\" height=\"512\" x=\"0\" y=\"0\" viewBox=\"0 0 32 32\" style=\"enable-background:new 0 0 512 512\" xml:space=\"preserve\" class=\"\"><g><path d=\"M19.508 8.34H7.949l1.172-1.743a1.533 1.533 0 0 0-1.268-2.393H7.85a1.67 1.67 0 0 0-1.304.627L2.939 9.34a.8.8 0 0 0 0 1l3.607 4.508a1.67 1.67 0 0 0 1.304.627h.003a1.533 1.533 0 0 0 1.268-2.393L7.95 11.339h11.559a6.728 6.728 0 1 1 0 13.456h-3.272a1.5 1.5 0 0 0 0 3h3.272a9.728 9.728 0 1 0 0-19.456z\" data-name=\"Arrow Outline\" fill=\"%23000000\" opacity=\"1\" data-original=\"%23000000\"></path></g></svg>"
  },
  {
    object_type: 'END',
    icon: "data:image/svg+xml,<svg width=\"8\" height=\"11\" viewBox=\"0 0 8 11\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6.846 0L7.692 0.846L5.646 2.889L4.8 2.046L6.846 0ZM1.146 7.44H3.246V4.092L0 0.846L0.846 0L4.446 3.6V7.44H6.546L3.846 10.14L1.146 7.44Z\" fill=\"black\"/></svg>"
  },
  {
    object_type: 'POSTPONE',
    icon: "data:image/svg+xml,<svg width=\"8\" height=\"11\" viewBox=\"0 0 8 11\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6.846 0L7.692 0.846L5.646 2.889L4.8 2.046L6.846 0ZM1.146 7.44H3.246V4.092L0 0.846L0.846 0L4.446 3.6V7.44H6.546L3.846 10.14L1.146 7.44Z\" fill=\"black\"/></svg>"
  }
]


function getIconByType(objectType) {
  const type = types.find(type => type.object_type === objectType);
  return type ? type.icon : null;
}

async function GetHistory() {
  try {
    const r = await axios.get(`/process/history/${props.id}`,);

    if (r.data.statusHistories && r.data.statusHistories.length) {
      statusHistories.value = r.data.statusHistories.map(history => {
        if (history.signature) {
          if (history.signature !== "null") {
            history.signature = JSON.parse(history.signature)
          }
        }

        return history
      }).filter(h => {
        if (h.status_type === "RE_CREATE") {
          return h.is_done;
        } else {
          return true
        }
      });
    }
    if (r.data.votingPeople && r.data.votingPeople.length) {
      votingPeople.value = r.data.votingPeople.map(v => {
        if (v.signature_image) {
          v.signature_image = JSON.parse(v.signature_image)
        }
        return v
      });
    }


  } catch (error) {
    console.error(error);

  }
}

onMounted(() => {
  GetHistory();
});
</script>

<style scoped>

</style>
