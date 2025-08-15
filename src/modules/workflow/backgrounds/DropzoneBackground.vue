<template>
  <div class="dropzone-background">
    <Background :size="2" :gap="20" pattern-color="#BDBDBD" />
    <div class="overlay" :class="{ 'bg-blue-100': isDragOver }">
      <p v-if="isDragOver" class="text-blue-600 font-semibold">Буулгах</p>
    </div>
  </div>
</template>

<script setup>
import { Background } from '@vue-flow/background'
defineProps({
  isDragOver: Boolean,
})
</script>

<style scoped>
.dropzone-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}
</style>
