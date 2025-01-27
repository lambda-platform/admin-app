<template>
  <div>
    <VueSignaturePad width="100%" height="200px" ref="signaturePad" :options="{
  dotSize: (0.5 + 2.5) / 2,
  minWidth: 0.72,
  maxWidth: 3.75,
  throttle: 16,
  minDistance: 5,
  backgroundColor: 'rgba(0,0,0, 0)',
  penColor: 'rgba(28,67,132, 1)',
  velocityFilterWeight: 0.7,
  onBegin: () => {},
  onEnd: () => {}
}"></VueSignaturePad>
  </div>
</template>
<script setup>
import {ref} from "vue";
import { defineExpose } from 'vue';
const signaturePad = ref(false)
import { VueSignaturePad } from 'vue-signature-pad';

function save(){
  const { isEmpty, data } = signaturePad.value.saveSignature();
  return data
}
function clear() {
  signaturePad.value.clearSignature();
}
defineExpose( { save, clear });
</script>
