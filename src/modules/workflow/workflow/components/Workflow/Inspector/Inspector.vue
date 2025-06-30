<template>
    <div class="inspector-container" :class="{'disabled-container': !cell}">
        <div v-if="cell !== null">
            <MessageInspector :cell="cell" v-if="cell.get('type') === shapeTypesEnum.MESSAGE"/>
            <LinkInspector :cell="cell" v-else-if="cell.get('type') === shapeTypesEnum.LINK"/>
            <LabelInspector :cell="cell" v-if="cell.get('type') === shapeTypesEnum.FLOWCHART_START"/>
            <LabelInspector :cell="cell" v-else-if="cell.get('type') === shapeTypesEnum.FLOWCHART_END"/>
            <LabelInspector :cell="cell" v-else-if="cell.get('type') === shapeTypesEnum.FLOWCHART_CANCEL"/>
            <LabelInspector :cell="cell" v-else-if="cell.get('type') === shapeTypesEnum.FLOWCHART_POSTPONE"/>
        </div>
        <div v-else>
            Сонгоно уу
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import MessageInspector from './Message-inspector/Message-inspector.vue';
import LinkInspector from './Link-inspector/Link-inspector.vue';
import LabelInspector from './Label-inspector/Label-inspector.vue';
import { SharedEvents } from '../../../rappid/shared-events';
import { ShapeTypesEnum  as shapeTypesEnum } from '../../../rappid/shapes/app.shapes';

const eventBusService = getCurrentInstance().appContext.config.globalProperties.$eventBusService;
const eventBusServiceInstance = eventBusService;
const cell = ref(null);

const setSelection = (selection) => {
  const [selectedCell = null] = selection;
  cell.value = selectedCell;
};

onMounted(() => {
  const subscription = eventBusServiceInstance.subscribe(SharedEvents.SELECTION_CHANGED, setSelection);
  onBeforeUnmount(() => {
    subscription.unsubscribe();
  });
});
</script>
