<template>
  <div class="rappid-scope workflow" ref="elementRef">

    <div ref="toolbarRef"></div>
    <div class="side-bar">
      <div class="toggle-bar" :class="{'disabled-toggle-bar': !stencilOpened}">
        <div @click="toggleStencil()" class="icon toggle-stencil"
             :class="{'disabled-icon': !stencilOpened}"
             data-tooltip="Toggle Element Palette"
             data-tooltip-position-selector=".toggle-bar">

        </div>
        <!--                        <div @click="toggleJsonEditor()" class="icon toggle-editor"-->
        <!--                             :class="{'disabled-icon': !jsonEditorOpened}"-->
        <!--                             data-tooltip="Toggle JSON Editor"-->
        <!--                             data-tooltip-position-selector=".toggle-bar"></div>-->
      </div>
      <div v-show="stencilOpened" ref="stencilRef" class="stencil-container"></div>
    </div>
    <div class="main-container">
      <div ref="paperRef" class="paper-container"></div>
      <JsonEditor :content="fileJSON" v-show="jsonEditorOpened"/>

    </div>
    <Inspector/>
  </div>
</template>
<script setup>
import {ref, onMounted, onBeforeUnmount, reactive, defineProps, defineEmits, watch} from 'vue';
import {Subscription} from 'rxjs';
import RappidService from "../../services/rappid.service";
import JsonEditor from './Json-editor/Json-editor.vue';
import Inspector from './Inspector/Inspector.vue';
import {SharedEvents} from '../../rappid/controller';
import {importGraphFromJSON, loadStencilShapes, zoomToFit} from '../../rappid/actions';
import {STENCIL_WIDTH} from '../../theme';
import exampleGraphJSON from '../../rappid/config/example-graph.json';

const elementRef = ref(null);
const toolbarRef = ref(null);
const stencilRef = ref(null);
const paperRef = ref(null);
const stencilOpened = ref(true);
const jsonEditorOpened = ref(false);
const isStarted = ref(false);
const fileJSON = reactive({});

const subscriptions = new Subscription();
const eventBusService = getCurrentInstance().appContext.config.globalProperties.$eventBusService;
let rappid = null;

const props = defineProps({
  flowData: String
})


const emit = defineEmits(['changed'])


onMounted(() => {
  subscriptions.add(
      eventBusService.subscribe(SharedEvents.GRAPH_CHANGED, (json) => onRappidGraphChange(json))
  );
  subscriptions.add(
      eventBusService.subscribe(SharedEvents.JSON_EDITOR_CHANGED, (json) => onJsonEditorChange(json))
  );
  rappid = new RappidService(
      elementRef.value,
      paperRef.value,
      stencilRef.value,
      toolbarRef.value,
      eventBusService
  );
  setStencilContainerSize();
  onStart();
});

onBeforeUnmount(() => {
  if (rappid) {
    rappid.destroy();
  }
});

const openFile = (json) => {
  if(!isStarted.value) {
    fileJSON.value = json;
    importGraphFromJSON(rappid, json);
    zoomToFit(rappid);
  }
};

const onStart = () => {
  loadStencilShapes(rappid);
  if(props.flowData){
    openFile(JSON.parse(props.flowData));
  } else {
    // openFile("{}");
  }

};

const onJsonEditorChange = (json) => {
  if (rappid) {
    importGraphFromJSON(rappid, json);
  }
};

const onRappidGraphChange = (json) => {

  fileJSON.value = json;

  isStarted.value = true;


  emit('changed', json)
};

const onStencilToggle = () => {
  if (!rappid) {
    return;
  }
  const {scroller, stencil} = rappid;
  if (stencilOpened.value) {
    stencil.unfreeze();
    scroller.el.scrollLeft += STENCIL_WIDTH;
  } else {
    stencil.freeze();
    scroller.el.scrollLeft -= STENCIL_WIDTH;
  }
};

const toggleJsonEditor = () => {
  jsonEditorOpened.value = !jsonEditorOpened.value;
};

const toggleStencil = () => {
  stencilOpened.value = !stencilOpened.value;
  onStencilToggle();
};

const setStencilContainerSize = () => {
  if (stencilRef.value) {
    stencilRef.value.style.width = `${STENCIL_WIDTH}px`;
  }
};

watch(() => props.flowData, (newData, oldData) => {

  if (oldData === null && newData) {
    openFile(JSON.parse(props.flowData));
  }
}, { deep: false });

// You should handle subscriptions and event listening here
</script>
<style lang="scss">
@import "../../assets/fonts/index";

.workflow {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: realist, sans-serif;
  display: flex;
  min-width: 900px;

  .main-container {
    display: flex;
    flex-flow: column;
    height: 100%;
    overflow: hidden;
    flex: 1;
    position: relative;
    /*  Diagram  */
    .paper-container {

      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      z-index: 1;
      flex: 1;
      background: #F8F9FA;
    }
  }

  /*  Sidebar  */
  .side-bar {
    height: 100%;
    max-width: 250px;
    z-index: 2;
    background: none;


    .toggle-bar {
      height: 50px;
      width: 100%;
      background: #0b4da3;
      z-index: 2;
      display: flex;
      flex-flow: column;
      align-items: center;
      padding: 13px;

      .icon {
        margin-bottom: 26px;
        font-size: 24px;
        color: #FFFFFF;
        cursor: pointer;

        &:before {
          @include icon;
        }
      }

      .toggle-stencil {
        &:before {
          content: '\E39D'
        }
      }

      .toggle-editor {
        &:before {
          content: '\E86F'
        }
      }

      .disabled-icon {
        opacity: 0.35;
      }
    }

    .disabled-toggle-bar {
      position: absolute;
      top: 0;
      left: 0;
      height: 50px;
      width: 50px;
    }

    .stencil-container {
      height: 100%;
      position: relative;
    }
  }



  .inspector-container {
    height: 100%;
    top: 0;
    box-sizing: border-box;
    right: 0;
    width: 210px;
    padding: 16px;
    overflow: auto;
    border-left: 1px solid #D4D4D4;
    background: #FCFCFC;
  }

  h1 {
    text-align: left;
    font-family: realist, sans-serif;
    font-size: 16px;
    line-height: 19px;
    margin: 0 0 16px 0;
    letter-spacing: 0;
    color: #191919;
    opacity: 1;
  }

  label {
    text-align: left;
    font-family: realist, sans-serif;
    font-size: 13px;
    line-height: 16px;
    letter-spacing: 0;
    color: #3A3A3A;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    padding: 8px;
    text-overflow: ellipsis;
    outline: none;
    height: 35px;
    background: #FFFFFF;
    border: 1px solid #D4D4D4;
    opacity: 1;
    text-align: left;
    font-family: realist, sans-serif;
    letter-spacing: 0;
    color: #191919;
    margin-bottom: 16px;
    margin-top: 3px;

    &::placeholder {
      color: #6C6C6C;
    }
  }

  .icon-input-logo {
    position: absolute;
    margin-top: 12px;
    margin-left: 8px;
    display: block;

    &:after {
      content: '\E85D';
      @include icon;
      color: #191919;
      font-weight: 700;
      font-size: 18px;
    }
  }

  .icon-input {
    padding-left: 31px;
  }

  .disabled-container {
    h1, label, input {
      opacity: 0.6;
    }
  }

  .ports {
    margin-top: 10px;

    .out-ports-bar {
      width: 100%;
      height: 47px;
      margin: 0 -16px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #F5F5F5;
      border-bottom: 1px solid #D4D4D4;
      border-top: 1px solid #D4D4D4;
      box-sizing: content-box;

      span {
        text-align: left;
        font-family: realist, sans-serif;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 0;
        color: #3A3A3A;
      }
    }

    .add-port {
      height: 23px;
      width: 23px;
      border-radius: 50%;
      background: #0057FF;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      cursor: pointer;
      margin-right: 8px;
      outline: none;

      &:before {
        content: '\E145';
        @include icon;
        font-size: 18px;
        color: #FFFFFF;
        font-weight: 700;
      }

      &:hover {
        background: #0057FFBF;
      }

      &[disabled] {
        background: #BEBEBE;
        cursor: not-allowed;
      }
    }

    .add-ports {
      display: flex;
      width: 100%;
      justify-content: space-between;
      margin-top: 5px;
    }

    .port {
      margin-top: 8px;
      position: relative;
      margin-bottom: 16px;

      input {
        margin: auto;
        border-radius: 30px;
      }

      .remove-port {
        cursor: pointer;
        width: 23px;
        height: 23px;
        background: #727272;
        border-radius: 50%;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 8px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        outline: none;

        &:before {
          content: "\E5CD";
          @include icon;
          font-size: 14px;
          color: #FFFFFF;
          font-weight: 800;
        }
      }

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>
