<template>
  <lambda-form-item :label=label :name="model.component" :meta="meta">
    <div ref="map" class="map"></div>
    <starter :started="started" @start="start" :selectedType="selectedType"></starter>
    <basemapToggle @toggleGalleryVisibility="toggleGalleryVisibility"></basemapToggle>
    <basemapGallery :bases="bases" v-show="isGalleryVisible" @setBaseLayer="setBaseLayer"></basemapGallery>
  </lambda-form-item>
</template>
<script>

import mixin from "./mixin_old";
export default {
  mixins:[mixin],
  data(){
    return {
      selectedType: 'Point',
      is3D: true,
    }
  }

}
</script>

