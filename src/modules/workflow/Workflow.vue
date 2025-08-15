<template>
  <div class="flex khan-workflow-wrapper">
    <!-- Create Action Button -->
    <div class="absolute top-14 left-4 z-10" v-if="!isActionsVisible">
      <button
        class="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        title="Toggle Actions"
        @click="toggleActions"
      >
        <Icon name="plus" class="w-6 h-6" />
      </button>
    </div>

    <!-- Actions Panel -->
    <Actions
      v-if="isActionsVisible"
      :node-types="nodeTypes"
      @drag-start="onDragStart"
      class="border-r border-gray-200 bg-white dark:bg-gray-800"
    />
    <div class="flex-1" @drop="onDrop" @dragover="onDragOver" @dragleave="onDragLeave">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        @node-drag-stop="onNodeDragStop"
        @pane-ready="onPaneReady"
        @node-click="onNodeClick"
        @pane-click="onPaneClick"
        fit-view-on-init
        elevate-edges-on-select
        :class="{ dark }"
        class="khan-workflow"
      >
        <template #node-start="startProps">
          <StartNode
            v-bind="startProps"
            :selected="selectedNode?.id === startProps.id"
            @delete-node="deleteNode"
          />
        </template>
        <template #node-end="endProps">
          <EndNode
            v-bind="endProps"
            :selected="selectedNode?.id === endProps.id"
            @delete-node="deleteNode"
          />
        </template>
        <template #node-action="actionProps">
          <ActionNode
            v-bind="actionProps"
            @add-trigger="addTrigger"
            @delete-trigger="deleteTrigger"
            :selected="selectedNode?.id === actionProps.id"
            @delete-node="deleteNode"
          />
        </template>
        <template #node-trigger="triggerProps">
          <TriggerNode
            v-bind="triggerProps"
            :parent-node="triggerProps.parentNode"
            :selected="selectedNode?.id === triggerProps.id"
            @delete-node="deleteTrigger"
          />
        </template>
        <DropzoneBackground :is-drag-over="isDragOver" />
        <MiniMap />
        <Controls position="top-left">
          <ControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
            <Icon v-if="dark" name="sun" />
            <Icon v-else name="moon" />
          </ControlButton>
        </Controls>
      </VueFlow>
    </div>
    <Options
      v-if="selectedNode"
      :selected-node="selectedNode"
      :get-trigger-nodes="getTriggerNodes"
      @update-node-label="updateNodeLabel"
      @update-node-description="updateNodeDescription"
      @update-trigger-node="updateTriggerNode"
      @add-trigger="addTrigger"
      @update-subject="updateSubject"
      @delete-trigger="deleteTrigger"
      @delete-node="deleteNode"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted, watch } from 'vue';
import { Position, MarkerType } from '@vue-flow/core';
import { VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { ControlButton, Controls } from '@vue-flow/controls';
import { useVueFlow } from '@vue-flow/core';
import useDragAndDrop from './utils/useDnD';
import Actions from './Actions.vue';
import Options from './Options.vue';
import DropzoneBackground from './backgrounds/DropzoneBackground.vue';
import StartNode from './nodes/Start.vue';
import EndNode from './nodes/End.vue';
import ActionNode from './nodes/Action.vue';
import TriggerNode from './nodes/Trigger.vue';
import Icon from './icons/Icon.vue';
import { generateNodeId } from './utils/helper.js';
import { calculateTriggerWidth, calculateActionNodeWidth, TRIGGER_Y, TRIGGER_GAP, nodeTypes, mockNodes, mockEdges } from './config/config';

const props = defineProps({
  flowData: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['changed']);

const { addNodes, zoomOnScroll, addEdges, fitView, updateNode, removeNodes, screenToFlowCoordinate, onNodesInitialized, setViewport, toObject, removeEdges, updateNodeData, getNodes } = useVueFlow();
const { onDragStart, onDragOver, onDragLeave, isDragOver, draggedType } = useDragAndDrop();

const dark = ref(false);
const nodes = ref([]);
const edges = ref([]);
const selectedNode = ref(null);
const isActionsVisible = ref(false);

const toggleActions = () => {
  isActionsVisible.value = !isActionsVisible.value;
};

const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    unSelect();
  }
};

// Initialize flow data from props
onMounted(() => {
  zoomOnScroll.value = false;
  // try {
  //   console.log(props.flowData);
  //   console.log(props.flowData);
  //   if (props.flowData) {
  //
  //     const flow = JSON.parse(props.flowData);
  //     nodes.value = flow.nodes || mockNodes;
  //     edges.value = flow.edges || mockEdges;
  //   }
  //   // else {
  //   //   nodes.value = mockNodes;
  //   //   edges.value = mockEdges;
  //   // }
  // } catch (e) {
  //   console.error('Error parsing flowData:', e);
  //   nodes.value = mockNodes;
  //   edges.value = mockEdges;
  // }
  const { onConnect } = useVueFlow();
  onConnect(handleConnect);
  window.addEventListener('keydown', handleEscKey);


  // Set type="button" on all Vue Flow control buttons to prevent form submission
  const controls = document.querySelector('.vue-flow__controls');
  if (controls) {
    const buttons = controls.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.type = 'button';
    });
  }
});
watch(() => props.flowData, (newData, oldData) => {

  if (oldData === null && newData) {
        const flow = JSON.parse(props.flowData);
        nodes.value = flow.nodes || mockNodes;
        edges.value = flow.edges || mockEdges;
  }
}, { deep: false });

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey);
});

// Watch for changes in nodes and edges to emit updated flow data
// const onChange = (event) => {
//   const flowJson = toObject();
//   emit('changed', {nodes: flowJson.nodes, edges: flowJson.edges});
// }
watch([nodes, edges], () => {
  const flowJson = toObject();
  // console.log(flowJson);
  emit('changed', {nodes: flowJson.nodes.map(n=>{
    return {...n}
    }), edges: flowJson.edges});
}, { deep: true });

const getParentSubject = (parentNodeId) => {
  const parentNode = getNodes.value.find((node) => node.id === parentNodeId);
  return parentNode?.data?.subject || null;
};

const onDrop = (event) => {
  event.preventDefault();
  if (!draggedType.value) return;

  const position = screenToFlowCoordinate({
    x: event.clientX,
    y: event.clientY
  });

  const nodeId = generateNodeId();
  const draggedNodeType = draggedType.value;
  const nodeTypeDef = nodeTypes.find(nt => nt.type === draggedNodeType.type && nt.label === draggedNodeType.label);
  let newNodes = [];
  const baseNode = {
    id: nodeId,
    type: draggedNodeType.type,
    position,
    data: {
      label: nodeTypeDef.label,
      toolbarPosition: Position.Right,
      icon: nodeTypeDef.icon,
      color: nodeTypeDef.color,
      description: nodeTypeDef.description,
      subject: { ...nodeTypeDef.subject },
      ...(nodeTypeDef.triggers ? { triggers: nodeTypeDef.triggers } : {})
    }
  };

  if (draggedNodeType.type === 'action') {
    const triggers = nodeTypeDef.triggers || [];
    let currentX = 10;
    const triggerNodes = triggers.map((trigger, index) => {
      const triggerWidth = calculateTriggerWidth(trigger);
      const triggerNode = {
        id: `${nodeId}-${index + 1}`,
        type: 'trigger',
        parentNode: nodeId,
        position: { x: currentX, y: TRIGGER_Y },
        data: {
          label: trigger,
          toolbarPosition: Position.Right,
          parentSubject: { ...nodeTypeDef.subject }
        },
        extent: 'parent',
        expandParent: true,
        draggable: false,
        style: { width: `${triggerWidth}px` }
      };
      currentX += triggerWidth + TRIGGER_GAP;
      return triggerNode;
    });
    newNodes = [
      {
        ...baseNode,
        style: { width: `${calculateActionNodeWidth(nodeTypeDef.label,triggers)}px`, height: '90px' }
      },
      ...triggerNodes
    ];
  } else {
    newNodes = [baseNode];
  }

  const { off } = onNodesInitialized(() => {
    updateNode(nodeId, (node) => ({
      position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
    }));
    off();
  });

  addNodes(newNodes);
};

const handleConnect = (params) => {
  addEdges([{ ...params, id: `e${params.source}-${params.target}`, type: 'smoothstep', animated: false, markerEnd: { type: MarkerType.ArrowClosed } }]);
};

const onNodeDragStop = (event) => {
  const { node } = event;
  if (!node.parentNode) {
    nodes.value = nodes.value.map((n) =>
      n.id === node.id ? { ...n, position: node.position } : n
    );
  }
};

const onPaneReady = () => {
  fitView();
    if (props.flowData && nodes.value.length === 0) {
      const flow = JSON.parse(props.flowData);
      nodes.value = flow.nodes || mockNodes;
      edges.value = flow.edges || mockEdges;
      if(nodes.value.length === 0) {
        isActionsVisible.value = true;
      }
    } else {
      isActionsVisible.value = true;
    }
};

const onPaneClick = () => {
  unSelect();
};

const unSelect = () => {
  if (selectedNode.value) {

    selectedNode.value = null;
  }
  isActionsVisible.value = false;
};

const onNodeClick = (event) => {


  selectedNode.value = reactive({
    ...event.node,
    data: {
      label: event.node.data?.label || '',
      toolbarPosition: event.node.data?.toolbarPosition || Position.Right,
      icon: event.node.data?.icon,
      color: event.node.data?.color,
      description: event.node.data?.description || '',
      subject: event.node.data?.subject ? { ...event.node.data.subject } : null,
      ...(event.node.data?.triggers ? { triggers: event.node.data.triggers } : {}),
      ...(event.node.parentNode ? { parentSubject: getParentSubject(event.node.parentNode) } : {})
    }
  });

};

const updateNodeLabel = () => {
  if (selectedNode.value) {

    const triggerNodes = getTriggerNodes(selectedNode.value.id);

    const allTriggers = [...triggerNodes.map(t => t.data.label)];

    updateNode(selectedNode.value.id, (node) => ({
      ...node,
      data: { ...node.data, label: selectedNode.value.data.label },
      style: {
        width: `${calculateActionNodeWidth(selectedNode.value.data.label, allTriggers)}px`,
        height: '90px'
      }
    }));
  }
};

const updateNodeDescription = () => {
  if (selectedNode.value) {
    updateNode(selectedNode.value.id, (node) => ({
      ...node,
      data: { ...node.data, description: selectedNode.value.data.description }
    }));
  }
};

const updateSubject = (nodeId) => {
  if (selectedNode.value && selectedNode.value.id === nodeId) {
    updateNode(nodeId, (node) => ({
      ...node,
      data: {
        ...node.data,
        subject: { ...selectedNode.value.data.subject }
      }
    }));
  }
};

const getTriggerNodes = (parentId) => {
  return nodes.value.filter((node) => node.parentNode === parentId && node.type === 'trigger');
};

const getParentLabel = (parentId) => {
  let parent = nodes.value.filter((node) => node.parentNode === parentId);
  if(parent.length){
    return parent[0].label;
  }
  return "";
};

const addTrigger = (parentId) => {
  const triggerId = generateNodeId();
  const triggerNodes = getTriggerNodes(parentId);
  const triggerCount = triggerNodes.length;
  const newTriggerLabel = `Үйлдэл ${triggerCount + 1}`;
  const triggerWidth = calculateTriggerWidth(newTriggerLabel);
  let currentX = 10;

  triggerNodes.forEach((trigger, index) => {
    const width = calculateTriggerWidth(trigger.data.label);
    updateNode(trigger.id, (node) => ({
      ...node,
      position: { x: currentX, y: TRIGGER_Y }
    }));
    currentX += width + TRIGGER_GAP;
  });

  const parentNode = getNodes.value.find((node) => node.id === parentId);
  const newTrigger = {
    id: triggerId,
    type: 'trigger',
    parentNode: parentId,
    position: { x: currentX, y: TRIGGER_Y },
    data: {
      label: newTriggerLabel,
      toolbarPosition: Position.Right,
      parentSubject: parentNode?.data?.subject ? { ...parentNode.data.subject } : null
    },
    extent: 'parent',
    expandParent: true,
    draggable: false,
    style: { width: `${triggerWidth}px` }
  };
  addNodes([newTrigger]);

  const allTriggers = [...triggerNodes.map(t => t.data.label), newTriggerLabel];
  updateNode(parentId, (node) => ({
    ...node,
    style: {
      width: `${calculateActionNodeWidth(parentNode?.data?.label, allTriggers)}px`,
      height: '90px'
    }
  }));
};

const deleteTrigger = (triggerId) => {
  const triggerNode = nodes.value.find((n) => n.id === triggerId);
  if (triggerNode && triggerNode.parentNode) {
    const relatedEdges = edges.value.filter(e => e.source === triggerId || e.target === triggerId);
    removeEdges(relatedEdges.map(e => e.id));
    removeNodes([triggerId]);

    const parentId = triggerNode.parentNode;
    const remainingTriggers = getTriggerNodes(parentId).filter(e => e.id !== triggerId);
    const parentNode = nodes.value.find((node) => node.id === parentId);
    const parentLabel = parentNode?.data?.label || '';

    let currentX = 10;

    remainingTriggers.forEach((trigger, index) => {
      const width = calculateTriggerWidth(trigger.data.label);
      updateNode(trigger.id, (node) => ({
        ...node,
        position: { x: currentX, y: TRIGGER_Y }
      }));
      currentX += width + TRIGGER_GAP;
    });

    const triggerLabels = remainingTriggers.map(t => t.data.label);
    updateNode(parentId, (node) => ({
      ...node,
      style: {
        width: `${calculateActionNodeWidth(parentLabel, triggerLabels)}px`,
        height: '90px'
      }
    }));
  }
};

const deleteNode = (nodeId) => {
  const node = nodes.value.find(n => n.id === nodeId);
  if (!node) return;

  const nodesToRemove = [nodeId];
  if (node.type === 'action') {
    const childNodes = nodes.value.filter(n => n.parentNode === nodeId);
    nodesToRemove.push(...childNodes.map(n => n.id));
  }

  const relatedEdges = edges.value.filter(e =>
    nodesToRemove.includes(e.source) || nodesToRemove.includes(e.target)
  );
  removeEdges(relatedEdges.map(e => e.id));
  removeNodes(nodesToRemove);
  selectedNode.value = null;
};


const updateTriggerNode = (triggerId) => {
  const triggerNode = nodes.value.find((n) => n.id === triggerId);
  if (triggerNode) {
    const newWidth = calculateTriggerWidth(triggerNode.data.label);
    updateNode(triggerId, (node) => ({
      ...node,
      data: { ...node.data, label: triggerNode.data.label },
      style: { ...node.style, width: `${newWidth}px` }
    }));
  }

  const parentId = triggerNode.parentNode;
  const triggerNodes = getTriggerNodes(parentId);

  // Reposition all triggers
  let currentX = 10;
  triggerNodes.forEach((trigger) => {
    const width = calculateTriggerWidth(trigger.data.label);
    updateNode(trigger.id, (node) => ({
      ...node,
      position: { x: currentX, y: TRIGGER_Y }
    }));
    currentX += width + TRIGGER_GAP;
  });

  // Resize the parent action node
  const parentNode = getNodes.value.find((n) => n.id === parentId);
  const triggerLabels = triggerNodes.map(t => t.data.label);
  const newActionWidth = calculateActionNodeWidth(parentNode.data.label, triggerLabels);

  updateNode(parentId, (node) => ({
    ...node,
    style: { ...node.style, width: `${newActionWidth}px` }
  }));
};
function resetTransform() {
  setViewport({ x: 0, y: 0, zoom: 1 });
}

function toggleDarkMode() {
  dark.value = !dark.value;
}

function updatePos() {
  // Implement shuffle node positions logic if needed
}
</script>
