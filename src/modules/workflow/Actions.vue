<template>
  <div class="w-[250px] bg-white shadow-md p-4 overflow-y-auto">
    <h2 class="text-lg font-semibold mb-4">Үйлдлүүд</h2>
    <div class="space-y-2">
      <div
        v-for="nodeType in nodeTypes"
        :key="nodeType.type + nodeType.label"
        class="p-3 rounded shadow cursor-pointer hover:opacity-90"
        :class="[
          getStatusBorderColor(nodeType.subject.object_type),
          getStatusColor(nodeType.subject.object_type)
        ]"
        :draggable="true"
        @dragstart="$emit('drag-start', $event, nodeType)"
      >
        <div class="flex items-center gap-2">
          <font-awesome-icon :icon="nodeType.icon" class="text-lg" />
          <span>{{ nodeType.label }}</span>
        </div>
        <div v-if="nodeType.triggers" class="mt-2 text-xs text-gray-600">
          Үйлдлүүд:
          <span v-for="trigger in nodeType.triggers" :key="trigger" class="block ml-4">
            - {{ trigger }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { getStatusBorderColor, getStatusColor } from './flow/status.js';

defineProps({
  nodeTypes: {
    type: Array,
    required: true,
  },
});

defineEmits(['drag-start']);
</script>

<style scoped>
</style>
