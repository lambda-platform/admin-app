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
        class="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </a-popconfirm>
  </NodeToolbar>
  <div class="flex items-center border rounded-lg px-1 py-1 text-xs text-center bg-white node-container"
       :class="getColorClasses">
    <span class="flex-1 text-center trigger-label" :class="textColor">{{ data?.label || 'Триггер' }}
      <!--      {{ parentSubject?.object_type }}-->
    </span>
    <Handle
      :id="id"
      type="source"
      position="bottom"
      class="output-handle"
      :class="getHandleColor"
    />
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {Handle} from '@vue-flow/core';
import {NodeToolbar} from '@vue-flow/node-toolbar';
import {useVueFlow} from '@vue-flow/core';
import {getStatusBgColor, getStatusBorderColor, getStatusColor} from '../flow/status.js';

const props = defineProps({
  id: String,
  data: {
    type: Object,
    default: () => ({
      label: 'Триггер',
      toolbarPosition: 'top',
      parentSubject: Object,
    }),
  },
  parentSubject: Object,
  position: Object,
  selected: Boolean,
  parentNode: String,

});

defineEmits(['delete-node']);


const parentSubject = computed(() => {

  return props.data?.parentSubject || null;
});

const getColorClasses = computed(() => {
  const objectType = parentSubject.value?.object_type || 'CHECK';
  const baseClasses = getStatusBorderColor(objectType);
  const borderClasses = getStatusColor(objectType);
  return `${baseClasses} ${borderClasses} ${props.selected ? 'brightness-110' : ''}`;
});

const textColor = computed(() => {
  const objectType = parentSubject.value?.object_type || 'CHECK';
  const colorClass = getStatusColor(objectType);
  return colorClass.split(' ').find(cls => cls.startsWith('text-')) || 'text-gray-700';
});

const getHandleColor = computed(() => {
  const objectType = parentSubject.value?.object_type || 'CHECK';
  const baseClasses = getStatusBgColor(objectType);
  const borderClasses = getStatusBorderColor(objectType);
  return `${baseClasses} ${borderClasses}`;
});
</script>

<style scoped>
</style>
