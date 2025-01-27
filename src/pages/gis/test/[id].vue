<template>
  <div class="fixed w-full">
    <div class="grid grid-cols-12 2xl:grid-cols-10 map-container h-screen bg-white dark:bg-slate-900">
      <div
        class="col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-2 p-6 overflow-y-auto bg-white dark:bg-slate-900">
        <div class="menu_style bg-white dark:bg-slate-900">
          <LayerList
            :categories="categories"
            @change-layer-unique-visible="changeLayerUniqueVisible"
            @change-layer-visible="changeLayerVisible"
          ></LayerList>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-8 xl:col-span-9 2xl:col-span-8 web-map">
        <div id="map">

        </div>
        <div id="popup" class="ol-popup text-[13px]">
          <a href="#" id="popup-closer" class="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>
        <basemapToggle @toggleGalleryVisibility="toggleGalleryVisibility"></basemapToggle>
        <basemapGallery :bases="bases" v-show="isGalleryVisible" @setBaseLayer="setBaseLayer"></basemapGallery>
        <Scalebar/>
        <Measure @startMeasure="startMeasure"/>
        <CoordinateBar/>
        <Locate/>

        <AreaSearch :map="map" v-if="ready"/>
      </div>
    </div>
  </div>
</template>

<script>
import mapMixin from "~/map/mixin"
import LayerList from "~/components/Map/LayerList.vue";

definePageMeta({
  layout: 'web',
})
export default {
  name: "index",
  mixins: [mapMixin],
  components: {LayerList},
  data() {
    return {
      mapID:"91a9eaac-3e0c-40a1-a9bb-09a1ed70d9f8",
      zoom: 12,
    };
  },
  beforeMount() {

    this.mapID = this.$route.params.id
  },
  methods: {},

}
</script>

<style scoped>

</style>
