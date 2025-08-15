<template>
  <NodeToolbar :is-visible="selected" :position="data.toolbarPosition">
    <a-popconfirm
      title="Устгахдаа итгэлтэй байна уу?"
      ok-text="Тийм"
      cancel-text="Үгүй"
      @confirm="$emit('delete-node', id)"
    >
      <button
        type="button"
        class="-translate-y-12 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </a-popconfirm>
  </NodeToolbar>
  <div class="border-2 rounded-full start-node node-container bg-white" :class="getColorClasses">
    <div class="p-3 min-w-[80px]">
      <div class="flex items-center gap-1">
        <font-awesome-icon
          :icon="data.icon || 'fa-solid fa-play'"
          :class="textColor"
        />
        <div :class="['text-sm text-center', textColor]">{{ data?.label || 'Эхлэл' }}</div>
      </div>
    </div>
    <Handle type="source" position="bottom" class="output-handle" :class="getHandleColor"/>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {Handle} from '@vue-flow/core';
import {NodeToolbar} from '@vue-flow/node-toolbar';
import {getStatusBgColor, getStatusBorderColor, getStatusColor} from '../flow/status.js';

const props = defineProps({
  id: String,
  data: {
    type: Object,
    default: () => ({
      label: 'Эхлэл',
      toolbarPosition: 'top',
      icon: 'fa-solid fa-play',
      color: 'blue',
      subject: {object_type: 'START'},
    }),
  },
  position: Object,
  selected: Boolean,
});

defineEmits(['delete-node']);

const getColorClasses = computed(() => {
  const baseClasses = getStatusBorderColor(props.data.subject.object_type);
  const borderClasses = getStatusColor(props.data.subject.object_type);
  return `${baseClasses} ${borderClasses} ${props.selected ? 'brightness-110' : ''}`;
});

const textColor = computed(() => {
  const colorClass = getStatusColor(props.data.subject.object_type);
  return colorClass.split(' ').find(cls => cls.startsWith('text-')) || 'text-gray-700';
});
const getHandleColor = computed(() => {
  const baseClasses = getStatusBgColor(props.data.subject.object_type);
  const borderClasses = getStatusBorderColor(props.data.subject.object_type);
  return `${baseClasses} ${borderClasses} ${props.selected ? 'brightness-110' : ''}`;
});

</script>

<style scoped>
</style>
