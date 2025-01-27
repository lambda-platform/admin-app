<template>
    <div class="json-editor-container">
        {{content}}
    </div>
</template>
<script setup >
import { ref, watch, onMounted } from 'vue';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SharedEvents } from '../../../rappid/controller';

const DEBOUNCE_TIME_MS = 500;

const props = defineProps({
  content: Object
});

const placeholder = 'e.g. { "cells": [{ "type": "app.Message"}] }';
const contentSubject = new Subject();
const eventBusService = getCurrentInstance().appContext.config.globalProperties.$eventBusService;

onMounted(() => {
  contentSubject.pipe(debounceTime(DEBOUNCE_TIME_MS)).subscribe((json) => {
    eventBusService.emit(SharedEvents.JSON_EDITOR_CHANGED, json);
  });
});

const parseJSON = (jsonString) => {
  let json;
  if (!jsonString) {
    json = { cells: [] };
  } else {
    try {
      json = JSON.parse(jsonString);
    } catch (e) {
      // Invalid JSON
      return;
    }
  }
  contentSubject.next(json);
};

// For filters, consider using a computed property or a method
const jsonFilter = (json) => {
  return JSON.stringify(json, null, 2);
};
</script>

<style lang="scss" scoped>
    .json-editor-container {
        border-top: 1px solid #D4D4D4;
        height: 200px;
        box-sizing: border-box;
        background: #F5F5F5;

        textarea {
            height: 100%;
            width: 100%;
            background: #F5F5F5;
            border: none;
            resize: none;
            color: #212121;
            font-family: realist, sans-serif;
            font-size: 13px;
            line-height: 15px;
            padding: 16px;
            outline: none;
        }
    }
</style>
