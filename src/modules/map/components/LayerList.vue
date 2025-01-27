<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    style="width: 100%;"
    mode="inline"
    class="map-layer-list "
  >
    <a-sub-menu :key="`category-${catIndex}`" v-for="(category, catIndex) in categories">
      <template #icon>
        <div class="flex">
          <!--                  <img alt="" class="w-5 h-5" :src="category.icon"/>-->
          <img alt=""
               class="w-5 h-5 flex-none text-white transition-all duration-300 group-icon"
               :src="`${base_url}${category.icon}`"/>

        </div>
      </template>
      <template #title><span class="dark:text-white">{{ category.layer_category }}</span></template>
      <a-menu-item :key="`layer-${catIndex}-${layerIndex}`"
                   v-for="(layer, layerIndex) in category.layers.filter(layer=>!layer.unique_value_field && layer.legends.length && layer.legends.length > 0 && (!layer.is_permission || (layer.is_permission && user && layer.permissions.some(permission => permission.role_id === user.role))))">
        <template #icon>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
               v-if="layer.geometry_type === 'Polygon'">
            <path d="M14.5 7.31843V14H0.5V0.785098L14.5 7.31843Z" :fill="layer.legends[0].fill_color" :stroke="layer.legends[0].stroke_color"/>
          </svg>
          <svg width="18" height="3" viewBox="0 0 18 3" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="layer.geometry_type === 'LineString'">
            <rect width="18" height="3" :fill="layer.legends[0].fill_color"/>
          </svg>

          <img alt="" class="w-6 h-6" :src="`${base_url}${layer.legends[0].marker}`" v-if="layer.geometry_type === 'Point'"/>
        </template>

        <div @click="changeLayerVisible(catIndex, layer.id)"
             class="cursor-pointer flex items-center justify-between py-3">

          <div class="w-52 whitespace-normal" style="line-height: 20px !important;">
            <span class="dark:text-white">{{ layer.layer_title }}</span>
          </div>
          <img alt="" class="w-4 h-4"
               :src="layer.is_visible ? '/otorImage/image/Eye.svg' : '/otorImage/image/Eyeclose.svg'"/>
        </div>

      </a-menu-item>
      <a-sub-menu :key="`layer-${catIndex}-${layerIndex}`"
                  v-for="(layer, layerIndex) in category.layers.filter(layer=>layer.unique_value_field && layer.legends.length && layer.legends.length > 0 && (!layer.is_permission || (layer.is_permission && user && layer.permissions.some(permission => permission.role_id === user.role))))">
        <template #icon>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
               v-if="layer.geometry_type === 'Polygon'">
            <path d="M14.5 7.31843V14H0.5V0.785098L14.5 7.31843Z" :fill="layer.legends[0].fill_color" :stroke="layer.legends[0].stroke_color"/>
          </svg>

          <svg width="18" height="3" viewBox="0 0 18 3" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="layer.geometry_type === 'LineString'">
            <rect width="18" height="3" :fill="layer.legends[0].fill_color"/>
          </svg>

          <img alt="" class="w-6 h-6" :src="`${base_url}${layer.legends[0].marker}`" v-if="layer.geometry_type === 'Point'"/>
        </template>

        <template #title>
          <div @click="changeLayerVisible(catIndex, layer.id)"
               class="cursor-pointer flex items-center justify-between py-3 max-w-80px mr-6">

            <div class="w-52 whitespace-normal" style="line-height: 20px !important;">
              <span class="dark:text-white">{{ layer.layer_title }}</span>
            </div>
            <img alt="" class="w-4 h-4 cursor-pointer"
                 :src="layer.is_visible ? '/otorImage/image/Eye.svg' : '/otorImage/image/Eyeclose.svg'"/>
          </div>
        </template>
        <a-menu-item :key="`legend-${catIndex}-${layerIndex}-${uniqueValueInfoIndex}`"
                     v-for="(legend, uniqueValueInfoIndex) in layer.legends">
          <template #icon>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
                 v-if="legend.geometry_type === 'Polygon'">
              <path d="M14.5 7.31843V14H0.5V0.785098L14.5 7.31843Z" :fill="legend.fill_color" :stroke="legend.stroke_color"/>
            </svg>
            <svg width="18" height="3" viewBox="0 0 18 3" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="layer.geometry_type === 'LineString'">
              <rect width="18" height="3" :fill="layer.legends[0].fill_color"/>
            </svg>

            <img alt="" class="w-6 h-6" :src="`${base_url}${legend.marker}`" v-if="legend.geometry_type === 'Point'"/>
          </template>
          <div @click="changeLayerUniqueVisible(catIndex, layer, legend)"
               class="cursor-pointer flex items-center justify-between py-3">

            <div class="w-52 whitespace-normal" style="line-height: 20px !important;">
              <span class="dark:text-white">{{ legend.unique_value_label }}</span>
            </div>
            <img alt="" class="w-4 h-4"
                 :src="legend.unique_visible ? '/otorImage/image/Eye.svg' : '/otorImage/image/Eyeclose.svg'"/>
          </div>
        </a-menu-item>
      </a-sub-menu>
    </a-sub-menu>
  </a-menu>
</template>

<script setup>
import {base_url} from "~/consts/const";
import {defineEmits, defineProps, ref} from "vue";
const emit = defineEmits(['changeLayerUniqueVisible', 'changeLayerVisible']);
const props = defineProps({
  categories: Array,
  user: null,
})
const openKeys = ref([]);
const selectedKeys = ref([]);

function changeLayerVisible(catIndex, layerID){
  emit('changeLayerVisible', catIndex, layerID);
}

function changeLayerUniqueVisible(catIndex, layer, uniqueValueInfo){
  emit('changeLayerUniqueVisible', catIndex, layer, uniqueValueInfo);
}
</script>

<style scoped>

</style>
