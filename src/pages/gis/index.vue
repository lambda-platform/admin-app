<template>
  <div class="w-full">
    <div
      class="grid grid-cols-12 2xl:grid-cols-10 map-container h-screen border-t border-slate-100 dark:border-slate-900"
    >
      <div
        class="col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-2 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900"
      >
        <div class="menu_style">
          <LayerList
            :categories="categories"
            :user="user"
            @change-layer-unique-visible="changeLayerUniqueVisible"
            @change-layer-visible="changeLayerVisible"
          ></LayerList>
        </div>
      </div>
      <div
        class="col-span-12 lg:col-span-8 xl:col-span-9 2xl:col-span-8 web-map"
      >
        <div id="map"></div>
        <div id="popup" class="ol-popup text-[13px]">
          <a href="#" id="popup-closer" class="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>
        <basemapToggle
          @toggleGalleryVisibility="toggleGalleryVisibility"
        ></basemapToggle>
        <basemapGallery
          :bases="bases"
          v-show="isGalleryVisible"
          @setBaseLayer="setBaseLayer"
        ></basemapGallery>
        <Scalebar />
        <Measure @startMeasure="startMeasure" />
        <CoordinateBar />
        <Locate />
        <!--        <AreaSearch :map="map" v-if="ready"/>-->
      </div>
    </div>
  </div>
</template>

<script>
import mapMixin from "~/modules/map/mixin";
import LayerList from "~/modules/map/components/LayerList.vue";

definePageMeta({
  layout: "web",
});
export default {
  name: "index",
  mixins: [mapMixin],
  components: { LayerList },
  data() {
    return {
      mapID: "6b74ca1c-ea52-476e-9f32-ad57b4057bd7",
      zoom: 11,
    };
  },
  methods: {},
};
</script>
