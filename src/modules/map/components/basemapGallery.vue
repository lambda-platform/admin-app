<template>
  <div class="basemap-gallery" >
    <div v-for="(layer, key) in bases" :key="key" @click="setBaseLayer(key)" class="basemap-thumbnail">
      <img :src="'/map/' + key + '.png'" alt="Basemap Thumbnail" />
    </div>
  </div>
</template>
<script >
export default {
  props:[ "bases"],
  emits:["setBaseLayer"],
  methods:{
    setBaseLayer(key){
      this.$emit("setBaseLayer", key)
    }
  }
}
</script>
