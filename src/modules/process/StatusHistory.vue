<!-- modules/process/StatusHistory.vue -->
<template>
  <div class="w-full">
    <a-spin v-if="loading" />
    <div
      v-else
      v-for="actionNumber in actionNumbers"
      :key="actionNumber.index"
      class="border border-green-500 p-3 pl-7 my-2 rounded-lg"
    >
      <ol :class="`relative ${smallsignature ? '' : ''}`">
        <li
          v-for="(item, index) in statusHistories.filter((h) => h.action_num === actionNumber.action_num)"
          :key="index"
          :class="`mb-5 ${smallsignature ? 'ms-11' : 'ms-12'} ${item.is_done ? '' : 'opacity-60'}`"
        >
          <span
            :class="`absolute flex items-center justify-center rounded-full ${
              smallsignature ? 'start-1 mt-1 w-8 h-8' : '-start-5 w-10 h-10'
            } ${getStatusBgColor(item.status_type)}`"
          >
            <font-awesome-icon :icon="getIconByType(item.status_type)" class="text-lg" />

          </span>
          <h3 class="flex items-center mb-1 font-semibold text-gray-900 dark:text-white">
            {{ getStatusLabel(item.is_done ? item.status_action ?? item.status : item.status) }}
          </h3>
          <time class="block mb-2 text-sm font-normal leading-none text-gray-700 dark:text-gray-500">
            Огноо: {{ item.is_done || item.status_type === 'END' || item.status_type === 'CANCEL' ? $dateTime(item.created_at) : 'Үйлдэл хүлээгдэж байна' }}
          </time>
          <p
            v-if="item.description"
            class="text-sm font-normal text-gray-700 dark:text-gray-400 p-2 bg-blue-100 rounded"
          >
            Тайлбар: {{ item.description }}
          </p>
          <div
            v-if="item.signature && item.signature !== 'null' && !smallsignature"
            class="border rounded p-3 mt-2"
            style="border-color: #0b4da3"
          >
            <table style="width: 100%; margin: 0; padding: 0; color: #0b4da3">
              <tbody>
              <tr>
                <td
                  style="text-align: left; font-family: Arial; font-size: 12px; vertical-align: middle"
                >
                  {{ item.signature.signAction }}: {{ item.signature.job_name }}<br />
                  {{ item.signature.struct }}
                </td>
                <td
                  style="text-align: center; font-family: Arial; font-size: 12px; padding-left: 10px; vertical-align: middle"
                >
                  <span v-if="item.signature.type === 'text'">{{ item.signature.signature }}<br /></span>
                  <img
                    v-else-if="item.signature.signature !== null"
                    class="h-10 mx-auto"
                    :src="`${item.signature.type === 'draw' ? '' : 'https://emiat.miat.com'}${item.signature.signature}`"
                    alt=""
                  />
                  <span v-if="item.signature.type === 'text'">
                      {{ t('process.ESignedDate') }}: <br />{{ $dateTime(item.created_at) }}
                    </span>
                  <span v-else>
                      {{ t('process.ESigned') }}:
                      {{ item.signature.lastname ? item.signature.lastname.charAt(0).toUpperCase() : '' }}.{{
                      item.signature.firstname
                    }}<br />
                      Огноо цаг: {{ $dateTime(item.created_at) }}
                    </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div
            v-if="item.signature && item.signature !== 'null' && smallsignature"
            class="border rounded p-3 mt-2"
            style="border-color: #0b4da3"
          >
            <table style="width: 100%; margin: 0; padding: 0; color: #0b4da3">
              <tbody>
              <tr>
                <td
                  style="text-align: left; font-family: Arial; font-size: 12px; vertical-align: middle"
                >
                  {{ item.signature.signAction }}: {{ item.signature.job_name }}<br />
                  {{ item.signature.struct }}
                </td>
              </tr>
              <tr>
                <td
                  style="text-align: center; font-family: Arial; font-size: 12px; padding-left: 10px; vertical-align: middle"
                >
                  <span v-if="item.signature.type === 'text'">{{ item.signature.signature }}<br /></span>
                  <img
                    v-else-if="item.signature.signature !== null"
                    class="h-10 mx-auto"
                    :src="`${item.signature.type === 'draw' ? '' : 'https://emiat.miat.com'}${item.signature.signature}`"
                    alt=""
                  />
                  <span v-if="item.signature.type === 'text'">
                      {{ t('process.ESignedDate') }}: <br />{{ $dateTime(item.created_at) }}
                    </span>
                  <span v-else>
                      {{ t('process.ESigned') }}:
                      {{ item.signature.lastname ? item.signature.lastname.charAt(0).toUpperCase() : '' }}.{{
                      item.signature.firstname
                    }}<br />
                      Огноо цаг: {{ $dateTime(item.created_at) }}
                    </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="item.status_type !== 'VOTE' && item.emp" class="mt-2">
            <table style="width: 100%; margin: 0; padding: 0">
              <tbody>
              <tr>
                <td
                  style="text-align: left; font-family: Arial; font-size: 12px; vertical-align: middle"
                  class="text-gray-700"
                >
                  {{ item.emp.job }}<br />
                  {{ item.emp.struct }}<br />
                  {{ item.emp.last_name.charAt(0).toUpperCase() }}.{{ item.emp.first_name }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div v-if="item.status_type === 'VOTE'">
            <h3 class="flex items-center mb-1 font-semibold text-gray-900 dark:text-white">
              Санал өгсөн албан тушаалтан
            </h3>
            <div v-for="(vote, vindex) in votingPeople" :key="vindex">
              <div class="border rounded p-3 mt-2" style="border-color: #0b4da3">
                <table style="width: 100%; margin: 0; padding: 0; color: #0b4da3">
                  <tbody>
                  <tr>
                    <td
                      style="text-align: left; font-family: Arial; font-size: 12px; vertical-align: middle"
                    >
                      {{
                        vote.approve
                          ? t('process.Supported')
                          : vote.recreate
                            ? t('process.ToRecreate')
                            : vote.voted === 0
                              ? ''
                              : t('process.Unsupported')
                      }}:<br />
                      {{ vote.description }}
                    </td>
                    <td
                      style="text-align: center; font-family: Arial; font-size: 12px; padding-left: 10px; vertical-align: middle"
                    >
                      <div v-if="vote.signature_image">
                          <span v-if="vote.signature_image.type === 'text'">
                            {{ vote.signature_image.signature }}<br />
                          </span>
                        <img
                          v-else-if="vote.signature_image.signature !== null"
                          class="h-10 mx-auto"
                          :src="`${vote.signature_image.type === 'draw' ? '' : 'https://emiat.miat.com'}${vote.signature_image.signature}`"
                          alt=""
                        />
                        <span v-if="vote.signature_image.type === 'text'">
                            {{ t('process.ESignedDate') }}: <br />{{ $dateTime(vote.signature_date) }}
                          </span>
                        <span v-else>
                            {{ t('process.ESigned') }}:
                            {{
                            vote.signature_image.lastname
                              ? vote.signature_image.lastname.charAt(0).toUpperCase()
                              : ''
                          }}.{{ vote.signature_image.firstname }}<br />
                            Огноо цаг: {{ $dateTime(vote.signature_date) }}
                          </span>
                      </div>
                      <div v-else>
                          <span>
                            {{ vote.voted === 1 ? t('process.voted') + ':' : '' }}
                            {{ vote.emp.last_name.charAt(0).toUpperCase() }}.{{ vote.emp.first_name }}<br />
                            Огноо цаг: {{ $dateTime(vote.signature_date) }}
                          </span>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div
                v-if="vote.signature_image && smallsignature"
                class="border rounded p-3 mt-2"
                style="border-color: #0b4da3"
              >
                <table style="width: 100%; margin: 0; padding: 0; color: #0b4da3">
                  <tbody>
                  <tr>
                    <td
                      style="text-align: left; font-family: Arial; font-size: 12px; vertical-align: middle"
                    >
                      {{ vote.signature_image.signAction }}: {{ vote.signature_image.job_name }}<br />
                      {{ vote.signature_image.struct }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="text-align: center; font-family: Arial; font-size: 12px; padding-left: 10px; vertical-align: middle"
                    >
                        <span v-if="vote.signature_image.type === 'text'">
                          {{ vote.signature_image.signature }}<br />
                        </span>
                      <img
                        v-else-if="vote.signature_image.signature !== null"
                        class="h-10 mx-auto"
                        :src="`${vote.signature_image.type === 'draw' ? '' : 'https://emiat.miat.com'}${vote.signature_image.signature}`"
                        alt=""
                      />
                      <span v-if="vote.signature_image.type === 'text'">
                          {{ t('process.ESignedDate') }}: <br />{{ $dateTime(vote.signature_date) }}
                        </span>
                      <span v-else>
                          {{ t('process.ESigned') }}:
                          {{
                          vote.signature_image.lastname
                            ? vote.signature_image.lastname.charAt(0).toUpperCase()
                            : ''
                        }}.{{ vote.signature_image.firstname }}<br />
                          {{ t('process.datetime') }}: {{ $dateTime(vote.signature_date) }}
                        </span>
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
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import moment from 'moment';
import axios from '~/plugins/core/axios';
import { getStatusBgColor } from '~/modules/workflow/flow/status';
import { nodeTypes } from '~/modules/workflow/config/config';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const { te, t } = useI18n();

const props = defineProps({
  id: String,
  smallsignature: Boolean,
});

const loading = ref(false);
const actionNumbers = ref([]);
const statusHistories = ref([]);
const votingPeople = ref([]);

function getStatusLabel(key) {
  return te('process.' + key) ? t('process.' + key) : key;
}

function getIconByType(objectType) {
  const type = nodeTypes.find((type) => type.subject.object_type === objectType);
  return type ? type.icon : 'fa-solid fa-circle';
}

async function GetHistory() {
  try {
    loading.value = true;
    const r = await axios.get(`/process/history/${props.id}`);

    if (r.data.statusHistories && r.data.statusHistories.length) {
      statusHistories.value = r.data.statusHistories
        .map((history) => {
          if (history.signature && history.signature !== 'null') {
            history.signature = JSON.parse(history.signature);
          }
          return history;
        })
        .filter((h) => {
          if (h.status_type === 'RE_CREATE') {
            return h.is_done;
          }
          return true;
        });
    }
    if (r.data.votingPeople && r.data.votingPeople.length) {
      votingPeople.value = r.data.votingPeople.map((v) => {
        if (v.signature_image) {
          v.signature_image = JSON.parse(v.signature_image);
        }
        return v;
      });
    }
    if (r.data.actionNumbers && r.data.actionNumbers.length) {
      actionNumbers.value = r.data.actionNumbers;
    }
  } catch (error) {
    console.error('Error fetching history:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  GetHistory();
});
</script>

<style scoped>
.status-svg-icon-white {
  filter: invert(100%);
}
</style>
